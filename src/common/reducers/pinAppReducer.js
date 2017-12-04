import{
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
    PIN_LOGIN_OK,
    PIN_USER_LOGOUT,
    PIN_SOCIAL_LOGIN_REQUEST_OK
}
from '../constants/Actiontypes';

const pinAppReducer=(state = {
    pinUserInfo:{
        id:'',
        email:'',
        name:'',
        twitter_token:'',
        twittername:'',
    },
    pinisLoggedIn: false,
    isSearching:false,
    dataEntities:{},
    result: [],
    selectedwall:{
        idwall:'',
        name:'',
        wallcreatorInfo:{
            iduser:'',
            wallcreator:''
        },
        images:[]
    },
    pinAppOnError: false,
    pinAppErrorMessage: ''
}, action)=>{
    switch(action.type){
        case PIN_SOCIAL_LOGIN_REQUEST_OK:{
            return{
                ...state,
                pinUserInfo:{
                    id:action.value.token,
                    name:action.value.full_name,
                    email:action.value.email,
                    twitter_token:action.value.twitterToken===undefined?'':action.value.twitterToken,
                    twittername:action.value.twitterusername===undefined?'':action.value.twitterusername,
                },
                pinisLoggedIn:true
            };
        }
        case REQUEST_PINS:{
            return{
                ...state,
                isSearching:true
            };
        }
        case VIEW_WALLS:{
            const dataCreatortoken= state.dataEntities.wall[action.value].creator;
            const datacreatorinfo= state.dataEntities.creator[dataCreatortoken];
            return{
                ...state,
                selectedwall:{
                    idwall:action.value,
                    name:state.dataEntities.wall[action.value].name,
                    wallcreatorInfo:{
                        iduser:datacreatorinfo.userid,
                        wallcreator:datacreatorinfo.username
                    },
                    images:state.dataEntities.wall[action.value].images
                }

            };
        }
        case VIEW_ALL_WALLS:{
            return {
                ...state,
                selectedwall:{
                    idwall:'',
                    name:'',
                    wallcreatorInfo:{
                        iduser:'',
                        wallcreator:''
                    },
                    images:[]
                }
            };
        }
        case PIN_LOGIN_OK:{
            return{
                ...state,
                votesUserInfo:{
                    id:action.value.token,
                    name:action.value.full_name,
                    email:action.value.email,
                    twitter_token:action.value.twitterToken===undefined?'':action.value.twitterToken,
                    twittername:action.value.twitterusername===undefined?'':action.value.twitterusername,
                },
                votesisLoggedin:true
            };
        }
        case ADD_PIN:{
            let tmpWallId= '';
            for (const item in state.dataEntities.wall){
                if (state.dataEntities.wall[item].creator==action.value.usertoken){
                    tmpWallId= item;
                   /*  console.log('====================================');
                    console.log(`wall:${tmpWallId}`);
                    console.log('===================================='); */
                }
            }
            let itemswall= state.dataEntities.wall[tmpWallId].images;
            itemswall.push({idimage:action.value.id,nameofimage:action.value.name,imagelink:action.value.image,numberstars:0});
          
            state.dataEntities.wall[tmpWallId]={
                ...state.dataEntities.wall[tmpWallId],
                 images:itemswall
            };
             return{
                
                 ...state

             };
        }
        case WALL_ADD:{
            let tmpEntities= state.dataEntities;
            tmpEntities.creator[action.value.user.id]={
                userid:action.value.user.id,
                username:action.value.user.name
            };
            tmpEntities.wall[action.value.wallid]={
                idwall:action.value.wallid,
                name:action.value.wallname,
                creator:action.value.user.id,
                images:action.value.images
            };
            return {
                ...state,
                result:[...state.result,action.value.wallid]
            };
        }
        case RECIEVE_PINS:{
            return{
                ...state,
                isSearching:false,
                dataEntities:action.value.entities,
                result:action.value.result
            };
        }
        case REMOVE_PIN:{
            //let votingIndex=state.items.images.findIndex(x=>x.imageid==action.value);
            const indexPin= state.dataEntities.wall[action.value.walltoken].images.findIndex(x=>x.idimage==action.value.imgtoken);
            let newImages=state.dataEntities
                    .wall[action.value.walltoken]
                    .images.slice((0,indexPin),state.dataEntities.wall[action.value.walltoken].images.slice(indexPin+1));

           state.dataEntities.wall[action.value.walltoken]={
               ...state.dataEntities.wall[action.value.walltoken],
               images:newImages
           };
           state.selectedwall.idwall==action.value.wall?state.selectedwall.images=newImages:state.selectedwall.images=[];
           return {
               ...state,
           };
        }
        
        case VOTE_PIN:{
            let itemsupdated=state.dataEntities.wall[action.value.wall].images.map(item=>{
                if (item.idimage!==action.value.image){
                    return item;
                }
                item.numberstars+=1;
                return item;
            });
            //let changedPin=state.dataEntities.wall[action.value.wall];

            state.dataEntities.wall[action.value.wall]={
               ...state.dataEntities.wall[action.value.wall],
               images:itemsupdated
           };
           state.selectedwall.idwall==action.value.wall?state.selectedwall.images=itemsupdated:state.selectedwall.images=[];
           
            return {
                ...state,
                
            };
        }
        case SET_PIN_EXIT:{
             return{
                ...state,
                pinUserInfo:{
                    id:'',
                    email:'',
                    name:'',
                    twitter_token:'',
                    twittername:'',
                    
                },
                selectedwall:{
                    idwall:'',
                    name:'',
                    wallcreatorInfo:{
                        iduser:'',
                        wallcreator:''
                    },
                    images:[]
                },
                pinisLoggedIn: false,
                isSearching:false,
                dataEntities:{},
                result: [],
                pinAppOnError: false,
                pinAppErrorMessage: ''
             };
        }
        case PIN_USER_LOGOUT:{
            return {
                ...state,
                pinUserInfo:{
                    id:'',
                    email:'',
                    name:'',
                    twitter_token:'',
                    twittername:'',
                    
                },
                pinisLoggedIn: false,
            };
            
        }
        case APP_ERROR_RESET:{
            //console.log("reducer APP_ERROR_RESET");
            return {
                ...state,
                pinAppOnError: false,
                pinAppErrorMessage: ''
            };
        }
        case APP_ERROR:{
            return {
                ...state,
                pinAppOnError: true,
                pinAppErrorMessage: action.value
            };
        }
        default:{
            return state;
        }
    }
};
export default pinAppReducer;