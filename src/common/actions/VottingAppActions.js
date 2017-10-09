import * as types from '../constants/Actiontypes';
import authApi from '../api/authApi';
import PollsApi from '../api/pollsApi';


export const requestPollData=value=>({
    type:types.REQUEST_POLLS,
    value
});

export const recievePollsData=value=>({
    type:types.RECIEVE_POLLS,
    value
});
export const recievePollsDataNOK=value=>({
    type:types.RECIEVE_POLLS_NOK,
    value
});
export const setPollAppError=value=>({
    type:types.APP_ERROR,
    value
});
export const resetPollAppError=value=>({
    type:types.APP_ERROR_RESET,
    value
});
export const pollAppExit=value=>({
    type:types.SET_POLL_EXIT,
    value
});
export const addPoll=value=>({
    type:types.ADD_POLL,
    value
});
export const removePoll=value=>({
    type:types.DEL_POLL,
    value
});
export const addPollOption=value=>({
    type:types.ADD_POLL_OPTION,
    value
});
export const editPollOption=value=>({
    type:types.EDIT_POLL_OPTION,
    value
});
export const pollAppUserLogout=value=>({
    type:types.USER_LOGOUT,
    value
}); 
export const setpollAppAuthServerData=value=>({
    type:types.LOGIN_REQUEST,
    value
});
export const pollAppAuthSucess=value=>({
    type:types.LOGIN_OK,
    value
});
export const pollAppAuthFailure=value=>({
    type:types.LOGIN_NOK,
    value
});
export const pollAppSetRegisterData=value=>({
    type:types.REGISTER_REQUEST,
    value
});
export const pollAppRegisterUserOK=value=>({
    type:types.REGISTER_OK,
    value
});
export const pollAppRegisterUserNOK=value=>({
    type:types.REGISTER_NOK,
    value
});

export const pollAppDisconnectUser=authInformation=>dispatch=>{
    authApi.userLogout(authInformation.id)
    .then(()=>{
        authApi.clearStorage();
        dispatch(pollAppUserLogout(authInformation.id));
    }).catch(err=>{
        dispatch(setPollAppError(err));
    })
};

export const pollAppRegisterServer=authData=>dispatch=>{
    dispatch(pollAppSetRegisterData(authData));
    authApi.registerUser(authData.email,authData.password)
            .then(result=>{
                // set here
                authApi.setStorageData({authToken:result.authToken,full_name:result.full_name,city:result.city,countrystate:result.countrystate,country:result.country,email:authData.email,password:authData.password});
                //
                dispatch(pollAppRegisterUserOK(result));
               
            })
            .catch(err=>{
                dispatch(pollAppRegisterUserNOK(err));
                dispatch(setPollAppError(err));
            })
};
export const pollAppaAuthenticateServer=authData=>dispatch=>{
    dispatch(setpollAppAuthServerData(authData));
    authApi.authUserLocal(authData.email,authData.password)
    .then(result=>{
        authApi.setStorageData({authToken:result.authToken,full_name:result.full_name,city:result.city,countrystate:result.countrystate,country:result.country,email:authData.email,password:authData.password});
        dispatch(pollAppAuthSucess(result));
        //uthApi.setStorageData()
        console.log('====================================');
        console.log(`auth success action result:${JSON.stringify(result,null,2)}`);
        console.log('====================================');
    })
    .catch(err=>{

        dispatch(pollAppAuthFailure(err));
        dispatch(setPollAppError(err));
        
    })
};

export const fetchPolls=()=>dispatch=>{
    dispatch(requestPollData(true));
    const dataUserStorage=JSON.parse(authApi.getStorageData());
    if (dataUserStorage){
        console.log('====================================');
        console.log(`1 data with value of :${dataUserStorage.email}`);
        console.log('====================================');
        
        dispatch(setpollAppAuthServerData({email:dataUserStorage.email,password:dataUserStorage.password}));
        dispatch(pollAppAuthSucess({authToken:dataUserStorage.authToken,full_name:dataUserStorage.full_name,city:dataUserStorage.city,country:dataUserStorage.country,countrystate:dataUserStorage.countrystate}));
    }
    PollsApi.getallPolls().then(result=>{
        dispatch(recievePollsData(result));
    }).catch(err=>{
        dispatch(recievePollsDataNOK(err));
    });
};

export const addPollFold=pollData=>dispatch=>{

};
export const removePollFold=polldata=>dispatch=>{

};
export const addPollOptionFold=polldata=>dispatch=>{

};
export const removePollOptionFold=polldata=>dispatch=>{

}