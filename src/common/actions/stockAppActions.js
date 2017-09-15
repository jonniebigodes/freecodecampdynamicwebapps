import StockApi from '../api/stocksApi';
import * as types from '../constants/Actiontypes';

export const requestDataStocks = value => ({
  type: types.REQUEST_STOCKS,
  value
});
export const recieveData=result=>({
    type:types.RECIEVE_STOCKS,
    result
});

export const recieveDataNOK=error=>({
    type:types.RECIEVE_STOCKS_NOK,
    error

});
export const setAppError=value=>({
    type:types.APP_ERROR,
    value
});
export const resetAppError=value=>({
    type:types.APP_ERROR_RESET,
    value
});
export const setValueStock=valueQuery=>({
    type:types.SET_STOCK_VALUE,
    valueQuery
});

export const setDataInit=valueDi=>({
    type:types.SET_DATA_START,
    valueDi
});

export const delStocks=value=>({
    type:types.DELETE_STOCK,
    value
});

export const setDataFinal=valueFD=>({
    type:types.SET_DATA_END,
    valueFD
});
export const setStocksExit=value=>({
    type:types.SET_STOCK_EXIT,
    value
});
/**
 * "private" function to process the request information
 * 
 */
const fetchData=stockData=>dispatch=>{
    
    dispatch(requestDataStocks(stockData));
    StockApi.getStock(stockData.stockName,stockData.startDate,stockData.endDate)
            .then((result)=>{
                
                //console.log("item got here: data is ok");
                dispatch(recieveData(result));
                
            })
            .catch((err)=>{
                //console.log("got here: data is nok: "+ err);
                dispatch(recieveDataNOK(err));
            });
}

/**
 * checks the state to see if the date exists
 * @param {*} state the state of the app
 * @param {object} stockData information to be searched
 */
const shouldGetDataStock=(state,stockData)=>{
    
    if (!state.items){
        console.log("no items");
        return true;
    }
    
    const datainState=state.items.find(x=>x.searchIndex.toUpperCase()===stockData.stockName+"-"+stockData.startDate+"-"+stockData.endDate);
    //console.log("exists item: "+datainState);

    if (!datainState){
        return true;
    }
    if (datainState.isSearching){
        return false;
    }
    return datainState.didInvalidate;

}
/**
 * entry point operation for searching data
 * @param {object} stockData data to be searched
 */
export const fetchStocksIfNeeded=stockData=>(dispatch, getState)=>{
    
    if (shouldGetDataStock(getState(),stockData)){
        return dispatch(fetchData(stockData));
    }
}

