import {localUserAuth,
    externalUserAuth,
    localRegisterUser,
    externalRegisterUser,
    localUserLogout,
    externalUserLogout,
    localUserChangeInfo,
    externalUserChangeInfo,
    localGetSocialInfo,
    externalGetSocialInfo
} from '../constants/ApiEndPoints';
class AuthApi{
    /**
     * function to handle the authentication request to the server
     * @param {String} valueMail email provided for authentication
     * @param {String} valuePass password provided for authentication
     * @returns {Promise} sucess or fail of the request
     */
    static authUserLocal(valueMail,valuePass){
       
        return new Promise((resolve,reject)=>{
            
            fetch(process.env.NODE_ENV !== 'production'?localUserAuth:externalUserAuth,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials:'same-origin',
                body:JSON.stringify({
                    username:valueMail,
                    password:valuePass
                })
            })
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                if (result.code==='fccda001'){
                    reject(`there was a problem authenticating the user.\nThe credentials provided are not correct!`);
                }
                resolve(result);
            })
            .catch(err=>{
                console.log('====================================');
                console.log('There has been a problem with your fetch operation: ' + err.message);
                console.log('====================================');
                reject(err.message);
                   //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                   //reject(error.message)
                //throw new Error(err.message);
            });
        });
    
    }
    /**
     * function to handle the registration request to the server
     * @param {String} valueMail mail provided for authentication
     * @param {String} valuePass password provided for authentication
     * @returns {Promise} with sucess or failure of the request
     */
    static registerUser(valueMail,valuePass){
        return new Promise((resolve,reject)=>{
           
            fetch(process.env.NODE_ENV !== 'production'?localRegisterUser:externalRegisterUser,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials:'same-origin',
                body:JSON.stringify({
                    username:valueMail,
                    password:valuePass
                })
            })
            .then(response=>{
                
                return response.json();
            })
            .then(result=>{
                
                resolve(result.authToken);
            })
            .catch(err=>{
                console.log('====================================');
                console.log('There has been a problem with your fetch operation: ' + err.message);
                console.log('====================================');
                   //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                reject(err.message)
                //throw new Error(err.message);
            });

        });
    }
    static userLogout(){
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?localUserLogout:externalUserLogout)
            
            .then(response=>{
                return response.json();
            })
            .then(()=>{
                
                resolve(true);
            })
            .catch(err=>{
                console.log('====================================');
                console.log('There has been a problem with your fetch operation: ' + err.message);
                console.log('====================================');
                reject(err.message);
            });
        });
    }
    static changeUserInformation(value){
        return new Promise((resolve,reject)=>{
            //fetch('https://freecodecampdynprojects.herokuapp.com/api/login/local/authdatachange',{
            fetch(process.env.NODE_ENV !== 'production'?localUserChangeInfo:externalUserChangeInfo,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(value)
            })
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                if (result.code==='fccda001'){
                    reject(`Something went wrong with the update of your information`);
                }
                else{
                    resolve(true);
                }
            })
            .catch(err=>{
                console.log('====================================');
                console.log('There has been a problem with your fetch operation: ' + err.message);
                console.log('====================================');
                reject(err.message);
            });
        });
    }
    static getSocialInfo(value){
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?localGetSocialInfo:externalGetSocialInfo,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    authToken:value
                })
            })
            .then(response=>{
                return response.json();
            }).then(result=>{
                
                result.code=='fccda005'?resolve(result.data):reject('NO USER INFO FOUND');
            }).catch(errorFB=>{
                console.log('====================================');
                console.log('There has been a problem with your fetch operation: ' + errorFB);
                console.log('====================================');
                reject(errorFB);
            });
        });
    }

}
export default AuthApi;