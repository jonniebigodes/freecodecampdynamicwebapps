import {
    REQUEST_STOCKS,
    RECIEVE_STOCKS,
    RECIEVE_STOCKS_NOK,
    SET_STOCK_VALUE,
    SET_DATA_START,
    SET_DATA_END,
    APP_ERROR,
    APP_ERROR_RESET,
    DELETE_STOCK
} from '../constants/Actiontypes'

const StockAppReducer= (state = {
    isSearching:false,
    didInvalidate:false,
    stockQuery:'',
    initialDate:'',
    finalDate:'',
    items: [],
    onError:false,
    errorMessage:''
}, action) => {
    switch (action.type) {  
        case REQUEST_STOCKS:
            //console.log("reducer REQUEST_STOCKS: "+action.value);
            return {
                ...state,
                isSearching: true,
                didInvalidate: false,
            }
            break;
        
        case RECIEVE_STOCKS:
            //console.log("reducer RECIEVE_STOCKS: "+action.result.stockName);    
            return {
                ...state,
                items: [...state.items, {searchIndex: action.result.stockCode+"-"+action.result.stockQueryStart+"-"+action.result.StockQueryEnd,searchResults:action.result}],
                isSearching:false,
                didInvalidate:false,
                stockQuery:'',
                initialDate:'',
                finalDate:''
            }
            break;
        case RECIEVE_STOCKS_NOK:
            //console.log("reducer RECIEVE_STOCKS_NOK: \n error: "+ action.error);
            return{
                ...state,
                isSearching:false,
                didInvalidate:false,
                isSearching:false,
                didInvalidate:false,
                stockQuery:'',
                initialDate:'',
                finalDate:'',
                onError:true,
                errorMessage:action.error
            }
            break;
        case APP_ERROR_RESET:
             //console.log("reducer APP_ERROR_RESET");
             return{
                ...state,
                isSearching:false,
                didInvalidate:false,
                isSearching:false,
                didInvalidate:false,
                stockQuery:'',
                initialDate:'',
                finalDate:'',
                onError:false,
                errorMessage:''
            }
            break;
        case APP_ERROR:
            //console.log("reducer app error");
            return{
                ...state,
                onError:true,
                errorMessage:action.value
            }
        case DELETE_STOCK:
            //console.log("reduce delete stock: "+ action.value);
            return {
                ...state,
                items:state.items.filter(item=>action.value!==item.searchIndex)

            }
        case SET_DATA_START:
            //console.log("reducer SET_DATA_START: "+action.valueDi);
            return {
                ...state,
                isSearching:false,
                didInvalidate:false,
                initialDate:action.valueDi
            }
            
            break;
        case SET_STOCK_VALUE:
            //console.log("reducer SET_STOCK_VALUE: "+action.valueQuery);
            return {
                ...state,
                isSearching:false,
                didInvalidate:false,
                stockQuery:action.valueQuery
                
            }
            
            break;
        case SET_DATA_END:
            //console.log("reducer SET_DATA_END: "+action.valueFD);
            return {
                ...state,
                isSearching:false,
                didInvalidate:false,
                finalDate:action.valueFD

            }
            break;
        
        default:
            return state;
            
    }
    
};





export default StockAppReducer;