import {
    APP_ERROR,
    APP_ERROR_RESET,
    LOGIN_REQUEST,
    LOGIN_OK,
    LOGIN_NOK,
    REGISTER_REQUEST,
    REGISTER_NOK,
    REGISTER_OK,
    USER_LOGOUT
} from '../constants/Actiontypes';
const voteAppReducer=(state = {
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
}, action)=>{
    switch(action.type){
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
        default:{
            return state;
        }
    }
};
export default voteAppReducer;