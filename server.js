import express from 'express';
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const session= require('express-session');
const TwitterStrategy = require('passport-twitter').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const app = express();

const httpService = require('./src/server/httpService');
const dbService= require('./src/server/dbFactory');
// adds the compiled version
//const service =require('./src/server/httpService.bundle.js');
//
app.set('port', (process.env.PORT) || 5000);


if (process.env.NODE_ENV !== 'production') {
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    var config = require('./webpack.config');
    var compiler = webpack(config);
    var configEnv = require('dotenv').config();
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
}


if (process.env.NODE_ENV === 'production') {
    app.set('MONGODB', process.env.PROD_MONGODB);

} else {
    app.set('MONGODB', 'mongodb://localhost:27017/freecodecampdyn');
}


app.set('KEY_QUANDL', process.env.QUANDL_KEY);
app.set('YELP_KEY',process.env.YELP_CONSUMER_KEY);
app.set('YELP_CONSUMER',process.env.YELP_CONSUMER_SECRET);

app.use(express.static(path.join(__dirname, 'dist')));



/**
 * passport local setup
 */



/**
 * endpoints for night challenge
 */
 app.get('/api/data/nightsearch',(request,response)=>{
     if (!app.get('YELP_TOKEN')){
         httpService.getToken(app.get('YELP_KEY'),app.get('YELP_CONSUMER'))
         .then(result=>{

         })
         .catch(err=>{

         })
     }

 });

 app.post('/api/data/nightadd',(request,response)=>{

 });

 app.post('/api/data/nightremove',(request,response)=>{

 });

app.get('/api/data/pollinfo', (request, response) => {

    try {
        service.getStockInformation(request, function () {

        });

    } catch (error) {


    }

});
/**
 * endpoint for challenge stock search
 * @param {*} request object to contain the request
 * @param {*} response response to the request to be sent to the client
 */
app.get('/api/data/stocksearch', (request, response) => {

    if (request.query.stockName === '') {
        response.status(500).send("UPS!!!! someone forgot something didnt they!!!");
        return;
    }
    let tmpKey = app.get('KEY_QUANDL');
    let tmpObj = {
        queryStock: request.query.stockName,
        startDate: request.query.startdate,
        endDate: request.query.enddate,
        keyQuandl: tmpKey
    };

    httpService.getStockInformation(tmpObj)
        .then((result) => {
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify(result.dataRecieved));
        })
        .catch((error) => {
            response.writeHead(500, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify({
                code: "fccda001",
                reason: error.messageError
            }));
        });



});


/**
 * entry point for the "server"
 */
app.get('*', (request, response) => {
    response.sendFile(__dirname + '/dist/index.html');

});

/**
 * function to set up the listener for the requests
 * @param port is the port defined above
 * @param callback is the callback to be activated
 * 
 */
app.listen(app.get('port'), (error) => {
    if (error) {
        console.log("error freecodecampdyn: " + error);
    } else {
        console.info("freecodecamp app is running on port", app.get('port'));
    }
});