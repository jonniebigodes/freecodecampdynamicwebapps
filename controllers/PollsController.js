const dbService=require('./dbFactory');
//const dbService = require('../src/server/dbFactory');

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
                                pollcreator:user.local_email,
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
            })
        })
        .catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller get polls error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })
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
        )).then(resultPoll=>{
            dbService.disconnect();
            console.log('====================================');
            console.log(`data removed result:${JSON.stringify(resultPoll,null,2)}`);
            console.log('====================================');
            
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", reason: `Poll number:${request.body.polltoken} was removed`}));
        })
        .catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller delete Polls error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })
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
            response.end(JSON.stringify({code: "fccda005", reason: `Poll ${request.body.pollname} was added to the fold`}));
        })
        .catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller createPoll error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })
    },
    voteOnPoll(request,response){
        if ((!request.body.usertoken) || (!request.body.polltoken)) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "some information for the book submission was not provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
        .then(()=>{
            dbService.updateData({
                collectionName:'polls',
                queryParam:{
                    dataselect:{
                        item:{
                            polloptions:{
                                idpollOption:request.body.polltoken
                            }
                        }
                    },
                    datacriteria:{
                        $inc:{
                            polloptions:{
                                $:{
                                    vote:1 
                                }
                            }
                        }
                    }
                }
            })
        }).then(resultPoll=>{
            console.log('====================================');
            console.log(`vote poll result update:${JSON.stringify(resultPoll,null,2)}`);
            console.log('====================================');
        })
        .catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller voteOnPoll error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })
    },
    addPollOption(request,response){
        if ((!request.body.usertoken) || (!request.body.polltoken)) {
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
                        _id:request.body.tokenPoll
                    },
                    datacriteria:{
                        $addToSet:{
                            polloptions:{
                                idoption:request.body.polloptiontoken,
                                optionname:request.body.polloptionName,
                                votes:0
                            }
                        }
                    }
                }
            }
        )).then(resultPoll=>{
            dbService.disconnect();
            console.log('====================================');
            console.log(`add poll option result update :${JSON.stringify(resultPoll,null,2)}`);
            console.log('====================================');
            response.writeHead(200,{'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", reason: "poll updated"}));
        })
        .catch(errConnect=>{
            console.log('====================================');
            console.log(`Polls Controller addPollOption error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })
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
                console.log('====================================');
                console.log(`GOT DATA:${JSON.stringify(resultdetail,null,2)}`);
                console.log('====================================');
                
                if (!resultdetail.length){
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "No poll with the token provided exists"}));
                    return;
                }
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(
                    {
                        polltoken:resultdetail[0]._id,
                        pollname:resultdetail[0].name,
                        polloptions:resultdetail[0].polloptions
                    }
                ));

            })
            .catch(errConnect=>{
                console.log('====================================');
                console.log(`Polls Controller getPollDetails error on connect:${JSON.stringify(errConnect,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })
        
    }

};