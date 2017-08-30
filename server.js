import express from 'express';
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const session= require('express-session');
const bodyParse= require('body-parser');
//const TwitterStrategy = require('passport-twitter').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const app = express();


//const httpService = require('./httpService');
//const dbService= require('./dbFactory');

//dev
const httpService = require('./src/server/httpService');
const dbService= require('./src/server/dbFactory');

//
// adds the compiled version
//const service =require('./src/server/httpService.bundle.js');
//
app.set('port', (process.env.PORT) || 5000);


if (process.env.NODE_ENV !== 'production') {
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    //var config = require('../webpack.config');
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



app.use(bodyParse.json());
app.use(bodyParse.urlencoded(
    {
        extended:false
    }
));
app.use(session({
    secret:process.env.SESSION_HASH,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


/**
 * local passport serialization/deserialization
 */
passport.serializeUser((user, done)=>{
    console.log('====================================');
    console.log(`serialize usser:${user}`);
    console.log('====================================');
    done(null,user.id);

});

passport.deserializeUser((id,done)=>{
    console.log('====================================');
    console.log(`deserialize user:${id}`);
    console.log('====================================');
    dbService.connect()
             .then(result=>dbService.searchSingle('id',{collectionName:'users',data:id}))
             .then(resultSearch=>{
                 dbService.disconnect();
                 done(null,resultSearch);
             })
             .catch(err=>{
                 dbService.disconnect();
                 console.log('====================================');
                 console.log(`error deserializing user:${err}`);
                 console.log('====================================');
                 return done(err,null);
             })
});
/**
 * login strategy login
 */
passport.use('local-login',new LocalStrategy(
    {
        userNameField:'mail',
        passwordField:'password',
        passReqToCallback : true
    },(req,mail,password,done)=>{
        console.log('====================================');
        console.log(`LocalStrategy login`);
        console.log('====================================');
        dbService.connect()
                .then(result=>dbService.searchSingle('local_email',{collectionName:'users',data:mail}))
                .then(resultsearch=>{
                    console.log('====================================');
                    console.log(`resultsearch:${resultsearch.local_email}`);
                    console.log('====================================');
                    if (!resultsearch){
                        
                        dbService.disconnect();
                        return done(null,false);
                    }
                    if (resultsearch.local_password!==passport){
                        dbService.disconnect();
                        return done(null,false);
                    }

                    dbService.disconnect();
                    return done(null,user);

                })
                .catch(err=>{
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`error local-login err:${err}`);
                    console.log('====================================');
                    return done(err);
                })
    }));


/**
 * local signup
 */
passport.use('local-signup', 
        new LocalStrategy(
            {
                userNameField:'mail',
                passwordField:'password',
                passReqToCallback:true
            },(req,email,password,done)=>{
                console.log('====================================');
                console.log(`çocal-signup req.body.email:${req.body.email} email:${email} password:${password}`);
                console.log('====================================');
                dbService.connect()
                    .then(resultconnect=>dbService.searchSingle('local_mail',{collectionName:'users',data:email}))
                    .then(resultsearch=>{
                        console.log('====================================');
                        console.log(`local-signup`);
                        console.log('====================================');
                        if (resultsearch){
                            return done(null,false);
                        }
                        else{
                            let NewUser= {
                            twitter_id:'0',
                            twitter_user_token:'0',
                            twitter_username:'0',
                            twitter_display_name:'0',
                            local_password:password,
                            local_email:email,
                            facebook_id:'0',
                            facebook_token:'0',
                            facebook_display_name:'0',
                            facebook_username:'0'
                         };
                            dbService.injectData({collection:'users',data:NewUser}).then(resulInject=>{
                                dbService.disconnect();
                                return done(null,NewUser);
                            }).catch(errInject=>{
                                console.log('====================================');
                                console.log(`error strat inject data err:${err}`);
                                console.log('====================================');
                                return done(errInject,null);
                            })
                        }
                    })
                    .catch(err=>{
                        dbService.disconnect();
                        console.log('====================================');
                        console.log(`error local-login err:${err}`);
                        console.log('====================================');
                        return done(err);
                })
            }));



app.use(express.static(path.join(__dirname, 'dist')));



/**
 * passport session setup
 */
passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    dbService.connect()
             .then(result=>dbService.searchSingle({collectionName:'users',id:id}))
             .then(searchresult=>{
                 dbService.disconnect();
                 done(null,searchresult);
             })
             .catch(err=>{
                 console.log('====================================');
                 console.log(`error deserializing user:${err}`);
                 console.log('====================================');
                 dbService.disconnect();
                 done(err,null);
             })
});

/**
 * passport twitter
 */






/**
 * auth endpoints local
 */
app.post('/api/login/local/auth',passport.authenticate('local-login',
            {
                successRedirect:'/api/login/sucess',
                failureRedirect:'/api/login/fail'
            }
        )
    );

app.post('/api/login/local/signup',
    passport.authenticate('local-signup',{
        successRedirect:'/api/login/success',
        failureRedirect:'/api/login/fail'   
    })
);

app.get('/api/login/sucess',(req,res)=>{
    res.writeHead(200, {
                'Content-Type': 'application/json'
            });
    res.end(JSON.stringify(req.user));
});

app.get('/api/login/fail',(req,res)=>{
    
    res.writeHead(500, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                code: "fccda002",
                reason: "ERROR AUTH"
                }
            )
        );
});

app.get('/api/login/logoutok',(req,res)=>{
    res.writeHead(200, {
                'Content-Type': 'application/json'
            });
    res.end(JSON.stringify(
        {
            code: "fccda003",
            reason: "SESSION TERMINATED"
        })
    );
});

app.get('/api/login/logout',(req,res)=>{
    req.logout();
    res.redirect('/login/logoutok');
});



/**
 * endpoints for night challenge
 */

 app.get('/api/data/nightsearch',(request,response)=>{
    
     const yelptoken= app.get('YELP_TOKEN');
    
   
     if (!yelptoken){
        
        httpService.getToken(app.get('YELP_KEY'),app.get('YELP_CONSUMER'))
                    .then(result=>app.set('YELP_TOKEN',result))
                    .then(resulttoken=>httpService.searchYelp(app.get('YELP_TOKEN'),request.query.what,request.query.where,request.query.ammount))
                    .then(searchresult=>{
                      
                        //if is logged in check if query exists and add it to the database if not

                        //
                        response.writeHead(200, {
                           'Content-Type': 'application/json'
                       });
                       response.end(JSON.stringify(searchresult.dataRecieved));
                    })
                    .catch(err=>{
                        response.writeHead(500, {
                            'Content-Type': 'application/json'
                        });
                        response.end(JSON.stringify({
                            code: "fccda001",
                            reason: err.messageError
                        }));
                    })
     }
     else{
        httpService.searchYelp(yelptoken,request.query.what,request.query.where,request.query.ammount)
                    .then(searchresult=>{
           
                        response.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        response.end(JSON.stringify(searchresult.dataRecieved));
                    })
                    .catch(err=>{
                        response.writeHead(500, {
                            'Content-Type': 'application/json'
                        });
                        response.end(JSON.stringify({
                            code: "fccda001",
                            reason: err.messageError
                        }));
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
        dbService.setUrl(app.get('MONGODB'));
        console.info("freecodecamp app is running on port", app.get('port'));
    }
});