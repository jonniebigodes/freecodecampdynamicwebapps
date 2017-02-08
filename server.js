var fs = require('fs');
var express = require('express');
var path = require('path');
var app = express();
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
app.use(express.static(path.join(__dirname, 'dist')));


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
        console.log("error freecodecampApi: " + error)
    } else {
        console.info("freecodecamp app is running on port", app.get('port'));


    }
});