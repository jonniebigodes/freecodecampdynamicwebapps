class StockApi{
    static getStock(nameofStock,startdate,enddate){
        fetch(`http://localhost:5000/api/data/stocksearch?stockName=${nameofStock}&startDate=${startdate}&enddate=${enddate}`)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                console.log("result: " + result);
                return result;
            })
            .catch(error=>{
                console.log('There has been a problem with your fetch operation: ' + error.message);
                return error;
                
            });
    }
}
export default StockApi;