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
    SET_USER_INFORMATION,
    REQUEST_BOOKS,
    RECIEVE_BOOKS,
    RECIEVE_BOOKS_NOK,
    SET_BOOK_EXIT,
    ADD_BOOK,
    BOOK_TRADE_NOK,
    BOOK_TRADE_OK
    
} from '../constants/Actiontypes';
const bookAppReducer = (state = {
    userInfo:{
        id:'',
        email:'',
        password:'',
        name:'',
        city:'',
        countrystate:'',
        country:''

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
        case RECIEVE_BOOKS:{
            //console.log(`recieve nigth index:${resultIndex}`);
            //console.log('====================================');
           
            return {
                ...state,
                items: state.items.concat(action.value),
                isSearching: false
            };
            break;
        }
        case LOGIN_REQUEST:{
           /*  console.log('====================================');
            console.log(`reducer request email:${action.value.email} password:${action.value.password}`);
            console.log('===================================='); */
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
           /*  console.log('====================================');
            console.log(`reduce register request email:${action.value.email} password:${action.value.password}`);
            console.log('===================================='); */
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
           /*  console.log('====================================');
            console.log(`reducer login ok ${action.value}:\ user Info:${state.userInfo.email} pass:${state.userInfo.password}`);
            console.log('===================================='); */
            return {
                ...state,
                isLoggedin:true,
                userInfo:{
                    id:action.value.authToken,
                    email:state.userInfo.email,
                    password:state.userInfo.password,
                    name:action.value.full_name,
                    city:action.value.city,
                    countrystate:action.value.countrystate,
                    country:action.value.country
                },
                
            };
            break;
        }
        case REGISTER_OK:{
           /*  console.log('====================================');
            console.log(`reducer register ok ${action.value}:\ user Info:${state.userInfo.email} pass:${state.userInfo.password}`);
            console.log('===================================='); */
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
                    password:'',
                    name:'',
                    city:'',
                    countrystate:'',
                    country:''
                },
                isLoggedin:false
            }
            break;
        }
        case SET_USER_INFORMATION:{
            return{
                ...state,
                userInfo:{
                    id:state.userInfo.id,
                    email:state.userInfo.email,
                    password:state.userInfo.password,
                    name:action.value.fullusername!==undefined?action.value.fullusername:'',
                    city:action.value.city!==undefined?action.value.city:'',
                    countrystate:action.value.countrystate!==undefined?action.value.countrystate:'',
                    country:action.value.country!==undefined?action.value.country:''
                }

            };
        }
        case RECIEVE_BOOKS_NOK:{
            //console.log("reducer RECIEVE_STOCKS_NOK: \n error: "+ action.error);
            return {
                ...state,
                isSearching: false,
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
        case SET_BOOK_EXIT:{
            return{
                ...state,
                userInfo:{},
                isLoggedin: false,
                
                items: [],
                onError: false,
                errorMessage: ''
            };
            break;
        }
        case ADD_BOOK:{
            /* console.log('====================================');
            console.log(`book app trade reducer ADD_BOOK: ${JSON.stringify(action.value)}`);
            console.log('===================================='); */
            return {
                ...state,
                items:[...state.items,action.value]
            };
            break;
        }
        case BOOK_TRADE_NOK:{
            return{
                ...state,
                onError: true,
                errorMessage: action.value
            }
            break;
        }
        case BOOK_TRADE_OK:{
            
            return {
                ...state,
                items:state.items.map(item=>{
                    if (item.booktoken!==action.value.tokenBook){
                        return item;
                    }
                    item.bookisbeingtraded=true;
                    item.bookbeingtradedto=action.value.tradercontact;
                    return item;
                    
                })
            };
            break;
        }
        default:{
            return state;
            break;
        }
    }

};
export default bookAppReducer;