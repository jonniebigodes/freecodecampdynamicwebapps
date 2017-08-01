class StockApi{
    /**
     * function to call the api to search data
     * @param {string} nameofStock stock code to searchs
     * @param {string} startdate start date for search
     * @param {string} enddate end date for search
     */
    static getStock(nameofStock,startdate,enddate){
        return new Promise((resolve,reject)=>{
             /* fetch(`http://localhost:5000/api/data/stocksearch?stockName=${nameofStock}&startdate=${startdate}&enddate=${enddate}`) */
             fetch(`https://freecodecampdynprojects.herokuapp.com/api/data/stocksearch?stockName=${nameofStock}&startdate=${startdate}&enddate=${enddate}`)
            .then(response=>{
                //console.log("getStock status: " +response.status);
                return response.json();
            })
            .then(result=>{
                //console.log("result: " + JSON.stringify(result));
                //return result;
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
                throw new Error(error.message);
            });
        });
        
        /* fetch(`http://localhost:5000/api/data/stocksearch?stockName=${nameofStock}&startdate=${startdate}&enddate=${enddate}`)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                //console.log("result: " + JSON.stringify(result));
                return {isDataOK:true,ErrorInfo:'',resultData:{
                    stockName:result.stockName,
                    stockCode:result.stockCode,
                    QueryStart: result.stockQueryStart,
                    QueryStart:result.StockQueryEnd,
                    stockDataResult: result.stockData
                }};
            })
            .catch(error=>{
                console.log('There has been a problem with your fetch operation: ' + error.message);
                return {isDataOK:false,ErrorInfo:error,resultData:{}};
                
            }); */
    }
    
}
export default StockApi;