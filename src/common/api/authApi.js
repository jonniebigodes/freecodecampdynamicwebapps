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
            fetch(`https://freecodecampdynprojects.herokuapp.com/api/login/local/auth`,{
            //fetch(`http://localhost:5000/api/login/local/auth`,{
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
                console.log(`response json auth:${JSON.stringify(response)}`);
                console.log('====================================');
                return response.json();
            })
            .then(result=>{
                console.log('====================================');
                console.log(`authenticate result:${JSON.stringify(result)}`);
                console.log('====================================');
                if (result.code==='fccda002'){
                    reject(`there was a problem authenticating the user`);
                }
                resolve(result.authToken);
            })
            .catch(err=>{
                console.log('====================================');
                console.log('There has been a problem with your fetch operation: ' + err.message);
                console.log('====================================');
                   //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                   //reject(error.message)
                throw new Error(err.message);
            })
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
            fetch(`https://freecodecampdynprojects.herokuapp.com/api/login/local/signup`,{
            //fetch(`http://localhost:5000/api/login/local/signup`,{
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
            })

        });
    }
    static userLogout(){
        return new Promise((resolve,reject)=>{
            //fetch(`http://localhost:5000/api/login/logout`)
            fetch(`https://freecodecampdynprojects.herokuapp.com/api/login/logout`)
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
            })
        });
    }

}
export default  AuthApi;