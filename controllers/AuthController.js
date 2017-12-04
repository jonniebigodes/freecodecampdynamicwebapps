const dbService = require('../src/server/dbFactory');
//const dbService=require('./dbFactory');
module.exports = {

    changeUserData(request, response) {
        if (!request.body.userToken) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "No user token was provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => dbService.searchByID({
                collectionName: 'users',queryParam: {_id: request.body.userToken}}))
            .then(resultSearchuser => {
                dbService.updateById({
                    collectionName: 'users',
                    queryParam: {
                        dataselect: {
                            item: resultSearchuser[0]._id
                        },
                        datacriteria: {
                            $set: {
                                state: request.body.countrystate !== undefined
                                    ? request.body.countrystate
                                    : resultSearchuser.state,
                                city: request.body.city !== undefined
                                    ? request.body.city
                                    : resultSearchuser.city,
                                full_name: request.body.fullusername !== undefined
                                    ? request.body.fullusername
                                    : resultSearchuser.full_name,
                                country: request.body.country !== undefined
                                    ? request.body.country
                                    : resultSearchuser.country
                            }
                        }
                    }
                }).then(() => {
                    dbService.disconnect();
                    /* console.log('====================================');
                    console.log(`result update info user result:${JSON.stringify(resultupdateinfor, null, 2)}`);
                    console.log('===================================='); */
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda005", reason: "Information updated"}));

                }).catch(errorupdateinfo => {
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`error Auth Controller change user data update info:${JSON.stringify(errorupdateinfo,null,2)}`);
                    console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Internal Server Error"}));
                });
            })
            .catch(errauthconnectchange => {
                dbService.disconnect();
                console.log('====================================');
                console.log(`error Auth Controller change user data:${JSON.stringify(errauthconnectchange,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Internal Server Error"}));
            });
    },
    getUserSocialData(request,response){
        if (!request.body.authToken) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "No user token was provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => dbService.searchByID(
            {
                collectionName: 'users',
                queryParam: {
                    _id: request.body.authToken
                }
            }
        )).then(result=>{
            dbService.disconnect();
            if (result.length){
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda005", data:{
                    name:result[0].full_name=='0'?'':result[0].full_name,
                    twitterToken:result[0].twitter_user_token=='0'?undefined:result[0].twitter_user_token,
                    facebookToken:result[0].facebook_token=='0'?undefined:result[0].facebook_token,
                    twitterusername:result[0].twitter_display_name=='0'?undefined:result[0].twitter_display_name,
                    facebookusername:result[0].facebook_display_name=='0'?undefined:result[0].facebook_display_name,
                    email:result[0].local_email
                }}));
                return;
            }
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "No user found"}));
            
        })
        .catch(error=>{
            dbService.disconnect();
            console.log('====================================');
            console.log(`error Auth Controller change user data:${JSON.stringify(error,null,2)}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Internal Server Error"}));
        });
    }
};