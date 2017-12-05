import {
    APP_ERROR,
    APP_ERROR_RESET, 
    REQUEST_PINS,
    RECIEVE_PINS,
    ADD_PIN,
    WALL_ADD,
    REMOVE_PIN,
    VIEW_WALLS,
    VIEW_ALL_WALLS,
    VOTE_PIN,
    SET_PIN_EXIT,
    PIN_SOCIAL_LOGIN_REQUEST_OK,
    PIN_USER_LOGOUT
} from '../constants/Actiontypes';
import authApi from '../api/authApi';
import ChallengesApi from '../api/challengesApi';
import PinApi from '../api/pinsApi';
import {normalize} from 'normalizr';
import {PinSchemas} from '../constants/pinsSchema';

export const requestPins=()=>({
    type:REQUEST_PINS
});
export const recievePinsData=value=>({
    type:RECIEVE_PINS,
    value
});
export const exitPinApp=()=>({
    type:SET_PIN_EXIT
});
export const setPinAppError=value=>({
    type:APP_ERROR,
    value
});
export const resetPinAppError=()=>({
    type:APP_ERROR_RESET
});
export const createWall=value=>({
    type:WALL_ADD,
    value
});
export const addPin=value=>({
    type:ADD_PIN,
    value
});
export const delPin=value=>({
    type:REMOVE_PIN,
    value
});
export const pinVote=value=>({
    type:VOTE_PIN,
    value
});
export const viewUserWalls=value=>({
    type:VIEW_WALLS,
    value
});
export const viewAllUserWAlls=()=>({
    type:VIEW_ALL_WALLS
});
export const pinSocialLoginOK=(value)=>({
    type:PIN_SOCIAL_LOGIN_REQUEST_OK,
    value
});
export const pinDisconnectUser=()=>({
    type:PIN_USER_LOGOUT
});
export const fetchPinSocialInfo=value=>dispatch=>{
    authApi.getSocialInfo(value)
    .then(result=>{
        ChallengesApi.setStorageData("pins_socialInfo",
            {
                authToken:value,
                full_name:result.name,
                email:result.email,
                islocal:false,
                twitterToken:result.twitterToken,
                twitterName:result.twitterusername,
            }
        );
        dispatch(pinSocialLoginOK({token:value,full_name:result.name,twitterToken:result.twitterToken,email:result.email}));
    })
    .catch(error=>{
        dispatch(setPinAppError(error));
    });
};

export const pinAppDisconnect=()=>dispatch=>{
    authApi.userLogout()
        .then(()=>{
            ChallengesApi.clearStorage();
            dispatch(pinDisconnectUser());
        }).catch(error=>{
            dispatch(setPinAppError(error));
        });
};
export const setDummyLoginData=()=>dispatch=>{
    dispatch(pinSocialLoginOK({token:'59b3ece0d0341622f08d9d8e',full_name:'paxa.brutal@gmail.com',twitterToken:'41643250-fL5thF5gFY6zHY3zvUMrgLBv90KGTeymN6F5Fd1wp',email:'paxa.brutal@gmail.com'}));
};

export const fetchPinsData=()=>dispatch=>{
   /*  console.log('====================================');
    console.log("got to actions");
    console.log('===================================='); */
    dispatch(requestPins());
    const pinUserData= JSON.parse(ChallengesApi.getStorageData('pins_socialInfo'));
    if (pinUserData){
        dispatch(pinSocialLoginOK({token:pinUserData.authToken,full_name:pinUserData.full_name,twitterToken:pinUserData.twitterToken,email:pinUserData.email}));
    }
    PinApi.getallPins().then(result=>{
        const normdata= normalize(result,PinSchemas.dataWalls);
        setTimeout(() => {
            
            dispatch(recievePinsData(normdata));
        }, 3000);
    }).catch(error=>{
        dispatch(setPinAppError(error));
    });
};
export const viewSelectedWall=value=>dispatch=>{
    dispatch(viewUserWalls(value));
};
const getuserInfo=(state,userToken)=>{
    const userInformation= state.pins.pinUserInfo;
    if (userInformation.id==''){
        return undefined;
    }
    if (userInformation.id===userToken){
        return userInformation;
    }
    else{
        return undefined;
    }
    
};
export const addPinToWall=value=>(dispatch,getState)=>{
    
    PinApi.addPin(value)
    .then(result=>{
        if (result.wallcreated){
            const appUserData= getuserInfo(getState(),value.usertoken);
            dispatch(createWall(
                {
                    wallid:result.walldata.wallid,
                    user:{
                        id:appUserData.id,
                        name:appUserData.name?appUserData.name:appUserData.email
                    },
                    wallname:result.walldata.wallname,
                    images:[
                        {
                            idimage: value.id,
                            nameofimage: value.name,
                            imagelink: value.image,
                            numberstars: 0

                        }
                    ]
                }
            ));
        }
        else{
            dispatch(addPin(value));
        }
    }).catch(error=>{
        dispatch(setPinAppError(error));
    });
};
export const removePinfromWall=value=>dispatch=>{

    PinApi.removePin(value)
    .then(result=>{
        dispatch(delPin(value));
    })
    .catch(error=>{
        dispatch(setPinAppError(error));
    });
};
export const voteOnPin=value=>dispatch=>{
    //dispatch(pinVote(value));
    PinApi.voteOnPin(value.image)
    .then(()=>{
        dispatch(pinVote(value));
    })
    .catch(error=>{
        dispatch(setPinAppError(error));
    });
};

export const disconnectPinApp=()=>dispatch=>{
    dispatch(exitPinApp());
};