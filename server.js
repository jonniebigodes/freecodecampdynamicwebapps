const fs= require('fs');
const express= require('express');
const path= require('path');
const passport= require('passport');
const strategy= require('passport-twitter').Strategy;
const app= express();

//var fs = require('fs');
//var express = require('express');
//var path = require('path');
//var app = express();
//var Factorydb= require('./src/server/dbFactory');
var service= require('./src/server/httpService');





app.set('port',(process.env.PORT)||5000);

if(process.env.NODE_ENV!=='production'){
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


app.set('KEY_QUANDL',process.env.QUANDL_KEY);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/data/pollinfo', function (request, response) {
    
    try {
        service.getStockInformation(request,function(){

        });
        
    } catch (error) {
        

    }

});

app.get('/api/data/stocksearch',function(request,response){
    //console.log("startdate:"+ request.query.startdate+" enddate:"+ request.query.enddate+ "data to search: "+ request.query.stockName);
    
    
    if (request.query.stockName===''){
        response.status(500).send("UPS!!!! someone forgot something didnt they!!!");
        return;
    }
    let tmpKey= app.get('KEY_QUANDL');
    
    //console.log("KEY GOT FROM SERVER: "+ tmpKey);
    let tmpObj={queryStock:request.query.stockName,startDate:request.query.startdate,endDate:request.query.enddate,keyQuandl:tmpKey};
    service.getStockInformation(tmpObj,function(err,data){
        if (data.error){
            response.writeHead(500,{'Content-Type':'application/json'});
            response.end("ERROR ON DATA");
            return ;
        }
        response.writeHead(200, {
                'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(data.dataRecieved));
            
    });
});
/**
 * entry point for the "server"
 */
app.get('*', function (request, response) {
    response.sendFile(__dirname + '/dist/index.html');

});

/**
 * function to set up the listener for the requests
 * @param port is the port defined above
 * @param callback is the callback to be activated
 * 
 */
app.listen(app.get('port'), function (error) {
    if (error) {
        console.log("error freecodecampdyn: " + error)
    } else {
        console.info("freecodecamp app is running on port", app.get('port'));


    }
});