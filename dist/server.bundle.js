'use strict';var _express=require('express'),_express2=_interopRequireDefault(_express);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var fs=require('fs'),path=require('path'),passport=require('passport'),session=require('express-session'),bodyParse=require('body-parser'),LocalStrategy=require('passport-local').Strategy,app=(0,_express2.default)(),httpService=require('./httpService'),dbService=require('./dbFactory');if(app.set('port',process.env.PORT||5e3),'production'!==process.env.NODE_ENV){var webpackDevMiddleware=require('webpack-dev-middleware'),webpackHotMiddleware=require('webpack-hot-middleware'),webpack=require('webpack'),config=require('../webpack.config'),compiler=webpack(config),configEnv=require('dotenv').config();app.use(webpackDevMiddleware(compiler,{noInfo:!0,publicPath:config.output.publicPath})),app.use(webpackHotMiddleware(compiler))}'production'===process.env.NODE_ENV?app.set('MONGODB',process.env.PROD_MONGODB):app.set('MONGODB','mongodb://localhost:27017/freecodecampdyn'),app.set('KEY_QUANDL',process.env.QUANDL_KEY),app.set('YELP_KEY',process.env.YELP_CONSUMER_KEY),app.set('YELP_CONSUMER',process.env.YELP_CONSUMER_SECRET),app.use(bodyParse.json()),app.use(bodyParse.urlencoded({extended:!1})),app.use(session({secret:process.env.SESSION_HASH,resave:!1,saveUninitialized:!0})),app.use(passport.initialize()),app.use(passport.session()),passport.serializeUser(function(a,b){console.log('===================================='),console.log('serialize usser:'+JSON.stringify(a)),console.log('===================================='),b(null,a.id)}),passport.deserializeUser(function(a,b){console.log('===================================='),console.log('deserialize user:'+a),console.log('===================================='),dbService.connect().then(function(){return dbService.searchByID({collectionName:'users',queryParam:{_id:a}})}).then(function(a){dbService.disconnect(),b(null,a[0])}).catch(function(a){return dbService.disconnect(),console.log('===================================='),console.log('error deserializing user:'+a),console.log('===================================='),b(a,null)})}),passport.use('local-login',new LocalStrategy({userNameField:'mail',passwordField:'password',passReqToCallback:!0},function(a,b,c,d){console.log('===================================='),console.log('LocalStrategy login'),console.log('===================================='),dbService.connect().then(function(){return dbService.search({collectionName:'users',queryParam:{local_email:b}})}).then(function(a){return dbService.disconnect(),a.length?void(console.log('===================================='),console.log('local login resultsearch id:'+a[0]._id+'\n email:'+a[0].local_email),console.log('===================================='),dbService.comparePassword(c,a[0].local_password).then(function(e){return'PWD_OK'===e?d(null,{id:a[0]._id,twitter_id:'0',twitter_user_token:'0',twitter_username:'0',twitter_display_name:'0',local_password:c,local_email:b,facebook_id:'0',facebook_token:'0',facebook_display_name:'0',facebook_username:'0',full_name:'0',city:'0',state:'0',country:'0'}):d(null,!1)}).catch(function(){return d(null,!1)})):d(null,!1)}).catch(function(a){return dbService.disconnect(),console.log('===================================='),console.log('error local-login err:'+a),console.log('===================================='),d(a)})})),passport.use('local-signup',new LocalStrategy({userNameField:'mail',passwordField:'password',passReqToCallback:!0},function(a,b,c,d){console.log('===================================='),console.log('local-signup req.body.email:'+a.body.username+' email:'+b+' password:'+c),console.log('===================================='),dbService.connect().then(function(){return dbService.search({collectionName:'users',queryParam:{local_email:b}})}).then(function(a){if(console.log('===================================='),console.log('local-signup resultsearch len:'+a.length),console.log('===================================='),a.length)return dbService.disconnect(),d(null,!1);var e={twitter_id:'0',twitter_user_token:'0',twitter_username:'0',twitter_display_name:'0',local_password:c,local_email:b,facebook_id:'0',facebook_token:'0',facebook_display_name:'0',facebook_username:'0',full_name:'0',city:'0',state:'0',country:'0'};dbService.injectOneItem({collectionName:'users',data:e}).then(function(a){return dbService.disconnect(),console.log('===================================='),console.log('data was injected'),console.log('===================================='),e.id=a,console.log('===================================='),console.log('to be serialized:'+e.id+'\nlocal_email:'+e.local_email+' local_password:'+e.local_password),console.log('===================================='),d(null,e)}).catch(function(a){return console.log('===================================='),console.log('error strat inject data err:'+a),console.log('===================================='),d(a,null)})}).catch(function(a){return dbService.disconnect(),console.log('===================================='),console.log('error local-login err:'+a),console.log('===================================='),d(a)})})),app.use(_express2.default.static(path.join(__dirname,'dist'))),app.post('/api/login/local/auth',passport.authenticate('local-login',{successRedirect:'/api/login/sucess',failureRedirect:'/api/login/fail'})),app.post('/api/login/local/signup',passport.authenticate('local-signup',{successRedirect:'/api/login/sucess',failureRedirect:'/api/login/fail'})),app.get('/api/login/sucess',function(a,b){console.log('===================================='),console.log('login sucess result:'+a.user._id),console.log('===================================='),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify({authToken:a.user._id}))}),app.get('/api/login/fail',function(a,b){b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda002',reason:'ERROR AUTH'}))}),app.get('/api/login/logoutok',function(a,b){b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda003',reason:'SESSION TERMINATED'}))}),app.get('/api/login/logout',function(a,b){a.logout(),b.redirect('/api/login/logoutok')}),app.get('/api/data/nightsearch',function(a,b){var c=app.get('YELP_TOKEN');c?httpService.searchYelp(c,a.query.what,a.query.where,a.query.ammount).then(function(c){return c.dataRecieved.num_items_response?void(a.query.who&&dbService.connect().then(function(){return dbService.search({collectionName:'user_searches',queryParam:{userToken:a.query.who,what:a.query.what,where:a.query.where,ammount:a.query.ammount}})}).then(function(b){console.log('===================================='),console.log('searched items in db:'+b.length+' data:\n'+JSON.stringify(b)),console.log('===================================='),b.length||dbService.injectOneItem({collectionName:'user_searches',data:{userToken:a.query.who,what:a.query.what,where:a.query.where,ammount:a.query.ammount,yelpsearchresults:c.dataRecieved}}).then(function(){dbService.disconnect()}).catch(function(a){dbService.disconnect(),console.log('===================================='),console.log('err inject data:'+a),console.log('====================================')})}).catch(function(a){console.log('===================================='),console.log('error with injection of searches:\n'+a),console.log('====================================')}),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify(c.dataRecieved))):(b.writeHead(500,{"Content-Type":'application/json'}),void b.end(JSON.stringify({code:'fccda001',reason:'Something went wrong with the query '})))}).catch(function(a){b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a.messageError}))}):httpService.getToken(app.get('YELP_KEY'),app.get('YELP_CONSUMER')).then(function(a){return app.set('YELP_TOKEN',a)}).then(function(){return httpService.searchYelp(app.get('YELP_TOKEN'),a.query.what,a.query.where,a.query.ammount)}).then(function(c){return c.dataRecieved.num_items_response?void(a.query.who&&dbService.connect().then(function(){return dbService.search({collectionName:'user_searches',queryParam:{userToken:a.query.who,what:a.query.what,where:a.query.where,ammount:a.query.ammount}})}).then(function(b){console.log('===================================='),console.log('searched items in db:'+b.length+' data:\n'+JSON.stringify(b)),console.log('===================================='),b.length||dbService.injectOneItem({collectionName:'user_searches',data:{userToken:a.query.who,what:a.query.what,where:a.query.where,ammount:a.query.ammount,yelpsearchresults:c.dataRecieved}}).then(function(){dbService.disconnect()}).catch(function(a){dbService.disconnect(),console.log('===================================='),console.log('err inject data:'+a),console.log('====================================')})}).catch(function(a){console.log('===================================='),console.log('error with injection of searches:\n'+a),console.log('====================================')}),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify(c.dataRecieved))):(b.writeHead(500,{"Content-Type":'application/json'}),void b.end(JSON.stringify({code:'fccda001',reason:'Something went wrong with the query '})))}).catch(function(a){b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a.messageError}))})}),app.post('/api/data/nightadd',function(a,b){dbService.connect().then(function(){return dbService.injectOneItem({collectionName:'goingnights',data:{user:a.body.userToken,location:a.body.location}})}).then(function(){console.log('===================================='),console.log('data was injected'),console.log('===================================='),dbService.disconnect(),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda005',reason:'DATA ADDED'}))}).catch(function(a){dbService.disconnect(),console.log('===================================='),console.log('error strat inject data err:'+a),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a}))})}),app.post('/api/data/nightremove',function(a,b){dbService.connect().then(function(){return dbService.removeOne({collectionName:'goingnights',data:{user:a.body.userToken,location:a.body.location}})}).then(function(){console.log('===================================='),console.log('data was removed'),console.log('===================================='),dbService.disconnect(),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda005',reason:'DATA TERMINATED'}))}).catch(function(a){dbService.disconnect(),console.log('===================================='),console.log('error strat inject data err:'+a),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a}))})}),app.get('/api/data/usersearches',function(a,b){return a.query.who?void dbService.connect().then(function(){Promise.all([dbService.search({collectionName:'user_searches',queryParam:{userToken:a.query.who}}),dbService.search({collectionName:'goingnights',queryParam:{user:a.query.who}})]).then(function(a){dbService.disconnect();var c=a[0],d=a[1];if(!c.length&&!d.length)return b.writeHead(200,{"Content-Type":'application/json'}),void b.end(JSON.stringify({code:'fccda005',userData:'NO DATA'}));c.map(function(a){a.yelpsearchresults.results.map(function(a){var b=d.find(function(b){return b.location===a.id});if(b)return a.isGoing=!0,a})});console.log('===================================='),console.log('changed items:'+JSON.stringify(c,null,2)),console.log('====================================');var e=[],f=!0,g=!1,h=void 0;try{for(var i,j,k=c[Symbol.iterator]();!(f=(i=k.next()).done);f=!0)j=i.value,e.push({where:j.where,what:j.what,howmany:j.ammount,searchResults:j.yelpsearchresults})}catch(a){g=!0,h=a}finally{try{!f&&k.return&&k.return()}finally{if(g)throw h}}b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda005',userData:e}))}).catch(function(a){console.log('===================================='),console.log('error promise all searches:'+a),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:'Server Internal Error'}))})}).catch(function(){dbService.disconnect(),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:'Server Internal Error'}))}):(b.writeHead(500,{"Content-Type":'application/json'}),void b.end(JSON.stringify({code:'fccda001',reason:'NO USER TOKEN'})))}),app.get('/api/data/pollinfo',function(a,b){b.status(500).send('NOT YET IMPLEMENTED')}),app.get('/api/data/stocksearch',function(a,b){if(''===a.query.stockName)return void b.status(500).send('UPS!!!! someone forgot something didnt they!!!');var c=app.get('KEY_QUANDL'),d={queryStock:a.query.stockName,startDate:a.query.startdate,endDate:a.query.enddate,keyQuandl:c};httpService.getStockInformation(d).then(function(a){b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify(a.dataRecieved))}).catch(function(a){b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a.messageError}))})}),app.get('*',function(a,b){b.sendFile(__dirname+'/index.html')}),app.listen(app.get('port'),function(a){a?console.log('error freecodecampdyn: '+a):(dbService.setUrl(app.get('MONGODB')),console.info('freecodecamp app is running on port',app.get('port')))});