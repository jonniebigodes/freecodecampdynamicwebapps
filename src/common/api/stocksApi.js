import {
    getStocksLocalServer,
    getStocksExternalServer
} from '../constants/ApiEndPoints';
class StockApi{
    /**
     * function to call the api to search data
     * @param {string} nameofStock stock code to searchs
     * @param {string} startdate start date for search
     * @param {string} enddate end date for search
     */
    static getStock(nameofStock,startdate,enddate){
        return new Promise((resolve,reject)=>{
              fetch(process.env.NODE_ENV!=='production'?`${getStocksLocalServer}stockName=${nameofStock}&startdate=${startdate}&enddate=${enddate}`:`${getStocksExternalServer}stockName=${nameofStock}&startdate=${startdate}&enddate=${enddate}`)
            .then(response=>{
                //console.log("getStock status: " +response.status);
                return response.json();
            })
            .then(result=>{
                //console.log("result: " + JSON.stringify(result));
                //return result;
                result.code==='fccda005'?resolve({resultQuery:result.resultQuery}):reject('Problem obtaining the stock');
                if (result.code){
                    //console.log("there was an error");
                    reject(result.reason);

                }
                resolve(result);
                
            })
            .catch(error=>{
                console.log('There has been a problem with your fetch operation: ' + error.message);
                //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                //reject(error.message)
                reject(`There has been a problem with your fetch operation:\n${error.message}`);
            });
        });
        
        
    }
    
}
export default StockApi;