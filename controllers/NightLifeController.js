// prod mode
const httpService = process.env.NODE_ENV !== 'production'?require('../src/server/httpService'):require('./httpService'); 
const dbService=process.env.NODE_ENV !== 'production'?require('../src/server/dbFactory'):require('./dbFactory');
const logger=  process.env.NODE_ENV!== 'production' ? require('../logger'):require('./logger');
module.exports = {
    getYelpToken(request,response){
        httpService
        .getToken(request.app.YELP_KEY, request.app.YELP_CONSUMER)
        .then(result=>{
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005",userToken: result}));
        }).catch(err=>{
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001",reason: "Something went wrong getting the token "}));
            logger.error(`Error getting the token:${JSON.stringify(err,null,2)}`);
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
           
            if (!request.body.tokenUser){
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code:"fccda005",dataRecieved:searchresult.dataRecieved}));
                return;
            }
            dbService.setUrl(request.app.MONGODB);
            dbService.connect()
            .then(()=>dbService.search(
                {
                    collectionName:'user_searches',
                    queryParam:{
                        userToken: request.body.tokenUser
                    }
                }
            ))
            .then(resultusersearches=>{
                // console.log('====================================');
                // console.log(`result searches len:${resultusersearches.length}`);
                // console.log('====================================');
                if (!resultusersearches.length){
                    dbService.injectOneItem({collectionName: 'user_searches',
                    data:{
                        userToken: request.body.tokenUser,
                        yelpdata:[
                            {
                                // what: request.body.what,
                                // where: request.body.where,
                                // ammount: request.body.ammount,
                                yelpsearchresults: searchresult.dataRecieved
                            }
                        ]
                    }
                    }).then(()=>{
                        dbService.disconnect();
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code:"fccda005",dataRecieved:searchresult.dataRecieved}));
                        return;
                    });
                }
                else{
                    dbService.updateData({
                        collectionName: 'user_searches',
                        queryParam: {
                            dataselect: {userToken: request.body.tokenUser},
                            datacriteria: {
                                $addToSet: {
                                    yelpdata: {
                                        // what: request.body.what,
                                        // where: request.body.where,
                                        // ammount: request.body.ammount,
                                        yelpsearchresults: searchresult.dataRecieved
                                    }
                                }
                            }
                        }
                    }).then(() => {
                        dbService.disconnect();
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code:"fccda005",dataRecieved:searchresult.dataRecieved}));
                        return;
                    }).catch(err => {
                        dbService.disconnect();
                        // console.log('====================================');
                        // console.log(`error adding the books:${err}`);
                        // console.log('====================================');
                        logger.error(`Error Nightlife Controller inject searches:${JSON.stringify(err,null,2)}`);
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    });
                }

            }).catch(errorSearches=>{
                dbService.disconnect();
                logger.error(`Error Nightlife Controller with yelp search of searches:${JSON.stringify(errorSearches,null,2)}`);
                // console.log('====================================');
                // console.log(`error with yelp search of searches:\n${JSON.stringify(errorSearches,null,2)}`);
                // console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001",reason: "Internal server error"}));
                return;
            });
            
        }).catch(error=>{
            logger.error(`Error Nightlife Controller with yelp search of searches:${JSON.stringify(error,null,2)}`);
            // console.log('====================================');
            // console.log(`error with yelp search of searches:\n${JSON.stringify(error,null,2)}`);
            // console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001",reason: "Internal server error"}));
        });
    },
    addNights(request, response) {
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => dbService.injectOneItem({collectionName: 'goingnights',data: {user: request.body.userToken,location: request.body.location}}))
            .then(() => {
                dbService.disconnect();
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: 'fccda005',reason: "DATA ADDED"}));
            })
            .catch(errInject => {
                dbService.disconnect();
                logger.error(`Error Nightlife Controller add night:${JSON.stringify(errInject,null,2)}`);
                // console.log('====================================');
                // console.log(`error strat inject data err:${errInject}`);
                // console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: errInject}));
            });
    },
    removeNights(request, response) {

        if ((!request.body.location)||(!request.body.userToken)){
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001",reason: "NO_TOKEN"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => dbService.removeOne(
            {
                collectionName: 'goingnights',
                queryParam: {
                    user: request.body.userToken,
                    location: request.body.location
                }
            }))
            .then(() => {
                dbService.disconnect();
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: 'fccda005',reason: "NIGH_REMOVED"}));
            })
            .catch(errInject => {
                dbService.disconnect();
                logger.error(`Error Nightlife Controller night night:${JSON.stringify(errInject,null,2)}`);
                // console.log('====================================');
                // console.log(`error strat inject remove night err:${errInject}`);
                // console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: errInject}));
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
       
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
        .then(()=>{
            Promise.all(
                [
                    dbService.search({collectionName: 'user_searches',queryParam: {userToken: request.query.who}}),
                    dbService.search({collectionName:'goingnights',queryParam:{user: request.query.who}})
                ])
            .then(result=>{
                dbService.disconnect();

                const userSearchResults= result[0];
                const goingnightsResults=result[1];

                if (userSearchResults.length===0){
                    response.writeHead(200,{'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda005",reason: "NO_DATA"}));
                    return;
                }
                const dataYelp= userSearchResults[0].yelpdata;
                let resultData= [];
                //let datatoSend=[];
                for (let item of dataYelp){
                    // console.log('====================================');
                    // console.log(`data searches:\n${JSON.stringify(item.yelpsearchresults.results,null,2)}`);
                    // console.log('====================================');
                    //datatoSend=resultData.concat(item.yelpsearchresults.results);
                    resultData=[...resultData,...item.yelpsearchresults.results];
                }
                // console.log('====================================');
                // console.log(`searches concat:\n${JSON.stringify(resultData,null,2)}`);
                // console.log('====================================');
                for (let itemGoing of resultData){
                    if(goingnightsResults.find(x=>x.location===itemGoing.id)){
                        itemGoing.isGoing=true;
                    }
                }
                
                response.writeHead(200,{'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda005",data:resultData}));
                
            })
            .catch(errSearch=>{
                dbService.disconnect();
                logger.error(`Error Night Controller getUserSearches error get userSearches:${JSON.stringify(errSearch,null,2)}`);
                // console.log('====================================');
                // console.log(`Night Controller getUserSearches error get userSearches:${JSON.stringify(errSearch,null,2)}`);
                // console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001",reason: "Server Internal Error"}));
            });
        })
        .catch(err=>{
            logger.error(`Error Night Controller getUserSearches error error connect:${JSON.stringify(err,null,2)}`);
            // console.log('====================================');
            // console.log(`Night Controller getUserSearches error connect:${JSON.stringify(err,null,2)}`);
            // console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001",reason: "Server Internal Error"}));
        });
    }
};