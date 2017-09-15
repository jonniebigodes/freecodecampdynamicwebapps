import * as types from '../constants/Actiontypes';
import nightApi from '../api/nightLifeApi';
import authApi from '../api/authApi';


export const requestNightData=value=>({
    type:types.REQUEST_NIGHT,
    value
});
export const recieveNightData=result=>({
    type:types.RECIEVE_NIGHT,
    result
});
export const recieveNightDataNOK=error=>({
    type:types.RECIEVE_NIGHT_NOK,
    error
});
export const setNightAppError=value=>({
    type:types.APP_ERROR,
    value
});
export const resetNightAppError=value=>({
    type:types.APP_ERROR_RESET,
    value
});
export const setLocationNight=valueLocation=>({
    type:types.SET_LOCATION_NIGHT,
    valueLocation
});
export const setNightQuery=valueQuery=>({
    type:types.SET_NIGHT_SEARCH,
    valueQuery
})
export const setNumberItems=valueNumber=>({
    type:types.SET_NIGHT_NUMBER,
    valueNumber
});
export const nightExit=value=>({
    type:types.SET_NIGHT_EXIT,
    value
});

export const setauthServerData=value=>({
   type:types.LOGIN_REQUEST,
   value
});

export const authSucess=value=>({
    type:types.LOGIN_OK,
    value
});
export const authFailure=value=>({
    type:types.LOGIN_NOK,
    value
});

export const setRegisterUserData=value=>({
    type:types.REGISTER_REQUEST,
    value
});
export const registerUserOK=value=>({
    type:types.REGISTER_OK,
    value
});
export const registerUserNOK=value=>({
    type:types.REGISTER_NOK,
    value
});
export const userLogout=value=>({
    type:types.USER_LOGOUT,
    value
});
export const addUserNight=value=>({
    type:types.ADD_TO_NIGHT,
    value
});

export const removeUserNight=value=>({
    type:types.REMOVE_FROM_NIGHT,
    value
});
export const recieveUserSearch=value=>({
    type:types.RECIEVE_USER_SEARCH,
    value
})
export const disconnectUser=authInformation=>dispatch=>{
    
    authApi.userLogout(authInformation.id)
    .then(result=>{
        dispatch(userLogout(authInformation.id));
    })
    .catch(err=>{
        dispatch(setNightAppError(err));
    })
};
export const registerServer=authData=>dispatch=>{
    dispatch(setRegisterUserData(authData));
    authApi.registerUser(authData.email,authData.password)
            .then(result=>{
                dispatch(registerUserOK(result));
            })
            .catch(err=>{
                dispatch(registerUserNOK(err));
                dispatch(setNightAppError(err));
            })
};

export const addUserToNight=value=>dispatch=>{
    console.log('====================================');
    console.log(`adding to night action: user:${value.userToken} place:${value.idPlace}`);
    console.log('====================================');
    nightApi.addUserNight(value)
    .then(result=>{
        dispatch(addUserNight(value));
    })
    .catch(err=>{
        dispatch(setNightAppError(err));
    })
};


export const removeUserFromNight=value=>dispatch=>{
    nightApi.removeUserNight(value)
            .then(result=>{
                dispatch(removeUserNight(value));
            })
            .catch(err=>{
                dispatch(setNightAppError(err));
            })
};
export const authenticateServer=authData=>dispatch=>{
    dispatch(setauthServerData(authData));
    authApi.authUserLocal(authData.email,authData.password)
    .then(result=>{
        dispatch(authSucess(result));
        console.log('====================================');
        console.log(`auth success action result:${result}`);
        console.log('====================================');
        dispatch(fetchUserSearches(result));
    })
    .catch(err=>{
        dispatch(authFailure(err));
        dispatch(setNightAppError(err));
    })
};
const fetchUserSearches=token=>dispatch=>{
    console.log('====================================');
    console.log(`got to fetch user searches with token:${token}`);
    console.log('====================================');
    nightApi.getUserSearches(token)
    .then(result=>{
        console.log(`result fetchusersearches:${result}`);
        if(result==="NO DATA"){
            console.log("NO DATA FOR USER");
        }
        else{
            for (let item of result){
                console.log('====================================');
                console.log(`got result:${JSON.stringify(item,null,2)}`);
                console.log('====================================');
                dispatch(recieveUserSearch(item));
            }
        }
    })
    .catch(err=>{
        dispatch(setNightAppError(err));
    })
};
const fetchDataNight=nightData=>dispatch=>{
    dispatch(requestNightData(nightData));
    
    nightApi.search(nightData.query, nightData.where,nightData.who,nightData.howMany)
    .then(result=>{
        dispatch(recieveNightData(result));
    })
    .catch(err=>{
        dispatch(recieveNightDataNOK(err));
    })
};

const shouldFetchData=(state,nightData)=>{
    if (!state.items){
        console.log("no items");
        return true;
    }
    const items= state.items[nightData.query+"-"+nightData.where];
    if (!items){
        return true;
    }
    return false;
};
export const fetchNightDataIfNeeded=nightData=>(dispatch,getState)=>{
    if (shouldFetchData(getState(),nightData)){
        return dispatch(fetchDataNight(nightData));
    }
};
