// prod mode
const dbService=process.env.NODE_ENV !== 'production'?require('../src/server/dbFactory'):require('./dbFactory');
const httpService =process.env.NODE_ENV !== 'production'?require('../src/server/httpService'): require('./httpService');
//
// dev mode
//const dbService = require('../src/server/dbFactory');
//const httpService = require('../src/server/httpService');
//
module.exports={
    getPolls(request,response){
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
        .then(()=>{
            
            Promise.all([
                dbService.search({collectionName:'polls',queryParam:{}}),
                dbService.search({collectionName:'users',queryParam:{}})
            ]).then(resultSearches=>{
                dbService.disconnect();
                const polls=resultSearches[0];
                const users= resultSearches[1];
                const results=[];
                if (polls.length){
                    for (let item of polls){
                        const user= users.find(x=>x._id==item.user);
                        if (user){
                            results.push({
                                polltoken:item._id,
                                pollcreator:{
                                    userid:item.user,
                                    username:user.full_name?user.full_name:user.local_email,
                                },
                                pollname:item.name,
                                polloptions:item.polloptions
                            });
                        }
                    }
                }
                
                response.writeHead(200,{'Content-Type': 'application/json'});
                response.end(JSON.stringify({code:'fccda005',polldata:results}));
            }).catch(ErrorSearches=>{
                dbService.disconnect();
                console.log('====================================');
                console.log(`error promise all poll:${ErrorSearches}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            });
        })
        .catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller get polls error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
    },
    deletePoll(request,response){
        if (!request.body.polltoken) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "some information for the operation was not provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
        .then(()=>dbService.removeById(
            {
                collectionName:'polls',
                queryParam:{
                    data:request.body.polltoken  
                }
            }
        )).then(()=>{
            dbService.disconnect();
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", reason: `Poll number:${request.body.polltoken} was removed`}));
        })
        .catch(errConnect=>{
            dbService.disconnect();
            console.log('====================================');
            console.log(`Polls Controller delete Polls error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
    },
    createPoll(request,response){
        if (!request.body.usertoken) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "some information for the operation was not provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
        .then(()=>dbService.injectOneItem(
            {
                collectionName:'polls',
                data:{
                    user:request.body.usertoken,
                    name:request.body.pollname,
                    polloptions:request.body.polldataoptions
                }
            }
        )).then(resultPoll=>{
            dbService.disconnect();
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", token:resultPoll,reason: `Poll ${request.body.pollname} was added to the fold`}));
        })
        .catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller createPoll error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
    },
    voteOnPoll(request,response){
        if  (!request.body.polltoken) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "some information for the poll vote was not provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(()=>{
            dbService.updateData(
                {
                    collectionName:'polls',
                    queryParam:{
                        dataselect:{
                            "polloptions.idoption":request.body.polltoken
                        },
                        datacriteria:{
                            $inc:{
                                "polloptions.$.votes":1
                            }
                        }
                    }
                }
            ).then(()=>{
                dbService.disconnect();
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda005", reason: "VOTE_OK"})); 

            }).catch(errvote=>{
                dbService.disconnect();
                console.log('====================================');
                console.log(`Polls Controller voteOnPoll error on vote:${JSON.stringify(errvote,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            });
        }).catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller voteOnPoll error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
        
    },
    addPollOption(request,response){
        if  (!request.body.polltoken){
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "some information for the book submission was not provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
        .then(()=>dbService.updateById(
            {
                collectionName:'polls',
                queryParam:{
                    dataselect:{
                        item:request.body.polltoken
                    },
                    datacriteria:{
                        $addToSet:{
                            polloptions:{
                                idoption:request.body.polloptiontoken,
                                optionname:request.body.optionname,
                                votes:0
                            }
                        }
                    }
                }
            }
        )).then(()=>{
            dbService.disconnect();
            response.writeHead(200,{'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", reason: "poll updated"}));
        })
        .catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller addPollOption error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
    },
    getPollDetails(request,response){
        if (!request.query.polltoken){
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "No token provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
            .then(()=>dbService.searchByID({collectionName:'polls',queryParam:{_id:request.query.polltoken}}))
            .then(resultdetail=>{
                dbService.disconnect();
                if (!resultdetail.length){
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "No poll with the token provided exists"}));
                    return;
                }
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(
                    {
                        code:'fccda005',
                        data:{
                            polltoken:resultdetail[0]._id,
                            pollname:resultdetail[0].name,
                            polloptions:resultdetail[0].polloptions
                        }
                    }
                ));
            })
            .catch(errConnect=>{
                console.log('====================================');
                console.log(`Polls Controller getPollDetails error on connect:${JSON.stringify(errConnect,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
        
    },
    sharePoll(request,response){
        if ((!request.body.tokenpoll) || (!request.body.authtoken)){
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "No token provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
        .then(()=>dbService.searchByID({collectionName:'users',queryParam:{_id:request.body.authtoken}}))
        .then(resultUsers=>{
            dbService.disconnect();
            if (resultUsers.length){
                const userInfo=resultUsers[0];
                if((userInfo.twitter_user_token=='0')||(userInfo.twitter_user_secret=='0')){
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "No token provided"}));
                    return;
                }
                httpService.sendToTwitter(
                    {
                        token:request.body.tokenpoll,
                        appkey:request.app.locals.TWITTER_APP_ID,
                        appsecret:request.app.locals.TWITTER_APP_SECRET,
                        access_token:userInfo.twitter_user_token,
                        access_secret:userInfo.twitter_user_secret
                    }
                )
                .then(()=>{
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda005", reason: "TweetOK"}));
                })
                .catch(()=>{
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                });

            }
        })
        .catch(errorUsers=>{
            console.log('====================================');
            console.log(`Polls Controller sharePoll error on errorUsers:${JSON.stringify(errorUsers,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
        
    }
};