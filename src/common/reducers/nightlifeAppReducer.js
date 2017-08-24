import {
    APP_ERROR,
    APP_ERROR_RESET,
    LOGIN_REQUEST,
    LOGIN_OK,
    LOGIN_NOK,
    REQUEST_NIGHT,
    RECIEVE_NIGHT,
    RECIEVE_NIGHT_NOK,
    ADD_TO_NIGHT,
    REMOVE_FROM_NIGHT
} from '../constants/Actiontypes'

const nightAppReducer = (state = {
    userInfo:{},
    isLoggedin: false,
    nightvenueQuery: 'default',
    location:'',
    items: [],
    onError: false,
    errorMessage: ''
}, action) => {
    switch (action.type) {
        case REQUEST_NIGHT:
            //console.log("reducer REQUEST_STOCKS: "+action.value);
            return {
                ...state,
                isSearching: true
                
            }
            break;

        case RECIEVE_NIGHT:
            //console.log("reducer RECIEVE_STOCKS: "+action.result.stockName);
            return {
                ...state,
                items: [
                    ...state.items, {
                        searchIndex: action.result.stockCode + "-" + action.result.stockQueryStart + "-" + action.result.StockQueryEnd,
                        searchResults: action.result
                    }
                ],
                isSearching: false,
                didInvalidate: false,
                stockQuery: '',
                initialDate: '',
                finalDate: ''
            }
            break;
        case RECIEVE_NIGHT_NOK:
            //console.log("reducer RECIEVE_STOCKS_NOK: \n error: "+ action.error);
            return {
                ...state,
                isSearching: false,
                didInvalidate: false,
                isSearching: false,
                didInvalidate: false,
                stockQuery: '',
                initialDate: '',
                finalDate: '',
                onError: true,
                errorMessage: action.error
            }
            break;
        case APP_ERROR_RESET:
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
                isSearching: false,
                didInvalidate: false,
                isSearching: false,
                didInvalidate: false,
                stockQuery: '',
                initialDate: '',
                finalDate: '',
                onError: false,
                errorMessage: ''
            }
            break;
        case APP_ERROR:
            //console.log("reducer app error");
            return {
                ...state,
                onError: true,
                errorMessage: action.value
            }
        
        default:
            return state;

    }

};
export default nightAppReducer;