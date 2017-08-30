import * as types from '../constants/Actiontypes';
import nightApi from '../api/nightLifeApi';
import authApi from '../api/authApi';


export const requestNightData=value=>({
    type:types.REQUEST_NIGHT,
    value
})
export const recieveNightData=result=>({
    type:types.RECIEVE_NIGHT,
    result
})
export const recieveNightDataNOK=error=>({
    type:types.RECIEVE_NIGHT_NOK,
    error
})
export const setNightAppError=value=>({
    type:types.APP_ERROR,
    value
})
export const resetNightAppError=value=>({
    type:types.APP_ERROR_RESET,
    value
})
export const setLocationNight=valueLocation=>({
    type:types.SET_LOCATION_NIGHT,
    valueLocation
})
export const setNightQuery=valueQuery=>({
    type:types.SET_NIGHT_SEARCH,
    valueQuery
})
export const setNumberItems=valueNumber=>({
    type:types.SET_NIGHT_NUMBER,
    valueNumber
})
export const nightExit=value=>({
    type:types.SET_NIGHT_EXIT,
    value
})
const fetchDataNight=nightData=>dispatch=>{
    dispatch(requestNightData(nightData));
    
    nightApi.search(nightData.query, nightData.where,nightData.who,nightData.howMany)
    .then(result=>{
        dispatch(recieveNightData(result));
    })
    .catch(err=>{
        dispatch(recieveNightDataNOK(err));
    })
}

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
}
export const fetchNightDataIfNeeded=nightData=>(dispatch,getState)=>{
    if (shouldFetchData(getState(),nightData)){
        return dispatch(fetchDataNight(nightData));
    }
}
