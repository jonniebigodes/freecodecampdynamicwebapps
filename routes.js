// prod mode
const AuthController= require('./AuthController');
const NightsController=require('./NightLifeController');
const StocksController=require('./StockSearchController');
const BooksController=require('./BooksController');
const PollsController= require('./PollsController');
const path = require('path');
//


// dev mode
/* const AuthController= require('./controllers/AuthController');
const NightsController=require('./controllers/NightLifeController');
const StocksController=require('./controllers/StockSearchController');
const BooksController=require('./controllers/BooksController');
const PollsController= require('./controllers/PollsController'); */
//


module.exports=(app,passport)=>{    
    //
    app.get('/api/login/fb/auth',
        passport.authenticate('facebook', { scope : ['email'] }));
        
    app.get('/api/login/fb/callback',passport.authenticate('facebook',{
        successRedirect: '/api/login/sucess',
        failureRedirect: '/api/login/fail'
    }));

    app.get('/api/login/fb/connect',passport.authorize('facebook',{scope : ['email']}));

    app.get('/api/login/fb/connect/callback',passport.authorize('facebook',{
        successRedirect: '/api/login/sucess',
        failureRedirect: '/api/login/fail'
    }));

    //twitter auth
    app.get('/api/login/votting/twitter/connect',passport.authenticate('twitter',{scope:'email'}));
    app.get('/api/login/twitter/connect/callback',passport.authenticate('twitter',{
        successRedirect: '/api/login/votting/social/sucess',
        failureRedirect: '/api/login/fail'
    }));
    app.get('/api/login/votting/social/sucess',(req,res)=>{
        res.redirect(`/voting/${req.user._id}`); // add arguments
    });
    //
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
    /* app.get('/api/login/unlink',(req,res)=>{
        
    }); */
    app.post('/api/login/local/authdatachange',AuthController.changeUserData);
    app.post('/api/login/social/getuserinfo',AuthController.getUserSocialData);
    app.get('/api/data/nighttoken',NightsController.getYelpToken);
    app.post('/api/data/nightsearch',NightsController.searchNights);
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
    app.post('/api/data/pollshare',PollsController.sharePoll);
    app.get('*',(request,response)=>{
        //response.sendFile(__dirname + '/dist/index.html');
        response.sendFile('index.html',{root:path.join(__dirname,'../dist/')});
    });
    
};