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
    REQUEST_BOOKS,
    RECIEVE_BOOKS,
    RECIEVE_BOOKS_NOK,
    SET_BOOK_EXIT
    
} from '../constants/Actiontypes';

const bookAppReducer = (state = {
    userInfo:{
        id:'',
        email:'',
        password:''
    },
    isLoggedin: false,
    
    items: [],
    onError: false,
    errorMessage: ''
}, action) => {
    switch (action.type) {
        case REQUEST_BOOKS:{
            return {
                ...state,
                isSearching: true
                
            };
            break;
        }
            //console.log("reducer REQUEST_STOCKS: "+action.value);
            
       
        case RECIEVE_BOOKS:
            
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
        case LOGIN_REQUEST:
            console.log('====================================');
            console.log(`reducer request email:${action.value.email} password:${action.value.password}`);
            console.log('====================================');
            return {
                ...state,
                
                userInfo:{
                    id:'',
                    email:action.value.email,
                    password:action.value.password
                }


            };
            break;
        case REGISTER_REQUEST:
            console.log('====================================');
            console.log(`reduce register request email:${action.value.email} password:${action.value.password}`);
            console.log('====================================');
            return {
                ...state,
                
                userInfo:{
                    id:'',
                    email:action.value.email,
                    password:action.value.password
                }


            };
            break;
        case LOGIN_OK:
            console.log('====================================');
            console.log(`reducer login ok ${action.value}:\ user Info:${state.userInfo.email} pass:${state.userInfo.password}`);
            console.log('====================================');
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
        case REGISTER_OK:
            console.log('====================================');
            console.log(`reducer register ok ${action.value}:\ user Info:${state.userInfo.email} pass:${state.userInfo.password}`);
            console.log('====================================');
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
        case LOGIN_NOK:
            return {
                ...state,
                userInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            break;
        case REGISTER_NOK:
            return {
                ...state,
                userInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            break;
        case USER_LOGOUT:
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
        case RECIEVE_BOOKS_NOK:
            //console.log("reducer RECIEVE_STOCKS_NOK: \n error: "+ action.error);
            return {
                ...state,
                isSearching: false,
                onError: true,
                errorMessage: action.error
            };
            break;
        case APP_ERROR_RESET:
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
                isSearching: false,
                onError: false,
                errorMessage: ''
            };
            break;
        case APP_ERROR:
            //console.log("reducer app error");
            return {
                ...state,
                onError: true,
                errorMessage: action.value
            };
            break;
        
        case SET_BOOK_EXIT:
            
            return{
                ...state,
                userInfo:{},
                isLoggedin: false,
                
                items: [],
                onError: false,
                errorMessage: ''
            };
            break;
        default:
            return state;
            break;
    }

};
export default bookAppReducer;