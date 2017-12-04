import {
    APP_ERROR,
    APP_ERROR_RESET,
    POLL_LOGIN_REQUEST,
    POLL_SOCIAL_LOGIN_REQUEST_OK,
    POLL_LOGIN_OK,
    POLL_LOGIN_NOK,
    POLL_REGISTER_REQUEST,
    POLL_REGISTER_NOK,
    POLL_REGISTER_OK,
    POLL_USER_LOGOUT,
    ADD_POLL,
    RECIEVE_POLLS,
    SET_POLL_EXIT,
    DEL_POLL,
    ADD_POLL_OPTION,
    EDIT_POLL_OPTION,
    VOTE_POLL
} from '../constants/Actiontypes';
const voteAppReducer=(state = {
    votesUserInfo:{
        id:'',
        email:'',
        password:'',
        name:'',
        twitter_token:'',
        facebook_token:'',
        facebookname:'',
        twittername:'',
        local:false
    },
    votesisLoggedin: false,
    items: [],
    onError: false,
    errorMessage: ''
}, action)=>{
    switch(action.type){
        case POLL_LOGIN_REQUEST:{
            /*  console.log('====================================');
             console.log(`reducer request email:${action.value.email} password:${action.value.password}`);
             console.log('===================================='); */
             return {
                 ...state,
                 votesUserInfo:{
                     id:'',
                     email:action.value.email,
                     password:action.value.password,
                 }
             };
             
        }
        case POLL_SOCIAL_LOGIN_REQUEST_OK:{
            return{
                ...state,
                votesUserInfo:{
                    id:action.value.token,
                    name:action.value.full_name,
                    email:action.value.email,
                    password:state.votesUserInfo.password,
                    twitter_token:action.value.twitterToken===undefined?'':action.value.twitterToken,
                    facebook_token:action.value.facebookToken===undefined?'':action.value.facebookToken,
                    facebookname:action.value.facebookusername===undefined?'':action.value.facebookusername,
                    twittername:action.value.twitterusername===undefined?'':action.value.twitterusername,
                    local:false
                },
                votesisLoggedin:true
            };
        }
        case ADD_POLL:{
             return{
                 /* ...state.items.slice(0,action.value),
                 ...state.items.slice(action.value,1) */
                 ...state,
                 items:[...state.items,action.value]

             };
        }
        case RECIEVE_POLLS:{
            return{
                ...state,
                items:action.value
            };
        }
        case DEL_POLL:{
            let votingIndex=state.items.findIndex(x=>x.polltoken==action.value);
            return {
                ...state,
                items:[...state.items.slice(0,votingIndex),...state.items.slice(votingIndex+1)]
            };
        }
        case ADD_POLL_OPTION:{
            return{
                ...state,
                items:state.items.map(itemPoll=>{
                    if (itemPoll.polltoken!==action.value.pollid){
                        return itemPoll;
                    }
                    itemPoll.polloptions.push({
                        idoption:action.value.poll_option_id,
                        optionname:action.value.poll_option_name,
                        votes:0
                    });
                    return itemPoll;
                })
            };
        }
        case EDIT_POLL_OPTION:{
            return {
                ...state,
            };
        }
        case VOTE_POLL:{
           
            return {
                ...state,
                items:state.items.map(itemPoll=>{
                    if (itemPoll.polltoken!==action.value.polltoken){
                        return itemPoll;
                    }
                    
                    itemPoll.polloptions.forEach(element=>{
                        if (element.idoption==action.value.polloption){
                            
                            element.votes+=1;
                        }
                    });
                    
                    return itemPoll;
                })
            };
        }
        case SET_POLL_EXIT:{
             return{
                // ...state,
                votesUserInfo:{
                    id:'',
                    email:'',
                    password:'',
                    name:'',
                    twitter_token:'',
                    facebook_token:'',
                    facebookname:'',
                    twittername:'',
                    local:false
                },
                votesisLoggedin: false,
                items: [],
                onError: false,
                errorMessage: ''
             };
        }
        case POLL_REGISTER_REQUEST:{
            /*  console.log('====================================');
             console.log(`reduce register request email:${action.value.email} password:${action.value.password}`);
             console.log('===================================='); */
             return {
                 ...state,
                 votesUserInfo:{
                     id:'',
                     email:action.value.email,
                     password:action.value.password
                 }
             };
             
         }
        case POLL_LOGIN_OK:{
            /*  console.log('====================================');
             console.log(`reducer login ok ${action.value}:\ user Info:${state.votesUserInfo.email} pass:${state.votesUserInfo.password}`);
             console.log('===================================='); */
             return {
                 ...state,
                 votesisLoggedin:true,
                 votesUserInfo:{
                     id:action.value.authToken,
                     email:state.votesUserInfo.email,
                     password:state.votesUserInfo.password,
                     name:action.value.full_name,
                     local:true
                 }
             };
             
         }
        case POLL_REGISTER_OK:{
            /*  console.log('====================================');
             console.log(`reducer register ok ${action.value}:\ user Info:${state.votesUserInfo.email} pass:${state.votesUserInfo.password}`);
             console.log('===================================='); */
             return {
                 ...state,
                 votesisLoggedin:true,
                 votesUserInfo:{
                     id:action.value,
                     email:state.votesUserInfo.email,
                     password:state.votesUserInfo.password
                 }
             };
             
         }
        case POLL_LOGIN_NOK:{
            return {
                ...state,
                votesUserInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            
        }
        case POLL_REGISTER_NOK:{
            return {
                ...state,
                votesUserInfo:{
                    id:'',
                    email:'',
                    password:''
                }
            };
            
        }
        case POLL_USER_LOGOUT:{
            return {
                ...state,
                votesUserInfo:{
                    id:'',
                    email:'',
                    password:'',
                    name:'',
                    twitter_token:'',
                    facebook_token:'',
                    facebookname:'',
                    twittername:'',
                    local:false
                },
                votesisLoggedin: false,
            };
            
        }
        case APP_ERROR_RESET:{
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
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