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
export const setnightAppError=value=>({
    type:types.APP_ERROR,
    value
})
export const resetnightAppError=value=>({
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


const fetchDataNight=nightData=>dispatch=>{
    dispatch(requestNightData(nightData));
    nightApi.search(nightData.query, nightData.where)
    .then(result=>{
        dispatch(recieveNightData(result));
    })
    .catch(err=>{
        dispatch(recieveNightDataNOK(err));
    })
}

const shouldFetchData=(state,nightData)=>{
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
const shouldLogin=(state,userInfo)=>{
    console.log('====================================');
    console.log(`isloggedin:${state.isLoggedin}`);
    console.log('====================================');

}
export const loginIfNeeded=userInfo=>(dispatch,getState)=>{
    console.log('====================================');
    console.log(shouldLogin(getState(),userInfo));
    console.log('====================================');
}