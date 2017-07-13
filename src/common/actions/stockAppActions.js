import StockApi from '../api/stocksApi';

export function loadStockSucess(stocks){
    return {
        type:"LOAD_STOCK_OK",
        payload:stocks
    };
}
export function ErrorLoadStocks(value){
    return {
        type:"LOAD_STOCK_ERROR",
        payload:value
    };
}
export function stocksLoading(value){
    return {
        type:'STOCK_SEARCHING',
        Isloading:value
    };
}
export function LoadStocks(value){
    return (dispatch)=>{
        dispatch(stocksLoading(true));
        return StockApi.getStock(value.stockName,value.star
        ,value.enddate).then(result=>{
            dispatch(loadStockSucess(result));
        })
        .catch(error=>{
            console.log('There has been a problem with your fetch operation: ' + error.message);
            dispatch(ErrorLoadStocks(e.message));
        });
    };
   
}
/*export function LoadStocks(stockName,startdate,enddate){
    console.log("stockAppActions LoadActions: name"+stockName+" dates: "+ startdate+" enddate: "+ enddate);
    return (dispatch)=>{
        dispatch(stocksLoading(true));
        fetch(`http://localhost:5000/api/data/stocksearch?stockName=${stockName}&startDate=${startdate}&enddate=${enddate}`)
            .then(response=>{
                if (!response.ok){
                    throw Error(response.statusText);
                }
                dispatch(stocksLoading(false));
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
}*/
export function setStock(stockName){
    return{
        type:"SET_NAME_STOCK",
        payload:stockName
    }
}
export function setInitialData(initDate){
    return {
        type:"SET_INITIAL_DATE",
        payload:initDate
    }
}
export function setFinalDate(finalDate){
    return {
        type:"SET_END_DATE",
        payload:dateFinal
    }
}