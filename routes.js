// prod mode
const AuthController= require('./AuthController');
const NightsController=require('./NightLifeController');
const StocksController=require('./StockSearchController');
const BooksController=require('./BooksController');
const PollsController= require('./PollsController');
const dbService = require('./dbFactory');
const path = require('path');
//


// dev mode
/* const AuthController= require('./controllers/AuthController');
const NightsController=require('./controllers/NightLifeController');
const StocksController=require('./controllers/StockSearchController');
const BooksController=require('./controllers/BooksController');
const PollsController= require('./controllers/PollsController');
const dbService = require('./src/server/dbFactory'); */
//
const LocalStrategy = require('passport-local').Strategy;
module.exports=(app,passport)=>{
    
    passport.serializeUser((user, done) => {
        /* console.log('====================================');
        console.log(`serialize usser:${JSON.stringify(user)}`);
        console.log('===================================='); */
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
       /*  console.log('====================================');
        console.log(`deserialize user:${id}`);
        console.log('===================================='); */
        
        dbService.connect().then(() => dbService.searchByID({collectionName: 'users',queryParam: {_id:id}}))
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
    passport.use('local-login', new LocalStrategy({
        userNameField: 'mail',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, mail, password, done) => {
        /* console.log('====================================');
        console.log(`LocalStrategy login`);
        console.log('===================================='); */
        dbService.setUrl(req.app.MONGODB);
        dbService
            .connect()
            .then(() => dbService.search({
                collectionName: 'users',
                queryParam: {
                    local_email: mail
                }
            }))
            .then(resultsearch => {
                dbService.disconnect();
                if (resultsearch.length){
                   /*  console.log('====================================');
                    console.log(`local login resultsearch id:${resultsearch[0]._id}\n email:${resultsearch[0].local_email}`);
                    console.log('===================================='); */

                    if (dbService.comparePassword(password,resultsearch[0].local_password)==='PWD_OK'){
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
                                full_name:resultsearch[0].full_name,
                                city:resultsearch[0].city,
                                state:resultsearch[0].state,
                                country:resultsearch[0].country
                            });
                    }
                    else{
                        return done(null,false);
                    }
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
    passport.use('local-signup', new LocalStrategy({
        userNameField: 'mail',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
       /*  console.log('====================================');
        console.log(`local-signup req.body.email:${req.body.username} email:${email} password:${password}`);
        console.log('===================================='); */
        dbService.setUrl(req.app.MONGODB);
        dbService
            .connect()
            .then(()=>dbService.search({collectionName:'users',queryParam:{local_email:email}}))
            .then(resultsearch => {
                /* console.log('====================================');
                console.log(`local-signup resultsearch len:${resultsearch.length}`);
                console.log('===================================='); */
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
                    dbService.injectOneItem({collectionName: 'users', data: NewUser})
                        .then(resultInject => {
                            dbService.disconnect();
                           /*  console.log('====================================');
                            console.log(`data was injected`);
                            console.log('===================================='); */
                            NewUser.id = resultInject;
                           /*  console.log('====================================');
                            console.log(`to be serialized:${NewUser.id}\nlocal_email:${NewUser.local_email} local_password:${NewUser.local_password}`);
                            console.log('===================================='); */
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
    app.post('/api/login/local/auth',passport.authenticate('local-login',{
        successRedirect: '/api/login/sucess',
        failureRedirect: '/api/login/fail'
    }));
    app.post('/api/login/local/signup', passport.authenticate('local-signup', {
        successRedirect: '/api/login/sucess',
        failureRedirect: '/api/login/fail'
    }));
    app.get('/api/login/sucess',(req,res)=>{
        /* console.log('====================================');
        console.log(`login sucess result:${req.user._id}`);
        console.log('===================================='); */
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            {
                authToken:req.user._id,
                full_name:req.user.full_name=='0'?'':req.user.full_name,
                city:req.user.city=='0'?'':req.user.city,
                countrystate:req.user.state=='0'?'':req.user.state,
                country:req.user.country=='0'?'':req.user.country
            }
        ));
    });
    app.get('/api/login/fail',(req, res)=>{
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({code: "fccda001", reason: "LOGIN_NOK"}));
    });
    app.get('/api/login/logoutok',(req, res) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({code: "fccda003", reason: "SESSION TERMINATED"}));
    });
    app.get('/api/login/logout',(req, res) => {
        req.logout();
        res.redirect('/api/login/logoutok');
    });
    app.post('/api/login/local/authdatachange',AuthController.changeUserData);
    app.get('/api/data/nightsearch',NightsController.searchNights);
    app.post('/api/data/nightadd',NightsController.addNights);
    app.post('/api/data/nightremove',NightsController.removeNights);
    app.get('/api/data/usersearches',NightsController.getUserSearches);
    app.get('/api/data/stocksearch',StocksController.searchStockData);
    app.get('/api/data/getbooks',BooksController.getAllBooks);
    app.post('/api/data/bookadd',BooksController.addBookCollection);
    app.post('/api/data/tradebook',BooksController.tradeBook);
    app.get('/api/data/tradereject',BooksController.tradeReject);
    app.get('/api/data/tradeaccept',BooksController.tradeAccept);
    app.get('/api/data/getpolls',PollsController.getPolls);
    app.get('/api/data/getpolldetail',PollsController.getPollDetails);
    app.post('/api/data/delpoll',PollsController.deletePoll);
    app.post('/api/data/createpoll',PollsController.createPoll);
    app.post('/api/data/pollvote',PollsController.voteOnPoll);
    app.post('/api/data/addpolloption',PollsController.addPollOption); 
    app.get('*',(request,response)=>{
        //response.sendFile(__dirname + '/dist/index.html');
        response.sendFile('index.html',{root:path.join(__dirname,'../dist/')});
    });
};