// prod mode
const httpService = require('./httpService'); 
const dbService=require('./dbFactory');
//
// dev mode
/* const httpService = require('../src/server/httpService');
const dbService = require('../src/server/dbFactory'); */

//
module.exports = {
    getYelpToken(request,response){
        console.log('====================================');
        console.log(`yelp token:${request.app.YELP_KEY} yelp consumer:${request.app.YELP_CONSUMER}`);
        console.log('====================================');
        httpService
        .getToken(request.app.YELP_KEY, request.app.YELP_CONSUMER)
        .then(result=>{
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005",userToken: result}));
        }).catch(err=>{
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001",reason: "Something went wrong getting the token "}));
        });
    },

    searchNights(request, response) {
        if (!request.body.tokenyelp){
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001",reason: "No token provided"}));
            return;
        }
        httpService.searchYelp(request.body.tokenyelp,request.body.what,request.body.where,request.body.ammount)
        .then(searchresult=>{
            if (!searchresult.dataRecieved.num_items_response) {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001",reason: "Something went wrong with the query "}));
                return;
            }
            if (!request.body.who){
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code:"fccda005",dataRecieved:searchresult.dataRecieved}));
                return;
            }
            dbService.setUrl = request.app.MONGODB;
            dbService.connect()
            .then(()=>dbService.search(
                {
                    collectionName:'user_searches',
                    queryParam:{
                        userToken: request.query.who,
                        what: request.query.what,
                        where: request.query.where,
                        ammount: request.query.ammount
                    }
                }
            ))
            .then(resultusersearches=>{
                if (!resultusersearches.length){
                    dbService.injectOneItem({collectionName: 'user_searches',
                    data:{userToken: request.query.who,what: request.query.what,where: request.query.where,
                        ammount: request.query.ammount,
                        yelpsearchresults: searchresult.dataRecieved
                    }
                    }).then(()=>{
                        dbService.disconnect();
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code:"fccda005",dataRecieved:searchresult.dataRecieved}));
                        return;
                    });
                }
            }).catch(errorSearches=>{
                dbService.disconnect();
                console.log('====================================');
                console.log(`error with yelp search of searches:\n${JSON.stringify(errorSearches,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001",reason: "Internal server error"}));
                return;
            });
            
        }).catch(error=>{
            console.log('====================================');
            console.log(`error with yelp search of searches:\n${JSON.stringify(error,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001",reason: "Internal server error"}));
        });
    },
    addNights(request, response) {
        dbService.setUrl=request.app.MONGODB;
        dbService.connect().then(() => dbService.injectOneItem({collectionName: 'goingnights',data: {user: request.body.userToken,location: request.body.location}}))
            .then(() => {
                dbService.disconnect();
                /* console.log('====================================');
                console.log(`data was injected`);
                console.log('===================================='); */
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: 'fccda005',reason: "DATA ADDED"}));
            })
            .catch(errInject => {
                dbService.disconnect();
                console.log('====================================');
                console.log(`error strat inject data err:${errInject}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: errInject}));
            });
    },
    removeNights(request, response) {
        dbService.setUrl=request.app.MONGODB;
        dbService.connect()
            .then(() => dbService.removeOne({collectionName: 'goingnights',data: {user: request.body.userToken,ocation: request.body.location}}))
            .then(() => {
                /* console.log('====================================');
                console.log(`data was removed`);
                console.log('===================================='); */
                dbService.disconnect();
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda005",reason: "DATA TERMINATED"}));
            })
            .catch(errRemove => {
                dbService.disconnect();
                console.log('====================================');
                console.log(`error strat inject data err:${errRemove}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001",reason: errRemove}));
            });
    },
    getUserSearches(request, response) {
        if (!request.query.who) {
            response.writeHead(500, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify({code: "fccda001",reason: "NO USER TOKEN"}));
            return;
        }
        dbService.connect().then(() => {
                Promise.all([dbService.search({collectionName: 'user_searches',queryParam: {userToken: request.query.who}}),
                dbService.search({collectionName: 'goingnights',queryParam: {user: request.query.who}})
                ]).then(responses => {
                    dbService.disconnect();
                    const dbUserSearches = responses[0];
                    const dbUserEvents = responses[1];

                    if ((!dbUserSearches.length) && (!dbUserEvents.length)) {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: 'fccda005',userData: "NO DATA"}));
                        return;
                    }
                    let userResponseData = dbUserSearches.map((item) => {
                        item.yelpsearchresults.results.map((userSearchItem) => {
                                let datainEvents = dbUserEvents.find(x => x.location === userSearchItem.id);
                                if (datainEvents) {
                                    userSearchItem.isGoing = true;
                                    return userSearchItem;
                                }
                            });
                    });
                   /*  console.log('====================================');
                    console.log(`changed items:${JSON.stringify(dbUserSearches, null, 2)}`);
                    console.log('===================================='); */

                    const userResults = [];
                    for (let item of dbUserSearches) {
                        userResults.push({where: item.where,what: item.what,howmany: item.ammount,searchResults: item.yelpsearchresults});
                    }
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: 'fccda005',userData: userResults}));
                }).catch(errQueries => {
                    console.log('====================================');
                    console.log(`error promise all searches:${JSON.stringify(errQueries,null,2)}`);
                    console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001",reason: "Server Internal Error"}));
                });
            })
            .catch(err => {
                console.log('====================================');
                console.log(`Night Controller getUserSearches error connect:${JSON.stringify(err,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001",reason: "Server Internal Error"
                }));
            });
    }
};