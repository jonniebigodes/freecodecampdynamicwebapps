const express =require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const bodyParse = require('body-parser');
const app = express();

if (process.env.NODE_ENV !== 'production') {
    let webpackDevMiddleware = require('webpack-dev-middleware');
    let webpackHotMiddleware = require('webpack-hot-middleware');
    let webpack = require('webpack');
    let config = require('../webpack.config');
    //let config = require('./webpack.config');
    let compiler = webpack(config);
    let configEnv = require('dotenv').config();
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        quiet:false,
        publicPath: config.output.publicPath,
        stats:{
            colors:true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(path.join(__dirname, 'dist')));
}

if (process.env.NODE_ENV === 'production') {
    app.MONGODB=process.env.PROD_MONGODB;
    //app.set('MONGODB', process.env.PROD_MONGODB);
} else {
    //app.set('MONGODB', 'mongodb://localhost:27017/freecodecampdyn');
    app.MONGODB='mongodb://localhost:27017/freecodecampdyn';
}
app.set('port', (process.env.PORT) || 5000);
//app.set('KEY_QUANDL', process.env.QUANDL_KEY);
app.KEY_QUANDL= process.env.QUANDL_KEY;
//app.set('YELP_KEY', process.env.YELP_CONSUMER_KEY);
app.YELP_KEY=process.env.YELP_CONSUMER_KEY;
//app.set('YELP_CONSUMER', process.env.YELP_CONSUMER_SECRET);
app.YELP_CONSUMER=process.env.YELP_CONSUMER_SECRET;
//app.set('BLUEKEY',process.env.BLUEAPIKEY);
app.BLUEKEY=process.env.BLUEAPIKEY;
app.locals.FACEBOOK_APP_ID= process.env.FACEBOOK_CLIENT_ID;
app.locals.FACEBOOK_APP_SECRET=process.env.FACEBOOK_CLIENT_SECRET;
app.locals.TWITTER_APP_ID=process.env.TWITTER_APP_KEY;
app.locals.TWITTER_APP_SECRET=process.env.TWITTER_APP_SECRET;
app.locals.APP_SWITCH='';
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: false}));
app.use(session({secret: process.env.SESSION_HASH, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
// let locationstatic='';
if (process.env.NODE_ENV !== 'production') {
    /* locationstatic=path.join(__dirname, 'dist');
    console.log('====================================');
    console.log(`dev mode location:${locationstatic}`);
    console.log('===================================='); */
    app.use(express.static(path.join(__dirname, 'dist')));
}
else{
    /* locationstatic=path.join(__dirname, '../dist');
    console.log('====================================');
    console.log(`prod mode location:${locationstatic}`);
    console.log('===================================='); */
    app.use(express.static(path.join(__dirname, '../dist')));
}

/**
 * function to set up the listener for the requests
 * @param port is the port defined above
 * @param error object to be used in case of error
 *
 */
app.listen(app.get('port'), (error) => {
    if (error) {
        console.log("error freecodecampdyn: " + error);
    } else {
        //dbService.setUrl(app.get('MONGODB'));
        console.info("freecodecamp app is running on port", app.get('port'));
    }
});
const appPassport=require('./passportconfig')(app,passport);
const appRoutes= require('./routes')(app,passport);