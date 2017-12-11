import {
    REQUEST_STOCKS,
    RECIEVE_STOCKS,
    APP_ERROR,
    APP_ERROR_RESET,
    DELETE_STOCK,
    SET_STOCK_EXIT
} from '../constants/Actiontypes';

const StockAppReducer= (state = {
    isSearching:false,
    stockQuery:'',
    initialDate:'',
    finalDate:'',
    entities:{},
    results: [],
    onError:false,
    errorMessage:''
}, action) => {
    switch (action.type) {
        case REQUEST_STOCKS:{
            //console.log("reducer REQUEST_STOCKS: "+action.value);
            return {
                ...state,
                isSearching: true,
                stockQuery:action.value.stockName,
                initialDate:action.value.startDate,
                finalDate:action.value.endDate
            };
            
        }
        case RECIEVE_STOCKS:{
          
            return {
                ...state,
                isSearching:false,
                stockQuery:'',
                initialDate:'',
                finalDate:'',
                results:[...state.results,action.result.id],
                entities:{
                    ...state.entities,
                    [action.result.id]:action.result.data[action.result.id]
                }
                
            };
            
        }
        
        case APP_ERROR_RESET:{
             //console.log("reducer APP_ERROR_RESET");
             return{
                ...state,
                onError:false,
                errorMessage:''
            };
            
        }
        case APP_ERROR:{
            //console.log("reducer app error");
            return{
                ...state,
                onError:true,
                errorMessage:action.value
            };
        }
        case DELETE_STOCK:{
            //console.log("reduce delete stock: "+ action.value);
            delete state.entities[action.value];
            const stockid= state.results.findIndex(x=>x==action.value);
            return {
                ...state,
                results:[...state.results.slice(0,stockid),...state.results.slice(stockid+1)]
                // items:state.items.filter(item=>action.value!==item.searchIndex)

            };
        }
        
        case SET_STOCK_EXIT:{
            return{
                ...state,
                isSearching:false,
                didInvalidate:false,
                stockQuery:'',
                initialDate:'',
                finalDate:'',
                entities:{},
                results: [],
                onError:false,
                errorMessage:''
            };
        }
        default:{
            return state;
        }
            
    }
    
};





export default StockAppReducer;