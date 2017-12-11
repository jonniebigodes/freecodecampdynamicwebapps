import StockApi from '../api/stocksApi';
import {
    RECIEVE_STOCKS,
    REQUEST_STOCKS,
    APP_ERROR,
    APP_ERROR_RESET,
    DELETE_STOCK,
    SET_STOCK_EXIT
} from '../constants/Actiontypes';
import {normalize} from 'normalizr';
import {StockSchemas} from '../constants/stocksSchema';
export const requestDataStocks = value => ({
  type: REQUEST_STOCKS,
  value
});
export const recieveData=result=>({
    type:RECIEVE_STOCKS,
    result
});

export const setAppError=value=>({
    type:APP_ERROR,
    value
});
export const resetAppError=()=>({
    type:APP_ERROR_RESET
});

export const delStocks=value=>({
    type:DELETE_STOCK,
    value
});

export const setStocksExit=()=>({
    type:SET_STOCK_EXIT,
});
/**
 * "private" function to process the request information
 * 
 */
const fetchData=stockData=>dispatch=>{
    
    StockApi.getStock(stockData.stockName,stockData.startDate,stockData.endDate)
            .then((result)=>{
                const normdata= normalize(result,StockSchemas.dataStocks);
                //console.log("item got here: data is ok");
                setTimeout(() => {
                    dispatch(recieveData({id:normdata.result,data:normdata.entities.resultQuery}));
                }, 3000);
                
            })
            .catch((err)=>{
                //console.log("got here: data is nok: "+ err);
                dispatch(setAppError(err));
            });
};

/**
 * checks the state to see if the date exists
 * @param {*} state the state of the app
 * @param {object} stockData information to be searched
 */
const shouldGetDataStock=(state,stockData)=>{
   
    const dataInState=state.stocks;
    if (!dataInState.results.length){
        
        return true;
    }
    
    const dataEntities= dataInState.entities;
    for (const item in dataEntities){
       
        if (dataEntities[item].code.toUpperCase()===stockData.stockName.toUpperCase()){
            return false;
        }
    }
    return true;
};
/**
 * entry point operation for searching data
 * @param {object} stockData data to be searched
 */
export const fetchStocksIfNeeded=stockData=>(dispatch, getState)=>{
    dispatch(requestDataStocks(stockData));

    if (shouldGetDataStock(getState(),stockData)){
        dispatch(fetchData(stockData));
    }
    else{
        dispatch(setAppError(`The information submited is already added to the collection.\nTry a different one`));
    }
};

