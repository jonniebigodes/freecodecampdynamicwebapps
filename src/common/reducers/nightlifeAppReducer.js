import {
    NIGHT_ERROR,
    RESET_NIGHT_ERROR,
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
    RECIEVE_YELP_TOKEN
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
    searchResults:[],
    searchResultsEntities:{},
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
        }
        case ADD_TO_NIGHT:{
            let addedToNight=state.searchResultsEntities[action.value.idPlace];
            addedToNight.isGoing= true;

            return{
                ...state,
                searchResultsEntities:{
                    ...state.searchResultsEntities,
                    [action.value.idPlace]:addedToNight
                }
            }; 
        }
        case REMOVE_FROM_NIGHT:{
            let removedFromNight=state.searchResultsEntities[action.value.idPlace];
            removedFromNight.isGoing= false;
            return{
                ...state,
                searchResultsEntities:{
                    ...state.searchResultsEntities,
                    [action.value.idPlace]:removedFromNight
                }
                
            };
        }
        case RECIEVE_USER_SEARCH:{
            
            return {
                ...state,
                searchResults:action.value.result,
                searchResultsEntities:action.value.entities.nights
            };
            
        }
        case RECIEVE_NIGHT:{
            let newData= state.searchResults.concat(action.result.result);
            //let newEntities=Object.assign(state.searchResultsEntities,action.value,action.result.entities.nights);
            let newEntities=Object.assign(state.searchResultsEntities,action.result.entities.nights);
            return {
                ...state,
                searchResults:newData,
                searchResultsEntities:newEntities,
                
                isSearching: false
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
                searchResults:[],
                searchResultsEntities:{},
                nightisLoggedin:false
            };
        }
        case RECIEVE_NIGHT_NOK:{
            //console.log("reducer RECIEVE_STOCKS_NOK: \n error: "+ action.error);
            return {
                ...state,
                isSearching: false,
                onError: true,
                errorMessage: action.error
            };
        }
        case RESET_NIGHT_ERROR:{
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
                isSearching: false,
                onError: false,
                errorMessage: ''
            };
        }
        case NIGHT_ERROR:{
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
                searchResults:[],
                searchResultsEntities:{},
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