import express from 'express';
//const fs = require('fs');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const bodyParse = require('body-parser');
//const TwitterStrategy = require('passport-twitter').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const app = express();

const httpService = require('./httpService'); 
const dbService=require('./dbFactory'); 
//const httpService = require('./src/server/httpService');
//const dbService = require('./src/server/dbFactory');


app.set('port', (process.env.PORT) || 5000);

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
app.set('YELP_KEY', process.env.YELP_CONSUMER_KEY);
app.set('YELP_CONSUMER', process.env.YELP_CONSUMER_SECRET);

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: false}));
app.use(session({secret: process.env.SESSION_HASH, resave: false, saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

/**
 * local passport serialization/deserialization
 */
passport.serializeUser((user, done) => {
    console.log('====================================');
    console.log(`serialize usser:${JSON.stringify(user)}`);
    console.log('====================================');
    done(null, user.id);

});

passport.deserializeUser((id, done) => {
    console.log('====================================');
    console.log(`deserialize user:${id}`);
    console.log('====================================');
    dbService
        .connect()
        .then(result => dbService.searchByID({collectionName: 'users',queryParam: {_id:id}}))
        .then(resultSearch => {
            dbService.disconnect();
            
            done(null, resultSearch[0]);
        })
        .catch(err => {
            dbService.disconnect();
            console.log('====================================');
            console.log(`error deserializing user:${err}`);
            console.log('====================================');
            return done(err, null);
        })
});
/**
 * login strategy login
 */
passport.use('local-login', new LocalStrategy({
    userNameField: 'mail',
    passwordField: 'password',
    passReqToCallback: true
}, (req, mail, password, done) => {
    console.log('====================================');
    console.log(`LocalStrategy login`);
    console.log('====================================');
    dbService
        .connect()
        .then(result => dbService.search({
            collectionName: 'users',
            queryParam: {
                local_email: mail
            }
        }))
        .then(resultsearch => {
            
            dbService.disconnect();
            if (resultsearch.length){
                console.log('====================================');
                console.log(`local login resultsearch id:${resultsearch[0]._id}\n email:${resultsearch[0].local_email}`);
                console.log('====================================');
                dbService.comparePassword(password,resultsearch[0].local_password).then(result=>{
                    if (result==='PWD_OK'){
                       
                        return done(null,{
                            id:resultsearch[0]._id,
                            twitter_id: '0',
                            twitter_user_token: '0',
                            twitter_username: '0',
                            twitter_display_name: '0',
                            local_password: password,
                            local_email: mail,
                            facebook_id: '0',
                            facebook_token: '0',
                            facebook_display_name: '0',
                            facebook_username: '0',
                            full_name:'0',
                            city:'0',
                            state:'0',
                            country:'0'
                        });
                    }
                    else{
                        return done(null,false);
                    }
                }).catch(err=>{
                    return done(null,false);
                })
            }
            else{
                return done(null,false);
            }

        })
        .catch(err => {
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
passport.use('local-signup', new LocalStrategy({
    userNameField: 'mail',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    console.log('====================================');
    console.log(`local-signup req.body.email:${req.body.username} email:${email} password:${password}`);
    console.log('====================================');
    dbService
        .connect()
        .then(resultconnect=>dbService.search({collectionName:'users',queryParam:{local_email:email}}))
        .then(resultsearch => {
            console.log('====================================');
            console.log(`local-signup resultsearch len:${resultsearch.length}`);
            console.log('====================================');
            
            if (resultsearch.length){
                dbService.disconnect();
                return done(null, false);
            }
            else{
                let NewUser = {
                    twitter_id: '0',
                    twitter_user_token: '0',
                    twitter_username: '0',
                    twitter_display_name: '0',
                    local_password: password,
                    local_email: email,
                    facebook_id: '0',
                    facebook_token: '0',
                    facebook_display_name: '0',
                    facebook_username: '0',
                    full_name:'0',
                    city:'0',
                    state:'0',
                    country:'0'
                };
                dbService
                .injectOneItem({collectionName: 'users', data: NewUser})
                .then(resultInject => {
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`data was injected`);
                    console.log('====================================');
                    NewUser.id = resultInject;
                    console.log('====================================');
                    console.log(`to be serialized:${NewUser.id}\nlocal_email:${NewUser.local_email} local_password:${NewUser.local_password}`);
                    console.log('====================================');
                    return done(null, NewUser);
                })
                .catch(errInject => {
                    console.log('====================================');
                    console.log(`error strat inject data err:${errInject}`);
                    console.log('====================================');
                    return done(errInject, null);
                })
            }

            
        })
        .catch(err => {
            dbService.disconnect();
            console.log('====================================');
            console.log(`error local-login err:${err}`);
            console.log('====================================');
            return done(err);
        })
}));

app.use(express.static(path.join(__dirname, 'dist')));


/**
 * passport twitter
 */

/**
 * auth endpoints local
 */
app.post('/api/login/local/auth', passport.authenticate('local-login', {
    successRedirect: '/api/login/sucess',
    failureRedirect: '/api/login/fail'
}));
/**
 * auth register endpoint
 */
app.post('/api/login/local/signup', passport.authenticate('local-signup', {
    successRedirect: '/api/login/sucess',
    failureRedirect: '/api/login/fail'
}));
/**
 * auth register/login endpoint success
 */
app.get('/api/login/sucess', (req, res) => {
    console.log('====================================');
    console.log(`login sucess result:${req.user._id}`);
    console.log('====================================');
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    res.end(JSON.stringify({authToken:req.user._id}));
});
/**
 * auth register/login fail
 */
app.get('/api/login/fail', (req, res) => {

    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({code: "fccda002", reason: "ERROR AUTH"}));
});
/**
 * auth logout sucess endpoint
 */
app.get('/api/login/logoutok', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({code: "fccda003", reason: "SESSION TERMINATED"}));
});
/**
 * auth endpoint logout
 */
app.get('/api/login/logout', (req, res) => {
    req.logout();
    res.redirect('/api/login/logoutok');
});

/**
 * nightlife coordinator endpoint to search for events
 */

app.get('/api/data/nightsearch', (request, response) => {
    const yelptoken = app.get('YELP_TOKEN');
    if (!yelptoken) {

        httpService.getToken(app.get('YELP_KEY'), app.get('YELP_CONSUMER'))
            .then(result => app.set('YELP_TOKEN', result))
            .then(resulttoken => httpService.searchYelp(app.get('YELP_TOKEN'), request.query.what, request.query.where, request.query.ammount))
            .then(searchresult => {
                if (!searchresult.dataRecieved.num_items_response){
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Something went wrong with the query "}));
                    return;
                }
                //if is logged in check if query exists and add it to the database if not
                if (request.query.who){
                    dbService.connect()
                    .then(result=>dbService.search(
                        {
                            collectionName:'user_searches',
                            queryParam:
                            {
                                userToken:request.query.who,
                                what:request.query.what,
                                where:request.query.where,
                                ammount:request.query.ammount
                            }
                        }
                    ))
                    .then(resultuserSearches=>{
                       console.log('====================================');
                       console.log(`searched items in db:${resultuserSearches.length} data:\n${JSON.stringify(resultuserSearches)}`);
                       console.log('====================================');
                       if (!resultuserSearches.length){
                           dbService.injectOneItem(
                               {
                                   collectionName:'user_searches',
                                   data:{
                                       userToken:request.query.who,
                                       what:request.query.what,
                                       where:request.query.where,
                                       ammount:request.query.ammount,
                                       yelpsearchresults:searchresult.dataRecieved
                                   }
                               }
                            ).then(injectResult=>{
                                dbService.disconnect();

                            }).catch(errInject=>{
                                dbService.disconnect();
                                console.log('====================================');
                                console.log(`err inject data:${errInject}`);
                                console.log('====================================');
                            })
                       }

                    })
                    .catch(err=>{
                        console.log('====================================');
                        console.log(`error with injection of searches:\n${err}`);
                        console.log('====================================');
                    })

                    
                }
                //
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(searchresult.dataRecieved));
            })
            .catch(err => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: err.messageError}));
            })
    } else {
        httpService
            .searchYelp(yelptoken, request.query.what, request.query.where, request.query.ammount)
            .then(searchresult => {
                if (!searchresult.dataRecieved.num_items_response){
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Something went wrong with the query "}));
                    return;
                }
                if (request.query.who){
                    dbService.connect()
                    .then(result=>dbService.search(
                        {
                            collectionName:'user_searches',
                            queryParam:
                            {
                                userToken:request.query.who,
                                what:request.query.what,
                                where:request.query.where,
                                ammount:request.query.ammount
                            }
                        }
                    ))
                    .then(resultuserSearches=>{
                       console.log('====================================');
                       console.log(`searched items in db:${resultuserSearches.length} data:\n${JSON.stringify(resultuserSearches)}`);
                       console.log('====================================');
                       if (!resultuserSearches.length){
                           dbService.injectOneItem(
                               {
                                   collectionName:'user_searches',
                                   data:{
                                       userToken:request.query.who,
                                       what:request.query.what,
                                       where:request.query.where,
                                       ammount:request.query.ammount,
                                       yelpsearchresults:searchresult.dataRecieved
                                   }
                               }
                            ).then(injectResult=>{
                                dbService.disconnect();

                            }).catch(errInject=>{
                                dbService.disconnect();
                                console.log('====================================');
                                console.log(`err inject data:${errInject}`);
                                console.log('====================================');
                            })
                       }

                    })
                    .catch(err=>{
                        console.log('====================================');
                        console.log(`error with injection of searches:\n${err}`);
                        console.log('====================================');
                    })

                    
                }
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(searchresult.dataRecieved));
            })
            .catch(err => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: err.messageError}));
            })
    }

});
/**
 * nightlife coordinator endpoint to add user from event
 */
app.post('/api/data/nightadd', (request, response) => {
    dbService
    .connect()
    .then(result=>dbService.injectOneItem({collectionName: 'goingnights', data: {user:request.body.userToken,location:request.body.location}}))
    .then(resultInject => {
        
        console.log('====================================');
        console.log(`data was injected`);
        console.log('====================================');
        dbService.disconnect();
        response.writeHead(200,{'Content-Type': 'application/json'});
        response.end(JSON.stringify({code:'fccda005',reason:"DATA ADDED"}));
    })
    .catch(errInject => {
        dbService.disconnect();
        console.log('====================================');
        console.log(`error strat inject data err:${errInject}`);
        console.log('====================================');
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({code: "fccda001", reason: errInject}));
    })
    
});
/**
 * nightlife coordinator endpoint to remove user from event
 */
app.post('/api/data/nightremove', (request, response) => {
    dbService
    .connect()
    .then(result=>dbService.removeOne({collectionName: 'goingnights', data: {user:request.body.userToken,location:request.body.location}}))
    .then(resultRemove=>{
        
        console.log('====================================');
        console.log(`data was removed`);
        console.log('====================================');
        dbService.disconnect();
        response.writeHead(200,{'Content-Type': 'application/json'});
        response.end(JSON.stringify({code: "fccda005", reason: "DATA TERMINATED"}));
    })
    .catch(errRemove=>{
        dbService.disconnect();
        console.log('====================================');
        console.log(`error strat inject data err:${errRemove}`);
        console.log('====================================');
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({code: "fccda001", reason: errRemove}));
    })
   
});
/**
 * nigthlife coordinator endpoint to get the user searches
 */
app.get('/api/data/usersearches',(request,response)=>{
    if (!request.query.who){
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({code: "fccda001", reason: "NO USER TOKEN"}));
        return;
    }
    dbService.connect()
        .then(resultconnect=>{

            Promise.all([
                dbService.search(
                    {
                        collectionName:'user_searches',
                        queryParam:{
                            userToken:request.query.who
                        }
                    }
                ),
                dbService.search(
                    {
                        collectionName:'goingnights',
                        queryParam:{
                            user:request.query.who
                        }
                    }
                )
            ])
            .then(responses=>{
                    dbService.disconnect();
                    const dbUserSearches=responses[0];
                    const dbUserEvents=responses[1];
                    

                    /* console.log('====================================');
                    console.log(`user searches len:${dbUserSearches.length} userevents lenght:${dbUserSearches.length}`);
                    console.log('===================================='); */
                    if ((!dbUserSearches.length)&&(!dbUserEvents.length)){
                        response.writeHead(200,{'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code:'fccda005',userData:"NO DATA"}));
                        return;
                    }

                    let userResponseData=dbUserSearches.map((item)=>{
                        item.yelpsearchresults.results.map((userSearchItem)=>{
                            let datainEvents= dbUserEvents.find(x=>x.location===userSearchItem.id);
                            if (datainEvents){
                                userSearchItem.isGoing=true;
                                return userSearchItem;
                            }
                            //console.log('====================================');
                            //console.log(`item user yelpResults:${JSON.stringify(userSearchItem,null,2)}`);
                            // console.log(`id place:${userSearchItem.id}`);
                            // console.log('====================================');
                            // console.log('====================================');
                            // console.log(`id place:${userSearchItem.id} item dbUserEvents present:${datainEvents} `);
                            // console.log('====================================');

                        });
                    });


                    console.log('====================================');
                    console.log(`changed items:${JSON.stringify(dbUserSearches,null,2)}`);
                    console.log('====================================');
                    
                    const userResults=[];
                    for (let item of dbUserSearches){
                        userResults.push(
                            {
                                where:item.where,
                                what:item.what,
                                howmany:item.ammount,
                                searchResults:item.yelpsearchresults
                            }
                        );
                    }
                    response.writeHead(200,{'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code:'fccda005',userData:userResults}));
                   /*  console.log('====================================');
                    console.log(`response query 2 result:\n${JSON.stringify(responses[1])}`);
                    console.log('===================================='); */

                    // 
                    //fs.writeFile('./queries.json',JSON.stringify(responses));

            })
            .catch(errQueries=>{
                console.log('====================================');
                console.log(`error promise all searches:${errQueries}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            })
        })
        .catch(err=>{
            dbService.disconnect();
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
    })
});
app.get('/api/data/pollinfo', (request, response) => {

    response
        .status(500)
        .send("NOT YET IMPLEMENTED");

});
/**
 * endpoint for challenge stock search
 * @param {*} request object to contain the request
 * @param {*} response response to the request to be sent to the client
 */
app.get('/api/data/stocksearch', (request, response) => {

    if (request.query.stockName === '') {
        response
            .status(500)
            .send("UPS!!!! someone forgot something didnt they!!!");
        return;
    }
    let tmpKey = app.get('KEY_QUANDL');
    let tmpObj = {
        queryStock: request.query.stockName,
        startDate: request.query.startdate,
        endDate: request.query.enddate,
        keyQuandl: tmpKey
    };

    httpService
        .getStockInformation(tmpObj)
        .then((result) => {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(result.dataRecieved)); 
        })
        .catch((error) => {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: error.messageError}));
        });

});

/**
 * entry point for the "server"
 */
app.get('*', (request, response) => {
    //response.sendFile(__dirname + '/dist/index.html');
    console.log(`deployed dir name:${__dirname}`);
    response.sendFile(__dirname+'/index.html');
    
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