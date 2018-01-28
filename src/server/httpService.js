/**
 * module to act in the service capacity
 * outside access like http get /posts
 */

const unirest = require('unirest');
const yelp = require('yelp-fusion');
const sendBlue= require('sendinblue-api');
const twitterClient= require('twitter');
const logger=  process.env.NODE_ENV!== 'production' ? require('../../logger'):require('./logger');
export const checkImage=value=>{
    return new Promise((resolve,reject)=>{
        try {
            unirest.head(value)
            .end(result=>{
                result.status!=404?resolve("IMAGE_OK"):resolve("NO_IMAGE");
            });
            
        } catch (error) {
            logger.error(`Error httpservice checkImage:${error}`);
            // console.log('====================================');
            // console.log(`ERROR HTTPSERVICE CHECK IMAGE:\n${error}`);
            // console.log('====================================');
            
            reject(error);
        }
    });
};
/**
 *
 * @param {object} value item to contain info to call the stock api service
 * @return {Promise} a promise containing the result or fail of the call of the stock api
 */
export const getStockInformation = value => {
    return new Promise((resolve, reject) => {
        try {
            unirest
                .get(`https://www.quandl.com/api/v3/datasets/WIKI/${value.queryStock}.json`)
                .query({"api_key": value.keyQuandl})
                .query({"start_date": value.startDate})
                .query({"end_date": value.endDate})
                .end(result => {
                    if (result.status === 404) {
                        reject({messageError:result.body.quandl_error.message});
                    } else {
                        

                        if (!result.body.dataset){
                            reject({messageError:'Too many requests.\nTry again later'});
                            return;
                        }
                        const queryResults=result.body.dataset;
                        const stockInformation= queryResults.data;
                        let stockData=[];
                        for (let item of stockInformation){
                            
                            stockData.push({
                                date:item[0],
                                openingPrice:item[1],
                                highestPrice:item[2],
                                lowestPrice:item[3],
                                closingPrice:item[4]
                            });
                        }
                        resolve(
                            {
                                id:queryResults.id,
                                code:queryResults.dataset_code,
                                name:queryResults.name,
                               
                                start:value.startDate,end:value.endDate,
                                data:stockData
                            }
                        );

                    }
                });

        } catch (error) {
            logger.error(`Error httpservice getstocks:${error}`);
            //console.log("ERROR HTTP SERVICE:\n" + error);
            reject({messageError:`ERROR ON PROCESSING REQUEST TO STOCK SERVER:\n${error}`});
        }

    });

};
/**
 * function to get the token from yelp
 * @param {String} clientId id of app provided by yelp services
 * @param {String} clientSecret secret hash provided by yelp services
 * @returns {Promise} with the result or fail of the remote request
 */
export const getToken = (clientId, clientSecret) => {
    let resultInfo = {
        error: false,
        messageError: "",
        dataRecieved: {}
    };
    // console.log('====================================');
    // console.log(`httpservice yelp id:${clientId} yelp secret:${clientSecret}`);
    // console.log('====================================');
    return new Promise((resolve, reject) => {
        try {
            yelp.accessToken(clientId, clientSecret).then(response => {
            //    console.log('====================================');
            //    console.log(`token information:${JSON.stringify(response,null,2)}`);
            //    console.log('====================================');
                resolve({token:response.jsonBody.access_token,expires:response.jsonBody.expires_in});
                })
                .catch(e => {
                    logger.error(`Error httpservice getToken:${e}`);
                    // console.log('====================================');
                    // console.log(`there was an error getting the goken:\n ${JSON.stringify(e,null,2)}`);
                    // console.log('====================================');
                    resultInfo.error = true;
                    resultInfo.messageError = e;
                    reject(resultInfo);
                });

        } catch (error) {
            logger.error(`There was an error in httpservice  getting the goken:${error}`);
            // console.log('====================================');
            // console.log(`there was in httpservice getting the goken:\n ${JSON.stringify(error,null,2)}`);
            // console.log('====================================');
            resultInfo.error = true;
            resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO YELP SERVER: " + error;
            reject(resultInfo);
        }

    });
};
export const searchYelp = (token, searchItem, searchLocation,numberOfItems) => {
    let resultInfo = {
        error: false,
        messageError: "",
        dataRecieved: {}
    };
    let resultData=[];
    return new Promise((resolve, reject) => {
        try {
            const client= yelp.client(token);
            client.search({
                term:searchItem,
                location:searchLocation,
                limit:numberOfItems
            }).then(response=>{
                
                for (let i=0; i<response.jsonBody.businesses.length;i++){
                    let itemresult={};
                    if (!response.jsonBody.businesses[i].is_closed){
                        itemresult.infoquery={
                            what:searchItem,
                            where:searchLocation,
                            ammount:numberOfItems
                        };
                        itemresult.id=response.jsonBody.businesses[i].id;
                        itemresult.name=response.jsonBody.businesses[i].name;
                        itemresult.img=response.jsonBody.businesses[i].image_url;
                        itemresult.url=response.jsonBody.businesses[i].url;
                        itemresult.address=response.jsonBody.businesses[i].location.address1;
                        itemresult.city= response.jsonBody.businesses[i].location.city;
                        itemresult.zipCode=response.jsonBody.businesses[i].location.zip_code;
                        itemresult.isGoing=false;
                        if (response.jsonBody.businesses[i].categories[0]){
                            itemresult.category= response.jsonBody.businesses[i].categories[0].alias;
                        }
                        resultData.push(itemresult);
                    }
                }
                resultInfo.dataRecieved.num_items_response= response.jsonBody.businesses.length;
                resultInfo.dataRecieved.results=resultData;
                resolve(resultInfo);
            })
            .catch(e=>{
                logger.error(`ERROR httpservice ON PROCESSING REQUEST TO YELP SERVER:${e}`);
                // console.log('====================================');
                // console.log(`ERROR ON PROCESSING REQUEST TO YELP SERVER:${e}`);
                // console.log('====================================');
                resultInfo.error = true;
                resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO YELP SERVER: " + e;
                reject(resultInfo);
            });

        } catch (error) {
            logger.error(`ERROR httpservice ON PROCESSING YELP SEARCH:${error}`);
            //console.log("ERROR HTTP SERVICE YELP SEARCH:\n" + error);
            resultInfo.error = true;
            resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO YELP SERVER: " + error;
            reject(resultInfo);
        }
    });
};

/**
 * fat arrowed function to send the mail notification to the user about the trade
 * @param {String} valueToken relay mail api key
 * @param {String} userTrading mail user willing to trade book
 * @param {String} userOwner mail user currently owning the book
 * @param {String} tokenTrade id of the trade submited
 * @param {String} bookname name of the book to be traded
 * @returns {Promise} promise containing the result/fail of the operation
 */
export const sendMail=(value)=>{
    
    const mailToBookOwner={
        id:1,
        to:value.infoowner,
        attr:{
            BOOKTRADER:value.infotrader,
            TRADETOKEN:value.token,
            BOOKNAME:value.name
        }
    };
   
    
    const sendinObj= new sendBlue({apiKey:value.apiKey,timeout:7500});

     return new Promise((resolve,reject)=>{
         sendinObj.send_transactional_template(mailToBookOwner,(errorMail,response)=>{
            if (errorMail)reject(`Error on sending mail notification\n:${errorMail}`);
            /* console.log('====================================');
            console.log(`mail response data:${JSON.stringify(response)}`);
            console.log('===================================='); */
            resolve(true);
         });
        
    }); 
};

export const sendToTwitter=(value)=>{

    return new Promise((resolve,reject)=>{
       
        const client=new twitterClient({
            consumer_key: value.appkey,
            consumer_secret: value.appsecret,
            access_token_key: value.access_token,
            access_token_secret: value.access_secret
        });
        client.post('statuses/update',
        {status:`check out the poll created at ${encodeURI(`https://freecodecampdynprojects.herokuapp.com/voting/poll/${value.token}`)}`})
        .then(result=>{
            // console.log('====================================');
            // console.log(`result twitter:${JSON.stringify(result,null,2)}`);
            // console.log('====================================');
            resolve(true);
        })
        .catch(error=>{
            console.log('====================================');
            console.log(`error sending tweet:${JSON.stringify(error,null,2)}`);
            console.log('====================================');
            reject(error);
        });
    });
};
export const sendToFacebook=(value)=>{
    let resultInfo = {
        error: false,
        messageError: "",
        dataRecieved: {}
    };
    return new Promise((resolve,reject)=>{
        try {
            unirest
                .get(``)
                .query({"api_key": value.keyQuandl})
                .query({"start_date": value.startDate})
                .query({"end_date": value.endDate})
                .end(result => {
                    if (result.status === 404) {
                        resultInfo.error = true;
                        reject(resultInfo);

                    } else {
                        resolve(resultInfo);
                    }
                });

        } catch (error) {
            console.log("ERROR HTTP SERVICE send to facebook:\n" + error);
            resultInfo.error = true;
            resultInfo.messageError = "ERROR ON PROCESSING POST TO FACEBOOK:" + error;
            reject(resultInfo);
        }
    });
};