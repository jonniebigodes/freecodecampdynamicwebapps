import {
    APP_ERROR,
    APP_ERROR_RESET,
    LOGIN_REQUEST,
    LOGIN_OK,
    LOGIN_NOK,
    REGISTER_REQUEST,
    REGISTER_NOK,
    REGISTER_OK,
    USER_LOGOUT,
    REQUEST_NIGHT,
    RECIEVE_NIGHT,
    RECIEVE_NIGHT_NOK,
    ADD_TO_NIGHT,
    REMOVE_FROM_NIGHT,
    SET_LOCATION_NIGHT,
    SET_NIGHT_SEARCH,
    SET_NIGHT_NUMBER,
    SET_NIGHT_EXIT,
    RECIEVE_USER_SEARCH
} from '../constants/Actiontypes';


const nightAppReducer = (state = {
    userInfo:{
        id:'',
        email:'',
        password:''
    },
    isLoggedin: false,
    nightvenueQuery: 'default',
    numberOfItems:0,
    location:'',
    items: [],
    onError: false,
    errorMessage: ''
}, action) => {
    switch (action.type) {
        case REQUEST_NIGHT:{
            //console.log("reducer REQUEST_STOCKS: "+action.value);
            return {
                ...state,
                isSearching: true
                
            };
            break;
        }
        case ADD_TO_NIGHT:{
            return{
                ...state,
                
            };
            break;
        }
        case REMOVE_FROM_NIGHT:{
            return{
                ...state,
                
            };
            break;
        }
        case RECIEVE_USER_SEARCH:{
            return {
                ...state,
                items:[
                    ...state.items,
                    {
                        searchIndex:state.userInfo.id+"-"+action.value.what+"-"+action.value.where,
                        searchQuery:{
                            where:action.value.where,
                            what:action.value.what,
                            howmany:action.value.howmany
                        },
                        searchResults:action.value.searchResults
                    }
                ]
            };
            break;
        }
        case RECIEVE_NIGHT:{
            
            let resultIndex=state.isLoggedin?state.userInfo.id+'-'+state.nightvenueQuery+"-"+state.location:'anon-'+state.nightvenueQuery+"-"+state.location;
            //console.log(`recieve nigth index:${resultIndex}`);
            //console.log('====================================');
            
            return {
                ...state,
                items: [
                    ...state.items, 
                    {
                        searchQuery:{
                            where:state.location,
                            howmany:state.numberOfItems,
                            what:state.nightvenueQuery
                        },
                        searchIndex: resultIndex,
                        searchResults: action.result
                    }
                ],
                isSearching: false,
                nightvenueQuery: 'default',
                location:'',
                numberOfItems:0
                
            };
            break;
        }
        case LOGIN_REQUEST:{
            
            return {
                ...state,
                
                userInfo:{
                    id:'',
                    email:action.value.email,
                    password:action.value.password
                }


            };
            break;
        }
        case REGISTER_REQUEST:{
           
            return {
                ...state,
                
                userInfo:{
                    id:'',
                    email:action.value.email,
                    password:action.value.password
                }


            };
            break;
        }
        case LOGIN_OK:{
           
            return {
                ...state,
                isLoggedin:true,
                userInfo:{
                    id:action.value,
                    email:state.userInfo.email,
                    password:state.userInfo.password
                },
                items:[]
            };
            break;
        }
        case REGISTER_OK:{
            
            return {
                ...state,
                isLoggedin:true,
                userInfo:{
                    id:action.value,
                    email:state.userInfo.email,
                    password:state.userInfo.password
                }
            };
            break;
        }
        case LOGIN_NOK:{
            return {
                ...state,
                userInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            break;
        }
        case REGISTER_NOK:{
            return {
                ...state,
                userInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            break;
        }
        case USER_LOGOUT:{
            return {
                ...state,
                userInfo:{
                    id:'',
                    email:'',
                    password:''
                },
                items:[],
                isLoggedin:false
            }
            break;
        }
        case RECIEVE_NIGHT_NOK:{
            //console.log("reducer RECIEVE_STOCKS_NOK: \n error: "+ action.error);
            return {
                ...state,
                isSearching: false,
                nightvenueQuery: 'default',
                location:'',
                numberOfItems:0,
                onError: true,
                errorMessage: action.error
            };
            break;
        }
        case APP_ERROR_RESET:{
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
                isSearching: false,
                onError: false,
                errorMessage: ''
            };
            break;
        }
        case APP_ERROR:{
            //console.log("reducer app error");
            return {
                ...state,
                onError: true,
                errorMessage: action.value
            };
            break;
        }
        case SET_LOCATION_NIGHT:{
            return{
                ...state,
                location:action.valueLocation
            };
            break;
        }
        case SET_NIGHT_SEARCH:{
            return{
                ...state,
                nightvenueQuery:action.valueQuery
            };
            break;
        }
        case SET_NIGHT_NUMBER:{
            return{
                ...state,
                numberOfItems:action.valueNumber
            };
            break;
        }
        case SET_NIGHT_EXIT:{
            
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
            };
            break;
        }
        default:{
            return state;
            break;
        }
    }

};
export default nightAppReducer;