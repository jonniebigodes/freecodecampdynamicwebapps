// prod mode
const dbService=process.env.NODE_ENV !== 'production'?require('../src/server/dbFactory'):require('./dbFactory');
const httpService = process.env.NODE_ENV !== 'production'?require('../src/server/httpService'):require('./httpService');
//
//dev mode
//const dbService = require('../src/server/dbFactory');
//const httpService = require('../src/server/httpService');
//
module.exports={

    getImages(request,response){
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(()=>{
            Promise.all([
                dbService.search({collectionName:'walls',queryParam:{}}),
                dbService.search({collectionName:'users',queryParam:{}}),
                //dbService.search({collectionName:'',queryParam:{}})
            ]).then(resultInfo=>{
                dbService.disconnect();
                const wallsInfo= resultInfo[0];
                const usersInfo= resultInfo[1];
                const results=[];
                if (wallsInfo.length){

                    for (let item of wallsInfo){
                        const user= usersInfo.find(x=>x._id==item.user);
                        let tmp={
                            
                            idwall:item._id,
                            name:item.wallname,
                            creator:{ 
                                userid:item.user,
                                username:user.full_name?user.full_name:user.local_email
                            },
                            images:[]
                            
                        };
                        for (let wallimages of item.images){
                            tmp.images.push(
                                {
                                    idimage:wallimages.imageid,
                                    nameofimage:wallimages.imagename,
                                    imagelink:wallimages.link,
                                    numberstars:wallimages.stars
                                }
                            );
                        }
                        results.push(tmp);
                    }
                    
                }
                response.writeHead(200,{'Content-Type': 'application/json'});
                response.end(JSON.stringify({code:'fccda005',pindata:results}));
            }).catch(errorgetInfo=>{
                dbService.disconnect();
                console.log('====================================');
                console.log(`error promise all pin:${errorgetInfo}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            });
        }).catch(errorconnectgetimages=>{
            console.log('====================================');
            console.log(`Pins Controller get pin error on connect:${JSON.stringify(errorconnectgetimages,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });

    },
    deleteImage(request,response){
        if ((!request.body.imgtoken)||(!request.body.walltoken)){
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "NO IMG TOKEN"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect()
        .then(()=>dbService.updateById({
            collectionName: 'walls',
            queryParam: {
                dataselect: {
                    item: request.body.walltoken
                },
                datacriteria: {
                    $pull: {
                        images: {
                            imageid: request.body.imgtoken
                        }
                    }
                }

            }
        }))
        .then(resultRemove=>{
            dbService.disconnect();
            console.log('====================================');
            console.log(`result of remove image:${JSON.stringify(resultRemove,null,2)}`);
            console.log('====================================');
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", reason: "DEL_OK"}));
        })
        .catch(errorConnect=>{
            dbService.disconnect();
            console.log('====================================');
            console.log(`pin controller error of remove image:${JSON.stringify(errorConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
    },
    addImage(request,response){
        if ((!request.body.usertoken)||(!request.body.image)){
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "NO AUTH USER TOKEN"}));
            return;
        }
        httpService.checkImage(request.body.image).then(result=>{
            console.log('====================================');
            console.log(`Pin Controller check pin image result:${result}`);
            console.log('====================================');
            
            dbService.setUrl(request.app.MONGODB);
            dbService.connect()
            .then(()=>dbService.search({
                collectionName:'walls',
                queryParam:{
                    user:request.body.usertoken
                }
            }))
            .then(resultsearchUsers=>{
                console.log('====================================');
                console.log(`Pins Controller add pin dbupdate on connect:${JSON.stringify(resultsearchUsers,null,2)}`);
                console.log('====================================');
                if (resultsearchUsers.length){
                    dbService.updateData(
                        {
                            collectionName:'walls',
                            queryParam:{
                                dataselect:{
                                    user:request.body.usertoken
                                },
                                datacriteria:{
                                    $addToSet:{
                                        images:{
                                            imageid:request.body.id,
                                            imagename:request.body.name,
                                            link:result=="IMAGE_OK"?request.body.image:'http://via.placeholder.com/350x350',
                                            stars:0
                                        }
                                    }
                                }
                            }
                        }
                    )
                    .then(resultupdateSet=>{
                        dbService.disconnect();
                        console.log('====================================');
                        console.log(`add image result update set:${JSON.stringify(resultupdateSet,null,2)}`);
                        console.log('====================================');
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda005", reason: "ImageOK"}));
                        return;

                    }).catch(errorupdateSet=>{
                        dbService.disconnect();
                        console.log('====================================');
                        console.log(`Pins Controller get pin error on update set:${JSON.stringify(errorupdateSet,null,2)}`);
                        console.log('====================================');
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    });
                }
                else{
                    dbService.injectOneItem(
                        {
                            collectionName:'walls',
                            data:{
                                user:request.body.usertoken,
                                wallname:`wall of ${request.body.usertoken}`,
                                images:[
                                    {
                                        imageid:request.body.id,
                                        imagename:request.body.name,
                                        link:result=="IMAGE_OK"?request.body.image:'http://via.placeholder.com/350x350',
                                        stars:0
                                    }
                                ]
                            }
                        }
                    ).then(resultInject=>{
                        dbService.disconnect();
                        console.log('====================================');
                        console.log(`add image result inject item:${JSON.stringify(resultInject,null,2)}`);
                        console.log('====================================');
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify(
                            {
                                code: "fccda005", 
                                reason: "wall_added",
                                options:{
                                    wallid:resultInject,
                                    user:request.body.usertoken,
                                    wallname:`wall of ${request.body.usertoken}`
                                }
                            }
                        ));
                    }).catch(errorInject=>{
                        dbService.disconnect();
                        console.log('====================================');
                        console.log(`Pins Controller get pin error on inject item:${JSON.stringify(errorInject,null,2)}`);
                        console.log('====================================');
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    });
                }
                
            })
            .catch(errorConnect=>{
                dbService.disconnect();
                console.log('====================================');
                console.log(`Pins Controller get pin error on connect:${JSON.stringify(errorConnect,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            });
            
        }).catch(error=>{
            console.log('====================================');
            console.log(`Pin Controller check pin image error on connect:${JSON.stringify(error,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });

    },
    
    VoteImage(request,response){
        if (!request.body.imgtoken){
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "NO IMAGE TOKEN"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(()=>{
            dbService.updateData(
                {
                    collectionName:'walls',
                    queryParam:{
                        dataselect:{
                            "images.imageid":request.body.imgtoken
                        },
                        datacriteria:{
                            $inc:{
                                "images.$.stars":1
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
                console.log(`pin controller vote image error on vote:${JSON.stringify(errvote,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            });
        }).catch(errConnect=>{
            console.log('====================================');
            console.log(`pin controller vote image error on connect:${JSON.stringify(errConnect,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
    }
};