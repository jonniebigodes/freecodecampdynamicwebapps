import {
    APP_ERROR,
    APP_ERROR_RESET,
    BOOK_LOGIN_REQUEST,
    BOOK_LOGIN_OK,
    BOOK_LOGIN_NOK,
    BOOK_REGISTER_REQUEST,
    BOOK_REGISTER_NOK,
    BOOK_REGISTER_OK,
    BOOK_USER_LOGOUT,
    BOOK_SET_USER_INFORMATION,
    REQUEST_BOOKS,
    RECIEVE_BOOKS,
    RECIEVE_BOOKS_NOK,
    SET_BOOK_EXIT,
    ADD_BOOK,
    BOOK_TRADE_NOK,
    BOOK_TRADE_OK
    
} from '../constants/Actiontypes';
const bookAppReducer = (state = {
    bookuserInfo:{
        id:'',
        email:'',
        password:'',
        name:'',
        city:'',
        countrystate:'',
        country:''

    },
    bookAppisLoggedin: false,
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
            
        }
        case RECIEVE_BOOKS:{
            //console.log(`recieve nigth index:${resultIndex}`);
            //console.log('====================================');
            return {
                ...state,
                items: state.items.concat(action.value),
                isSearching: false
            };
            
        }
        case BOOK_LOGIN_REQUEST:{
           /*  console.log('====================================');
            console.log(`reducer request email:${action.value.email} password:${action.value.password}`);
            console.log('===================================='); */
            return {
                ...state,
                bookuserInfo:{
                    id:'',
                    email:action.value.email,
                    password:action.value.password
                }
            };
            
        }
        case BOOK_REGISTER_REQUEST:{
           /*  console.log('====================================');
            console.log(`reduce register request email:${action.value.email} password:${action.value.password}`);
            console.log('===================================='); */
            return {
                ...state,
                bookuserInfo:{
                    id:'',
                    email:action.value.email,
                    password:action.value.password
                }
            };
            
        }
        case BOOK_LOGIN_OK:{
           /*  console.log('====================================');
            console.log(`reducer login ok ${action.value}:\ user Info:${state.userInfo.email} pass:${state.userInfo.password}`);
            console.log('===================================='); */
            return {
                ...state,
                bookAppisLoggedin:true,
                bookuserInfo:{
                    id:action.value.authToken,
                    email:state.bookuserInfo.email,
                    password:state.bookuserInfo.password,
                    name:action.value.full_name,
                    city:action.value.city,
                    countrystate:action.value.countrystate,
                    country:action.value.country
                },
                
            };
            
        }
        case BOOK_REGISTER_OK:{
           /*  console.log('====================================');
            console.log(`reducer register ok ${action.value}:\ user Info:${state.userInfo.email} pass:${state.userInfo.password}`);
            console.log('===================================='); */
            return {
                ...state,
                bookAppisLoggedin:true,
                bookuserInfo:{
                    id:action.value,
                    email:state.bookuserInfo.email,
                    password:state.bookuserInfo.password
                }
            };
            
        }
        case BOOK_LOGIN_NOK:{
            return {
                ...state,
                userInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            
        }
        case BOOK_REGISTER_NOK:{
            return {
                ...state,
                userInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            
        }
        case BOOK_USER_LOGOUT:{
            return {
                ...state,
                bookuserInfo:{
                    id:'',
                    email:'',
                    password:'',
                    name:'',
                    city:'',
                    countrystate:'',
                    country:''
                },
                bookAppisLoggedin:false
            };
            
        }
        case BOOK_SET_USER_INFORMATION:{
            return{
                ...state,
                bookuserInfo:{
                    id:state.bookuserInfo.id,
                    email:state.bookuserInfo.email,
                    password:state.bookuserInfo.password,
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
        case SET_BOOK_EXIT:{
            return{
                ...state,
                bookuserInfo:{},
                bookAppisLoggedin: false,
                items: [],
                onError: false,
                errorMessage: ''
            };
            
        }
        case ADD_BOOK:{
            /* console.log('====================================');
            console.log(`book app trade reducer ADD_BOOK: ${JSON.stringify(action.value)}`);
            console.log('===================================='); */
            return {
                ...state,
                items:[...state.items,action.value]
            };
            
        }
        case BOOK_TRADE_NOK:{
            return{
                ...state,
                onError: true,
                errorMessage: action.value
            };
            
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
        
        }
        default:{
            return state; 
        }
    }

};
export default bookAppReducer;