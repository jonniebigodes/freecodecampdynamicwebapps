import {
    REQUEST_NIGHT,
    RECIEVE_NIGHT,
    RECIEVE_NIGHT_NOK,
    APP_ERROR,
    APP_ERROR_RESET,
    SET_LOCATION_NIGHT,
    SET_NIGHT_SEARCH,
    SET_NIGHT_NUMBER,
    SET_NIGHT_EXIT,
    LOGIN_REQUEST,
    LOGIN_OK,
    LOGIN_NOK,
    REGISTER_REQUEST,
    REGISTER_OK,
    REGISTER_NOK,
    USER_LOGOUT,
    ADD_TO_NIGHT,
    REMOVE_FROM_NIGHT,
    RECIEVE_USER_SEARCH,
    RECIEVE_YELP_TOKEN
} from '../constants/Actiontypes';
import nightApi from '../api/nightLifeApi';
import authApi from '../api/authApi';
import ChallengesApi from '../api/challengesApi';
const moment = require('moment');
export const requestNightData=value=>({
    type:REQUEST_NIGHT,
    value
});
export const recieveNightData=result=>({
    type:RECIEVE_NIGHT,
    result
});
export const recieveNightDataNOK=error=>({
    type:RECIEVE_NIGHT_NOK,
    error
});
export const setNightAppError=value=>({
    type:APP_ERROR,
    value
});
export const resetNightAppError=value=>({
    type:APP_ERROR_RESET,
    value
});

export const nightExit=value=>({
    type:SET_NIGHT_EXIT,
    value
});

export const setauthServerData=value=>({
   type:LOGIN_REQUEST,
   value
});

export const authSucess=value=>({
    type:LOGIN_OK,
    value
});
export const authFailure=value=>({
    type:LOGIN_NOK,
    value
});

export const setRegisterUserData=value=>({
    type:REGISTER_REQUEST,
    value
});
export const registerUserOK=value=>({
    type:REGISTER_OK,
    value
});
export const registerUserNOK=value=>({
    type:REGISTER_NOK,
    value
});
export const userLogout=value=>({
    type:USER_LOGOUT,
    value
});
export const addUserNight=value=>({
    type:ADD_TO_NIGHT,
    value
});

export const removeUserNight=value=>({
    type:REMOVE_FROM_NIGHT,
    value
});
export const recieveUserSearch=value=>({
    type:RECIEVE_USER_SEARCH,
    value
});
export const setYelpServiceToken=value=>({
    type:RECIEVE_YELP_TOKEN,
    value
});
export const disconnectUser=authInformation=>dispatch=>{
    
    authApi.userLogout(authInformation.id)
    .then(()=>{
        dispatch(userLogout(authInformation.id));
    })
    .catch(err=>{
        dispatch(setNightAppError(err));
    });
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
            });
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
    });
};
export const removeUserFromNight=value=>dispatch=>{
    nightApi.removeUserNight(value)
            .then(result=>{
                dispatch(removeUserNight(value));
            })
            .catch(err=>{
                dispatch(setNightAppError(err));
            });
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
    });
};
const localsetservertoken=value=>dispatch=>{
    console.log('====================================');
    console.log('local token');
    console.log('====================================');
    dispatch(setYelpServiceToken(value));
};
const fetchyelpservertoken=()=>dispatch=>{
    console.log('====================================');
    console.log('server token');
    console.log('====================================');
    nightApi.getTokenYelp().then(result=>{
        dispatch(setYelpServiceToken(result));
        ChallengesApi.setStorageData("yelp_token_info",result);
    })
    .catch(error=>{
        dispatch(setNightAppError(error));
    });
};
export const fetchAuthToken=()=>dispatch=>{
    const yelpInfo=JSON.parse(ChallengesApi.getStorageData("yelp_token_info"));
    if (!yelpInfo){
        dispatch(fetchyelpservertoken());
    }
    else{
        //let systemcurrentDate=moment().format("DD-MM-YYYY");
        //let forwardtime= moment().add(9,'days');
        
        //let tokencurrentDate=moment().unix(yelpInfo.expires).format("MM-DD HH:mm:ss");
        //let tokencurrentDate= moment().unix().format("MM-DD HH:mm:ss");
        //let dateexpiration= moment(parsedTokenDate).format("DD-MM-YYYY");
        //let datediff= moment.duration(systemcurrentDate.diff(dateexpiration,'days',true));
        //let datediff= moment(forwardtime).isSame(dateexpiration,'day');
        //let istokenlegit=moment(forwardtime).isAfter(dateexpiration);
        /* console.log('====================================');
        console.log(`System current moment:${systemcurrentDate}\nyelp expiration date:${dateexpiration} datediff :${datediff}`);
        console.log('===================================='); */
        let systemcurrentDate= moment();
        let parsedTokenDate= moment().milliseconds(yelpInfo.expires);
        let datediff= parsedTokenDate.diff(systemcurrentDate,'days');
        console.log(`date diff:${datediff} systemcurrentDate:${systemcurrentDate} parsedTokenDate:${parsedTokenDate}`);
        datediff>0?dispatch(localsetservertoken(yelpInfo)):dispatch(fetchyelpservertoken());
        

    }
    
};
const fetchUserSearches=token=>dispatch=>{
    console.log('====================================');
    console.log(`got to fetch user searches with token:${token}`);
    console.log('====================================');
    nightApi.getUserSearches(token)
    .then(result=>{
        console.log(`result fetchusersearches:${result}`);
        if (result!=='NO DATA'){
            for (let item of result){
                console.log('====================================');
                console.log(`got result:${JSON.stringify(item,null,2)}`);
                console.log('====================================');
                dispatch(recieveUserSearch(item));
            }
        }
        else{
            console.log("NO DATA FOR USER");
        }
    })
    .catch(err=>{
        dispatch(setNightAppError(err));
    });
};
const fetchDataNight=nightData=>dispatch=>{
    dispatch(requestNightData(nightData));
    
    nightApi.search(nightData)
    .then(result=>{
        dispatch(recieveNightData(result));
    })
    .catch(err=>{
        dispatch(recieveNightDataNOK(err));
    });
};

const shouldFetchData=(state,nightData)=>{
    if (!state.items){
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
