/**
 * module to act in the service capacity
 * outside access like http get /posts
 */

const unirest = require('unirest');
const yelp = require('yelp-fusion');
const sendBlue= require('sendinblue-api');
/**
 *
 * @param {object} value item to contain info to call the stock api service
 * @return {Promise} a promise containing the result or fail of the call of the stock api
 */
export const getStockInformation = value => {
    let resultInfo = {
        error: false,
        messageError: "",
        dataRecieved: {}
    };
    let stockinfo = {
        stockName: "",
        stockCode: "",
        refreshDate: "",
        stockQueryStart: "",
        StockQueryEnd: "",
        stockData: []
    };
    return new Promise((resolve, reject) => {
        try {
            unirest
                .get(`https://www.quandl.com/api/v3/datasets/WIKI/${value.queryStock}.json`)
                .query({"api_key": value.keyQuandl})
                .query({"start_date": value.startDate})
                .query({"end_date": value.endDate})
                .end(result => {
                    if (result.status === 404) {
                        resultInfo.error = true;
                        reject(resultInfo);

                    } else {
                        
                        stockinfo.stockName = result.body.dataset.name;
                        stockinfo.stockCode = result.body.dataset.dataset_code;
                        stockinfo.refreshDate = result.body.dataset.refreshed_at;
                        stockinfo.stockQueryStart = value.startDate;
                        stockinfo.StockQueryEnd = value.endDate;
                        for (let i = 0; i < result.body.dataset.data.length; i++) {
                            stockinfo.stockData.push({stockDate: result.body.dataset.data[i][0], openPrice: result.body.dataset.data[i][1], highestPrice: result.body.dataset.data[i][2], lowestPrice: result.body.dataset.data[i][3], closePrice: result.body.dataset.data[i][4]});
                        }
                        resultInfo.dataRecieved = stockinfo;
                        resolve(resultInfo);

                    }
                });

        } catch (error) {
            console.log("ERROR HTTP SERVICE:\n" + error);
            resultInfo.error = true;
            resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO STOCK SERVER: " + error;
            reject(resultInfo);
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
    return new Promise((resolve, reject) => {
        try {
            yelp.accessToken(clientId, clientSecret).then(response => {
                    resolve(response.jsonBody.access_token);
                })
                .catch(e => {
                    console.log('====================================');
                    console.log(`there was an error getting the goken:\n ${e}`);
                    console.log('====================================');
                    resultInfo.error = true;
                    resultInfo.messageError = e;
                    reject(resultInfo);
                });

        } catch (error) {
            console.log("ERROR HTTP SERVICE YELP TOKEN:\n" + error);
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
                console.log('====================================');
                console.log(`ERROR ON PROCESSING REQUEST TO YELP SERVER:${e}`);
                console.log('====================================');
                resultInfo.error = true;
                resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO YELP SERVER: " + e;
                reject(resultInfo);
            })

        } catch (error) {
            console.log("ERROR HTTP SERVICE YELP SEARCH:\n" + error);
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
    //const mailToBookOwner=constructMailNotificationBookOwner(value.infotrader,value.infoowner,value.token,value.name);
    const mailToBookOwner={
        id:1,
        to:value.infoowner,
        attr:{
            BOOKTRADER:value.infotrader,
            TRADETOKEN:value.token,
            BOOKNAME:value.name
        }
    };
    /* console.log('====================================');
    console.log(`mail to book owner data:${JSON.stringify(mailToBookOwner,null,2)}\n`);
    console.log('====================================');
 */
    const sendinObj= new sendBlue({apiKey:value.apiKey,timeout:5000});

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