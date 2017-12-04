import {
    REQUEST_POLLS,
    RECIEVE_POLLS,
    APP_ERROR,
    APP_ERROR_RESET,
    SET_POLL_EXIT,
    ADD_POLL,
    ADD_POLL_OPTION,
    DEL_POLL,
    EDIT_POLL_OPTION,
    POLL_USER_LOGOUT,
    POLL_LOGIN_REQUEST,
    POLL_LOGIN_OK,
    POLL_SOCIAL_LOGIN_REQUEST_OK,
    POLL_LOGIN_NOK,
    POLL_REGISTER_REQUEST,
    POLL_REGISTER_OK,
    POLL_REGISTER_NOK,
    VOTE_POLL
} from '../constants/Actiontypes';
import authApi from '../api/authApi';
import PollsApi from '../api/pollsApi';
import ChallengesApi from '../api/challengesApi';
export const requestPollData=value=>({
    type:REQUEST_POLLS,
    value
});
export const recievePollsData=value=>({
    type:RECIEVE_POLLS,
    value
});

export const setPollAppError=value=>({
    type:APP_ERROR,
    value
});
export const resetPollAppError=value=>({
    type:APP_ERROR_RESET,
    value
});
export const pollAppExit=value=>({
    type:SET_POLL_EXIT,
    value
});
export const addPoll=value=>({
    type:ADD_POLL,
    value
});
export const removePoll=value=>({
    type:DEL_POLL,
    value
});
export const addPollOption=value=>({
    type:ADD_POLL_OPTION,
    value
});
export const editPollOption=value=>({
    type:EDIT_POLL_OPTION,
    value
});
export const pollAppUserLogout=value=>({
    type:POLL_USER_LOGOUT,
    value
}); 
export const setpollAppAuthServerData=value=>({
    type:POLL_LOGIN_REQUEST,
    value
});
export const pollAppAuthSucess=value=>({
    type:POLL_LOGIN_OK,
    value
});
export const pollAppSocialLoginOK=value=>({
    type:POLL_SOCIAL_LOGIN_REQUEST_OK,
    value
});
export const pollAppAuthFailure=value=>({
    type:POLL_LOGIN_NOK,
    value
});
export const pollAppSetRegisterData=value=>({
    type:POLL_REGISTER_REQUEST,
    value
});
export const pollAppRegisterUserOK=value=>({
    type:POLL_REGISTER_OK,
    value
});
export const pollAppRegisterUserNOK=value=>({
    type:POLL_REGISTER_NOK,
    value
});
export const castVotePoll=value=>({
    type:VOTE_POLL,
    value
});

export const pollAppDisconnectUser=authInformation=>dispatch=>{
    authApi.userLogout(authInformation.id)
    .then(()=>{
        ChallengesApi.clearStorage();
        dispatch(pollAppUserLogout(authInformation.id));
    }).catch(err=>{
        dispatch(setPollAppError(err));
    });
};

export const pollAppRegisterServer=authData=>dispatch=>{
    dispatch(pollAppSetRegisterData(authData));
    authApi.registerUser(authData.email,authData.password)
            .then(result=>{
                // set here
                ChallengesApi.setStorageData("votes_userinfo",{authToken:result.authToken,full_name:result.full_name,local:true,email:authData.email,password:authData.password});
                //
                dispatch(pollAppRegisterUserOK(result));
               
            })
            .catch(err=>{
                dispatch(pollAppRegisterUserNOK(err));
                dispatch(setPollAppError(err));
            });
};
export const pollAppaAuthenticateServer=authData=>dispatch=>{
    dispatch(setpollAppAuthServerData(authData));
    authApi.authUserLocal(authData.email,authData.password)
    .then(result=>{
        ChallengesApi.setStorageData("votes_userinfo",{authToken:result.authToken,full_name:result.name,email:authData.email,password:authData.password,local:true});
        dispatch(pollAppAuthSucess(result));
        
        /* console.log('====================================');
        console.log(`auth success action result:${JSON.stringify(result,null,2)}`);
        console.log('===================================='); */
    })
    .catch(err=>{
        dispatch(pollAppAuthFailure(err));
        dispatch(setPollAppError(err));
    });
};
export const fetchSocialInfo=value=>dispatch=>{
    authApi.getSocialInfo(value)
        .then(result=>{
            ChallengesApi.setStorageData("votes_userinfo",{authToken:value,full_name:result.name,email:result.email,islocal:false,twitterToken:result.twitterToken,facebookToken:value.facebookToken,twitterName:result.twitterusername,facebookName:result.facebookusername});
            dispatch(pollAppSocialLoginOK({token:value,full_name:result.name,twitterToken:result.twitterToken,facebookToken:value.facebookToken,email:result.email}));
        })
        .catch(err=>{
            dispatch(setPollAppError(err));
    });
};
export const shareOnSocialMedia=value=>dispatch=>{
    PollsApi.shareSocialPoll(value)
    .then()
    .catch(error=>{
        dispatch(setPollAppError(error));
    });
};
export const fetchPolls=()=>dispatch=>{
    dispatch(requestPollData(true));
    let votesUserStorage=JSON.parse(ChallengesApi.getStorageData("votes_userinfo"));
    console.log('====================================');
    console.log(`dataUserStorage info:${JSON.stringify(votesUserStorage,null,2)}`);
    console.log('====================================');
    if (votesUserStorage){
        console.log('====================================');
        console.log(`1 data with value of :${votesUserStorage.email}`);
        console.log('====================================');
        if (votesUserStorage.islocal){
            dispatch(setpollAppAuthServerData({email:votesUserStorage.email,password:votesUserStorage.password}));
            dispatch(pollAppAuthSucess({authToken:votesUserStorage.authToken,full_name:votesUserStorage.full_name}));
        }
        else{
            dispatch(pollAppSocialLoginOK({token:votesUserStorage.authToken,full_name:votesUserStorage.full_name,twitterToken:votesUserStorage.twitterToken,facebookToken:votesUserStorage.facebookToken,email:votesUserStorage.email,facebookname:votesUserStorage.facebookName,twittername:votesUserStorage.twitterName}));
        }
        
    }
    PollsApi.getallPolls().then(result=>{
        dispatch(recievePollsData(result));
    }).catch(err=>{
        dispatch(setPollAppError(err));
    });
};
export const voteOnPoll=pollInfo=>dispatch=>{
    console.log('====================================');
    console.log(`actions voteon poll data:${JSON.stringify(pollInfo,null,2)}`);
    console.log('====================================');
    PollsApi.votePoll(pollInfo.optionToken)
        .then(()=>{
            dispatch(castVotePoll({polltoken:pollInfo.polltoken,polloption:pollInfo.optionToken}));
        })
        .catch(err=>{
            dispatch(setPollAppError(err));
        });
};
export const addPollFold=pollData=>dispatch=>{
    PollsApi.createPoll(pollData)
        .then(result=>{
            dispatch(addPoll({polltoken:result,pollcreator:pollData.pollcreatormail,pollname:pollData.pollname,polloptions:pollData.polloptions}));
        })
        .catch(err=>{
            dispatch(setPollAppError(err));
        });
    

};
export const removePollFold=polldata=>dispatch=>{
    console.log('====================================');
    console.log(`removePollFold poll data: ${polldata}`);
    console.log('====================================');
    PollsApi.deletePoll(polldata)
    .then(result=>{
        console.log('====================================');
        console.log(`removePollFold poll result`);
        console.log('====================================');
        dispatch(removePoll(polldata));
    })
    .catch(errorDelPoll=>{
        console.log('====================================');
        console.log(`removePollFold poll error: ${errorDelPoll}`);
        console.log('====================================');
        dispatch(setPollAppError(errorDelPoll));
    });
    
};
export const addPollOptionFold=polldata=>dispatch=>{
    PollsApi.injectPollOption(polldata).then(()=>{
        dispatch(addPollOption(polldata));
    }).catch(err=>{
        dispatch(setPollAppError(err));
    });
    
};
