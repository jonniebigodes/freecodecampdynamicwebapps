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
    SET_NIGHT_EXIT,
    RECIEVE_USER_SEARCH,
    RECIEVE_YELP_TOKEN,
    SET_NIGHT_INFO
} from '../constants/Actiontypes';


const nightAppReducer = (state = {
    nightuserInfo:{
        id:'',
        email:'',
        password:''
    },
    yelpToken:{
        token:'',
        expires:0
    },
    nightisLoggedin: false,
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
                isSearching: true,
                nightvenueQuery:action.value.query,
                numberOfItems:action.value.howMany,
                location:action.value.where
            };
        }
        
        case ADD_TO_NIGHT:{
            return{
                ...state,
            }; 
        }
        case REMOVE_FROM_NIGHT:{
            return{
                ...state,
            };
        }
        case RECIEVE_USER_SEARCH:{
            return {
                ...state,
                items:[
                    ...state.items,
                    {
                        searchIndex:state.nightuserInfo.id+"-"+action.value.what+"-"+action.value.where,
                        searchQuery:{
                            where:action.value.where,
                            what:action.value.what,
                            howmany:action.value.howmany
                        },
                        searchResults:action.value.searchResults
                    }
                ]
            };
            
        }
        case RECIEVE_NIGHT:{
            let resultIndex=state.nightisLoggedin?state.nightuserInfo.id+'-'+state.nightvenueQuery+"-"+state.location:'anon-'+state.nightvenueQuery+"-"+state.location;
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
        }
        case LOGIN_REQUEST:{
            return {
                ...state,
                
                nightuserInfo:{
                    id:'',
                    email:action.value.email,
                    password:action.value.password
                }
            };
        }
        case REGISTER_REQUEST:{
            return {
                ...state,
                
                nightuserInfo:{
                    id:'',
                    email:action.value.email,
                    password:action.value.password
                }
            }; 
        }
        case LOGIN_OK:{
            return {
                ...state,
                nightisLoggedin:true,
                nightuserInfo:{
                    id:action.value,
                    email:state.nightuserInfo.email,
                    password:state.nightuserInfo.password
                },
                items:[]
            };
            
        }
        case REGISTER_OK:{
            
            return {
                ...state,
                nightisLoggedin:true,
                nightuserInfo:{
                    id:action.value,
                    email:state.nightuserInfo.email,
                    password:state.nightuserInfo.password
                }
            };
            
        }
        case LOGIN_NOK:{
            return {
                ...state,
                nightuserInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            
        }
        case REGISTER_NOK:{
            return {
                ...state,
                nightuserInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            
        }
        case USER_LOGOUT:{
            return {
                ...state,
                nightuserInfo:{
                    id:'',
                    email:'',
                    password:''
                },
                items:[],
                nightisLoggedin:false
            };
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
        }
        case APP_ERROR_RESET:{
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
                isSearching: false,
                onError: false,
                errorMessage: ''
            };
        }
        case APP_ERROR:{
            //console.log("reducer app error");
            return {
                ...state,
                onError: true,
                errorMessage: action.value
            }; 
        }
        
        case SET_NIGHT_EXIT:{
            return{
                ...state,
                nightuserInfo:{
                    id:'',
                    email:'',
                    password:''
                },
                nightisLoggedin: false,
                nightvenueQuery: 'default',
                numberOfItems:0,
                location:'',
                items: [],
                onError: false,
                errorMessage: '',
                yelpToken:{}
            };
        }
        case RECIEVE_YELP_TOKEN:{
            return {
                ...state,
                yelpToken:{
                    token:action.value.token,
                    expires:action.value.expires
                }
            };
        }
        default:{
            return state;
        }
    }

};
export default nightAppReducer;