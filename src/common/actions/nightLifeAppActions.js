import {
    REQUEST_NIGHT,
    RECIEVE_NIGHT,
    RECIEVE_NIGHT_NOK,
    NIGHT_ERROR,
    RESET_NIGHT_ERROR,
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
//const moment = require('moment');
import {fccUtilities} from '../Utils/Utilities';
import {normalize} from 'normalizr';
import {NightsSchema} from '../constants/nightsSchema';
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
    type:NIGHT_ERROR,
    value
});
export const resetNightAppError=()=>({
    type:RESET_NIGHT_ERROR
});

export const nightExit=()=>({
    type:SET_NIGHT_EXIT
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
export const disconnectUser=()=>dispatch=>{
    
    authApi.userLogout()
    .then(()=>{
        dispatch(userLogout());
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
        dispatch(authSucess(result.authToken));
       
        dispatch(fetchUserSearches(result.authToken));
    })
    .catch(err=>{
        dispatch(authFailure(err));
        dispatch(setNightAppError(err));
    });
};
const localsetservertoken=value=>dispatch=>{
    
    dispatch(setYelpServiceToken(value));
};
const fetchyelpservertoken=()=>dispatch=>{
    
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

        // console.log('====================================');
        // console.log(`data from utils${fccUtilities.calculateTokenTime(yelpInfo.expires)}`);
        // console.log('====================================');
        // let systemcurrentDate= moment();
        // let parsedTokenDate= moment().milliseconds(yelpInfo.expires);
        //let datediff= parsedTokenDate.diff(systemcurrentDate,'days');
        let datediff= fccUtilities.calculateTokenTime(yelpInfo.expires);
        //console.log(`date diff:${datediff} systemcurrentDate:${systemcurrentDate} parsedTokenDate:${parsedTokenDate}`);
        datediff>0?dispatch(localsetservertoken(yelpInfo)):dispatch(fetchyelpservertoken());
    }
    
};
const fetchUserSearches=token=>dispatch=>{
    // console.log('====================================');
    // console.log(`got to fetch user searches with token:${JSON.stringify(token,null,2)}`);
    // console.log('====================================');
    nightApi.getUserSearches(token)
    .then(result=>{
       
        if (result!=='NO_DATA'){
            const userSearchesNormalized= normalize(result,NightsSchema.dataNights);
            dispatch(recieveUserSearch(userSearchesNormalized));
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
        // console.log('====================================');
        // console.log(`result fetch night data:\n${JSON.stringify(result,null,2)}`);
        // console.log('====================================');
        const dataNormalized= normalize(result.results,NightsSchema.dataNights);
       
        dispatch(recieveNightData(dataNormalized));
    
    })
    .catch(err=>{
        dispatch(recieveNightDataNOK(err));
    });
};

const shouldFetchData=(state,nightData)=>{
    const nightsData= state.night;
    if (!nightsData.searchResults.length){
        return true;
    }

    for (const item in nightsData.searchResultsEntities){
        const queryItem= nightsData.searchResultsEntities[item].infoquery;
        if ((queryItem.what===nightData.query)&&(queryItem.where===nightData.where)){
            return false;
        }
    }
    return true;
};
export const fetchNightDataIfNeeded=nightData=>(dispatch,getState)=>{
    if (shouldFetchData(getState(),nightData)){
        return dispatch(fetchDataNight(nightData));
    }
};
