/**
 * module to act in the service capacity
 * outside access like http get /posts
 */

// delete unirest if fetch works
const unirest = require('unirest');
const yelp = require('yelp-fusion');

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
    }
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
                        resultInfo.messageError = "The stock " + value.queryStock + " to be searched does not exist";
                        reject(resultInfo);

                    } else {
                        let stockinfo = {
                            stockName: "",
                            stockCode: "",
                            refreshDate: "",
                            stockQueryStart: "",
                            StockQueryEnd: "",
                            stockData: []
                        };
                        stockinfo.stockName = result.body.dataset.name;
                        stockinfo.stockCode = result.body.dataset.dataset_code;
                        stockinfo.refreshDate = result.body.dataset.refreshed_at;
                        stockinfo.stockQueryStart = value.startDate;
                        stockinfo.StockQueryEnd = value.endDate;
                        for (let i = 0; i < result.body.dataset.data.length; i++) {
                            stockinfo
                                .stockData
                                .push({stockDate: result.body.dataset.data[i][0], openPrice: result.body.dataset.data[i][1], highestPrice: result.body.dataset.data[i][2], lowestPrice: result.body.dataset.data[i][3], closePrice: result.body.dataset.data[i][4]
                                })
                        }
                        resultInfo.dataRecieved = stockinfo;
                        resolve(resultInfo);

                    }
                })

        } catch (error) {
            console.log("ERROR HTTP SERVICE:\n" + error);
            resultInfo.error = true;
            resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO STOCK SERVER: " + err;
            reject(resultInfo);
        }

    })

}
export const getToken = (clientId, clientSecret) => {
    let resultInfo = {
        error: false,
        messageError: "",
        dataRecieved: {}
    }
    return new Promise((resolve, reject) => {
       try {
           yelp.accessToken(clientId, clientSecret)
            .then(response => {
                console.log('====================================');
                console.log(`token: ${response.jsonBody.access_token}`);
                console.log('====================================');
                resolve(response.jsonBody.access_token);
            })
            .catch(e => {
                console.log('====================================');
                console.log(`there was an error getting the goken:\n ${e}`);
                console.log('====================================');
                resultInfo.error= true;
                resultInfo.messageError= e;
                reject(resultInfo);
            });
           
       } catch (error) {
           console.log("ERROR HTTP SERVICE YELP TOKEN:\n" + error);
           resultInfo.error = true;
           resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO YELP SERVER: " + err;
           reject(resultInfo);
       }
        
    });
}
export const searchYelp=(token,searchItem,searchLocation)=>{
    let resultInfo = {
        error: false,
        messageError: "",
        dataRecieved: {}
    }
    console.log('====================================');
    console.log(`args:\ntoken:${token} searchitem:${searchItem} location:${searchLocation}`);
    console.log('====================================');
    return new Promise((resolve,reject)=>{
        try {
            const yelpclient= yelp.client(token);
            yelpclient.search({
                term:searchItem,
                location:searchLocation,
                limit:50
            }).then(response=>{
                console.log('====================================');
                console.log(`resposta:\n${response.jsonBody}`);
                console.log('====================================');
                resolve(response.jsonBody);
            }).catch(e=>{
                console.log('====================================');
                console.log(`Error searching:\n${e}`);
                console.log('====================================');
                resultInfo.error= true;
                resultInfo.messageError= e;
                reject(resultInfo);
            })
            
        } catch (error) {
            console.log("ERROR HTTP SERVICE YELP TOKEN:\n" + error);
            resultInfo.error = true;
            resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO YELP SERVER: " + err;
            reject(resultInfo);
        }
    });
}