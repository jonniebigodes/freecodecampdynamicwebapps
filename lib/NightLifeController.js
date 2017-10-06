'use strict';var httpService=require('./httpService'),dbService=require('./dbFactory');module.exports={searchNights:function searchNights(a,b){a.app.YELP_TOKEN?httpService.searchYelp(a.app.YELP_TOKEN,a.query.what,a.query.where,a.query.ammount).then(function(c){return c.dataRecieved.num_items_response?void(a.query.who&&(dbService.setUrl=a.app.MONGODB,dbService.connect().then(function(){return dbService.search({collectionName:'user_searches',queryParam:{userToken:a.query.who,what:a.query.what,where:a.query.where,ammount:a.query.ammount}})}).then(function(d){console.log('===================================='),console.log('searched items in db:'+d.length+' data:\n'+JSON.stringify(d,null,2)),console.log('===================================='),d.length||dbService.injectOneItem({collectionName:'user_searches',data:{userToken:a.query.who,what:a.query.what,where:a.query.where,ammount:a.query.ammount,yelpsearchresults:c.dataRecieved}}).then(function(){dbService.disconnect(),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify(c.dataRecieved))}).catch(function(a){dbService.disconnect(),console.log('===================================='),console.log('NightLIfe controller Error err inject data searchNights: '+JSON.stringify(a,null,2)),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:'Server Internal Error'}))})}).catch(function(a){console.log('===================================='),console.log('error with injection of searches:\n'+JSON.stringify(a,null,2)),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:'Server Internal Error'}))}))):(b.writeHead(500,{"Content-Type":'application/json'}),void b.end(JSON.stringify({code:'fccda001',reason:'Something went wrong with the query '})))}).catch(function(a){console.log('===================================='),console.log('error with yelp search of searches:\n'+JSON.stringify(a,null,2)),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a.messageError}))}):httpService.getToken(a.app.YELP_KEY,a.app.YELP_CONSUMER).then(function(b){return a.app.YELP_TOKEN=b}).then(function(){return httpService.searchYelp(a.app.YELP_TOKEN,a.query.what,a.query.where,a.query.ammount)}).then(function(c){return c.dataRecieved.num_items_response?void(a.query.who&&(dbService.setUrl=a.app.MONGODB,dbService.connect().then(function(){return dbService.search({collectionName:'user_searches',queryParam:{userToken:a.query.who,what:a.query.what,where:a.query.where,ammount:a.query.ammount}})}).then(function(d){console.log('===================================='),console.log('searched items in db:'+d.length+' data:\n'+JSON.stringify(d)),console.log('===================================='),d.length||dbService.injectOneItem({collectionName:'user_searches',data:{userToken:a.query.who,what:a.query.what,where:a.query.where,ammount:a.query.ammount,yelpsearchresults:c.dataRecieved}}).then(function(){dbService.disconnect()}).catch(function(a){dbService.disconnect(),console.log('===================================='),console.log('NightLIfe controller Error err inject data searchNights: '+JSON.stringify(a,null,2)),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:'Server Internal Error'}))})}).catch(function(a){console.log('===================================='),console.log('error with injection of searches:\n'+JSON.stringify(a,null,2)),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:'Server Internal Error'}))})),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify(c.dataRecieved))):(b.writeHead(500,{"Content-Type":'application/json'}),void b.end(JSON.stringify({code:'fccda001',reason:'Something went wrong with the query '})))}).catch(function(a){console.log('===================================='),console.log('error with yelp search of searches:\n'+JSON.stringify(a,null,2)),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a.messageError}))})},addNights:function addNights(a,b){dbService.setUrl=a.app.MONGODB,dbService.connect().then(function(){return dbService.injectOneItem({collectionName:'goingnights',data:{user:a.body.userToken,location:a.body.location}})}).then(function(){dbService.disconnect(),console.log('===================================='),console.log('data was injected'),console.log('===================================='),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda005',reason:'DATA ADDED'}))}).catch(function(a){dbService.disconnect(),console.log('===================================='),console.log('error strat inject data err:'+a),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a}))})},removeNights:function removeNights(a,b){dbService.setUrl=a.app.MONGODB,dbService.connect().then(function(){return dbService.removeOne({collectionName:'goingnights',data:{user:a.body.userToken,ocation:a.body.location}})}).then(function(){console.log('===================================='),console.log('data was removed'),console.log('===================================='),dbService.disconnect(),b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda005',reason:'DATA TERMINATED'}))}).catch(function(a){dbService.disconnect(),console.log('===================================='),console.log('error strat inject data err:'+a),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:a}))})},getUserSearches:function getUserSearches(a,b){return a.query.who?void dbService.connect().then(function(){Promise.all([dbService.search({collectionName:'user_searches',queryParam:{userToken:a.query.who}}),dbService.search({collectionName:'goingnights',queryParam:{user:a.query.who}})]).then(function(a){dbService.disconnect();var c=a[0],d=a[1];if(!c.length&&!d.length)return b.writeHead(200,{"Content-Type":'application/json'}),void b.end(JSON.stringify({code:'fccda005',userData:'NO DATA'}));c.map(function(a){a.yelpsearchresults.results.map(function(a){var b=d.find(function(b){return b.location===a.id});if(b)return a.isGoing=!0,a})});console.log('===================================='),console.log('changed items:'+JSON.stringify(c,null,2)),console.log('====================================');var e=[],f=!0,g=!1,h=void 0;try{for(var i,j,k=c[Symbol.iterator]();!(f=(i=k.next()).done);f=!0)j=i.value,e.push({where:j.where,what:j.what,howmany:j.ammount,searchResults:j.yelpsearchresults})}catch(a){g=!0,h=a}finally{try{!f&&k.return&&k.return()}finally{if(g)throw h}}b.writeHead(200,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda005',userData:e}))}).catch(function(a){console.log('===================================='),console.log('error promise all searches:'+JSON.stringify(a,null,2)),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:'Server Internal Error'}))})}).catch(function(a){console.log('===================================='),console.log('Night Controller getUserSearches error connect:'+JSON.stringify(a,null,2)),console.log('===================================='),b.writeHead(500,{"Content-Type":'application/json'}),b.end(JSON.stringify({code:'fccda001',reason:'Server Internal Error'}))}):(b.writeHead(500,{"Content-Type":'application/json'}),void b.end(JSON.stringify({code:'fccda001',reason:'NO USER TOKEN'})))}};