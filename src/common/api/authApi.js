class AuthApi{
    /**
     * function to handle the authentication request to the server
     * @param {String} valueMail email provided for authentication
     * @param {String} valuePass password provided for authentication
     * @returns {Promise} sucess or fail of the request
     */
    static authUserLocal(valueMail,valuePass){
        console.log('====================================');
        console.log(`authUserLocal email:${valueMail} password:${valuePass}`);
        console.log('====================================');
        return new Promise((resolve,reject)=>{
            //fetch(`https://freecodecampdynprojects.herokuapp.com/api/login/local/auth`,{
            fetch(`http://localhost:5000/api/login/local/auth`,{
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
                   //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                   //reject(error.message)
                throw new Error(err.message);
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
            // fetch(`https://freecodecampdynprojects.herokuapp.com/api/login/local/signup`,{
            fetch(`http://localhost:5000/api/login/local/signup`,{
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
                console.log('====================================');
                console.log(`response json reg:${JSON.stringify(response)}`);
                console.log('====================================');
                return response.json();
            })
            .then(result=>{
                console.log('====================================');
                console.log(`register result:${JSON.stringify(result)}`);
                console.log('====================================');
                resolve(result.authToken);
            })
            .catch(err=>{
                console.log('====================================');
                console.log('There has been a problem with your fetch operation: ' + err.message);
                console.log('====================================');
                   //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                   //reject(error.message)
                throw new Error(err.message);
            });

        });
    }
    static userLogout(){
        return new Promise((resolve,reject)=>{
            fetch(`http://localhost:5000/api/login/logout`)
            //fetch(`https://freecodecampdynprojects.herokuapp.com/api/login/logout`)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                console.log('====================================');
                console.log(`result logout:${JSON.stringify(result)}`);
                console.log('====================================');
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
            fetch(`http://localhost:5000/api/login/local/authdatachange`,{
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
            fetch('http://localhost:5000/api/login/social/getuserinfo',{
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
                console.log(`data from response:${JSON.stringify(response,null,2)}`);
                return response.json();
            }).then(result=>{
                console.log(`data from result:${JSON.stringify(result,null,2)}`);
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