import {
    POLL_APP_ERROR,
    POLL_APP_ERROR_RESET,
    POLL_LOGIN_REQUEST,
    POLL_SOCIAL_LOGIN_REQUEST_OK,
    POLL_LOGIN_OK,
    POLL_LOGIN_NOK,
    POLL_REGISTER_REQUEST,
    POLL_REGISTER_NOK,
    POLL_REGISTER_OK,
    POLL_USER_LOGOUT,
    ADD_POLL,
    REQUEST_POLLS,
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
    voteIsSearching:false,
    votesisLoggedin: false,
    results:[],
    polls:{},
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
                 results:[...state.results,action.value.polltoken],
                 polls:{
                     ...state.polls,
                     [action.value.polltoken]:action.value.data
                 }
             };
        }
        case REQUEST_POLLS:{
            return {
                ...state,
                voteIsSearching:true
            };
        }
        case RECIEVE_POLLS:{
            return{
                ...state,
                voteIsSearching:false,
                polls:action.value.entities.polls,
                results:action.value.result
            };
        }
        case DEL_POLL:{
            let votingIndex=state.results.findIndex(x=>x.polltoken==action.value);
            delete state.polls[action.value];
            return {
                ...state,
                results:[...state.results.slice(0,votingIndex),...state.results.slice(votingIndex+1)]
            };
        }
        case ADD_POLL_OPTION:{
            let tmpOptionsPoll= state.polls[action.value.pollid].polloptions;
           
            tmpOptionsPoll.push({
                idoption:action.value.poll_option_id,
                optionname:action.value.poll_option_name,
                votes:0
            });
            state.polls[action.value.pollid]={
                ...state.polls[action.value.pollid],
                polloptions:tmpOptionsPoll
            };
            return{
                ...state,
            };
        }
        case EDIT_POLL_OPTION:{
            return {
                ...state,
            };
        }
        case VOTE_POLL:{
            
            let optionsPoll=state.polls[action.value.polltoken].polloptions.map(item=>{
                if (item.idoption==action.value.polloption){
                    item.votes+=1;
                }
                return item;
            });
            state.polls[action.value.polltoken]={
                ...state.polls[action.value.polltoken],
                polloptions:optionsPoll
            };
            return {
                ...state
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
                
                onError: false,
                errorMessage: '',
                voteIsSearching:false,
                results:[],
                polls:{}
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
                 local:true,
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
        case POLL_APP_ERROR_RESET:{
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
                onError: false,
                errorMessage: ''
            };
        }
        case POLL_APP_ERROR:{
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