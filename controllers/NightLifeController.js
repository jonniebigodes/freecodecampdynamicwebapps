const httpService = require('./httpService'); 
const dbService=require('./dbFactory');
//const httpService = require('../src/server/httpService');
//const dbService = require('../src/server/dbFactory');
module.exports = {
    searchNights(request, response) {
        console.log('====================================');
        console.log(`token present:${request.app.YELP_TOKEN}`);
        console.log('====================================');
        if (!request.app.YELP_TOKEN) {
            httpService.getToken(request.app.YELP_KEY, request.app.YELP_CONSUMER)
                .then(result => request.app.YELP_TOKEN = result)
                .then(() => httpService.searchYelp(request.app.YELP_TOKEN, request.query.what, request.query.where, request.query.ammount))
                .then(searchresult => {
                    if (!searchresult.dataRecieved.num_items_response) {
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001",reason: "Something went wrong with the query "}));
                        return;
                    }
                    //if is logged in check if query exists and add it to the database if not
                    if (request.query.who) {
                        dbService.setUrl = request.app.MONGODB;
                        dbService
                            .connect()
                            .then(() => dbService.search({
                                collectionName: 'user_searches',
                                queryParam: {userToken: request.query.who,what: request.query.what,where: request.query.where,ammount: request.query.ammount}
                            }))
                            .then(resultuserSearches => {
                                /* console.log('====================================');
                                console.log(`searched items in db:${resultuserSearches.length} data:\n${JSON.stringify(resultuserSearches)}`);
                                console.log('===================================='); */
                                if (!resultuserSearches.length) {
                                    dbService
                                        .injectOneItem({
                                            collectionName: 'user_searches',
                                            data: {userToken: request.query.who,what: request.query.what,where: request.query.where,
                                                ammount: request.query.ammount,
                                                yelpsearchresults: searchresult.dataRecieved
                                            }
                                        })
                                        .then(() => {
                                            dbService.disconnect();
                                        })
                                        .catch(errInject => {
                                            dbService.disconnect();
                                            console.log('====================================');
                                            console.log(`NightLIfe controller Error err inject data searchNights: ${JSON.stringify(errInject,null,2)}`);
                                            console.log('====================================');
                                            response.writeHead(500, {'Content-Type': 'application/json'});
                                            response.end(JSON.stringify({code: "fccda001",reason: "Server Internal Error"}));
                                        })
                                }
                            })
                            .catch(err => {
                                console.log('====================================');
                                console.log(`error with injection of searches:\n${JSON.stringify(err,null,2)}`);
                                console.log('====================================');
                                response.writeHead(500, {
                                    'Content-Type': 'application/json'
                                });
                                response.end(JSON.stringify({
                                    code: "fccda001",
                                    reason: "Server Internal Error"
                                }));
                            })
                    }
                    //
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(searchresult.dataRecieved));
                })
                .catch(err => {
                    console.log('====================================');
                    console.log(`error with yelp search of searches:\n${JSON.stringify(err,null,2)}`);
                    console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001",reason: err.messageError}));
                })
        } else {
            httpService.searchYelp(request.app.YELP_TOKEN, request.query.what, request.query.where, request.query.ammount)
                .then(searchresult => {
                    if (!searchresult.dataRecieved.num_items_response) {
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001",reason: "Something went wrong with the query "}));
                        return;
                    }
                    if (request.query.who) {
                        dbService.setUrl = request.app.MONGODB;
                        dbService.connect().then(() => dbService.search({
                                collectionName: 'user_searches',
                                queryParam: {
                                    userToken: request.query.who,
                                    what: request.query.what,
                                    where: request.query.where,
                                    ammount: request.query.ammount
                                }
                        }))
                        .then(resultuserSearches => {
                           /*  console.log('====================================');
                            console.log(`searched items in db:${resultuserSearches.length} data:\n${JSON.stringify(resultuserSearches,null,2)}`);
                            console.log('===================================='); */
                            if (!resultuserSearches.length) {
                                dbService.injectOneItem(
                                    {
                                        collectionName: 'user_searches',data: {userToken: request.query.who,what: request.query.what,where: request.query.where,ammount: request.query.ammount,yelpsearchresults: searchresult.dataRecieved}
                                    })
                                    .then(() => {
                                        dbService.disconnect();
                                        response.writeHead(200, {'Content-Type': 'application/json'});
                                        response.end(JSON.stringify(searchresult.dataRecieved));
                                    })
                                    .catch(errInject => {
                                        dbService.disconnect();
                                        console.log('====================================');
                                        console.log(`NightLIfe controller Error err inject data searchNights: ${JSON.stringify(errInject,null,2)}`);
                                        console.log('====================================');
                                        response.writeHead(500, {'Content-Type': 'application/json'});
                                        response.end(JSON.stringify({code: "fccda001",reason: "Server Internal Error"}));
                                    })
                                }

                            })
                            .catch(err => {
                                console.log('====================================');
                                console.log(`error with injection of searches:\n${JSON.stringify(err,null,2)}`);
                                console.log('====================================');
                                response.writeHead(500, {'Content-Type': 'application/json'});
                                response.end(JSON.stringify({code: "fccda001",reason: "Server Internal Error"}));
                            })

                    }
                    
                })
                .catch(err => {
                    console.log('====================================');
                    console.log(`error with yelp search of searches:\n${JSON.stringify(err,null,2)}`);
                    console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001",reason: err.messageError}));
                })
        }
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
            })
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
            })
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
                })
            })
            .catch(err => {
                console.log('====================================');
                console.log(`Night Controller getUserSearches error connect:${JSON.stringify(err,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001",reason: "Server Internal Error"
                }));
            })
    }
};