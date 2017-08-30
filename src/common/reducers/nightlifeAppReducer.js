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
    REMOVE_FROM_NIGHT,
    SET_LOCATION_NIGHT,
    SET_NIGHT_SEARCH,
    SET_NIGHT_NUMBER,
    SET_NIGHT_EXIT
} from '../constants/Actiontypes'

const nightAppReducer = (state = {
    userInfo:{},
    isLoggedin: false,
    nightvenueQuery: 'default',
    numberOfItems:0,
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
            
            let resultIndex=state.isLoggedin?state.userInfo.userId:'anon-'+state.nightvenueQuery+"-"+state.location;
            //console.log(`recieve nigth index:${resultIndex}`);
            //console.log('====================================');
            
            return {
                ...state,
                items: [
                    ...state.items, {
                        searchIndex: resultIndex,
                        searchResults: action.result
                    }
                ],
                isSearching: false,
                nightvenueQuery: 'default',
                location:'',
                numberOfItems:0
                
            }
            break;
        case RECIEVE_NIGHT_NOK:
            //console.log("reducer RECIEVE_STOCKS_NOK: \n error: "+ action.error);
            return {
                ...state,
                isSearching: false,
                nightvenueQuery: 'default',
                location:'',
                numberOfItems:0,
                onError: true,
                errorMessage: action.error
            }
            break;
        case APP_ERROR_RESET:
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
                isSearching: false,
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
            break;
        case SET_LOCATION_NIGHT:
            return{
                ...state,
                location:action.valueLocation
            }
            break;
        case SET_NIGHT_SEARCH:
            return{
                ...state,
                nightvenueQuery:action.valueQuery
            }
            break;
        case SET_NIGHT_NUMBER:
            return{
                ...state,
                numberOfItems:action.valueNumber
            }
            break;
        case SET_NIGHT_EXIT:
            
            return{
                ...state,
                userInfo:{},
                isLoggedin: false,
                nightvenueQuery: 'default',
                numberOfItems:0,
                location:'',
                items: [],
                onError: false,
                errorMessage: ''
            }
            break;
        default:
            return state;
            break;
    }

};
export default nightAppReducer;