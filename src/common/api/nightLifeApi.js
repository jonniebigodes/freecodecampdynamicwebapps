
class nightApi{
    /**
     * function to call the api on the server and get the results
     * @param {string} query what to search
     * @param {string} location where to search
     * @param {string} userID who searches 
     * @param {number} numberItems how may items to be searched
     */
    static search(value){
        return new Promise((resolve,reject)=>{
            console.log('====================================');
            console.log(`data query:${JSON.stringify(value,null,2)}`);
            console.log('====================================');
             //fetch(`https://freecodecampdynprojects.herokuapp.com/api/data/nightsearch`) 
            fetch(`http://localhost:5000/api/data/nightsearch`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    tokenyelp:value.token,
                    what:value.query,
                    where:value.where,
                    ammount:value.howMany,
                    userId:value.who
                })
            })
            .then(response=>{
                   //console.log("getStock status: " +response.status);
                   return response.json();
               })
            .then(result=>{
                   //console.log("result: " + JSON.stringify(result));
                   //return result;
                   if (result.code==='fccda001'){
                       //console.log("there was an error");
                       reject(result.reason);
                   }
                   resolve(result.dataRecieved);
                   
               })
            .catch(error=>{
                   console.log('====================================');
                   console.log('There has been a problem with your fetch operation: ' + error.message);
                   console.log('====================================');
                   //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                   //reject(error.message)
                   throw new Error(error.message);
            });
        });
        
    }

    /**
     * function to add the user from the night event
     * @param {object} value containing user token and id of bar to go
     * @returns {Promise} with the sucess or fail of the remote operation
     */
    static addUserNight(value){
        return new Promise((resolve,reject)=>{
            
            //fetch(`https://freecodecampdynprojects.herokuapp.com/api/data/nightadd`,{
            fetch(`http://localhost:5000/api/data/nightadd`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials:'same-origin',
                body:JSON.stringify({
                    userToken:value.userToken,
                    location:value.idPlace
                })
            })
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                result.code==='fccda001'?reject(result.reason):resolve(true);
                
            })
            .catch(err=>{
                reject(err.message);
            })
        });
    }
    /**
     * function to remove the user from the night event
     * @param {object} value containing user token and id of bar to go
     * @returns {Promise} with the sucess or fail of the remote operation
     */
    static removeUserNight(value){
        return new Promise((resolve,reject)=>{
            //fetch(`https://freecodecampdynprojects.herokuapp.com/api/data/nightremove`,{
            fetch(`http://localhost:5000/api/data/nightremove`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials:'same-origin',
                body:JSON.stringify({
                    userToken:value.userToken,
                    location:value.idPlace
                })
            })
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                result.code==='fccda001'?reject(result.reason):resolve(true);
            })
            .catch(err=>{
                reject(err.message);
            })
        });
    }
    /**
     * 
     * @param {String} userToken user auth token provided by the system when logs or registers
     * @returns {Promise} with the result or fail of the operation
     */
    static getUserSearches(userToken){
        return new Promise((resolve,reject)=>{
            //fetch(`https://freecodecampdynprojects.herokuapp.com/api/data/usersearches?who=${userToken}`)
            fetch(`http://localhost:5000/api/data/usersearches?who=${userToken}`)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                console.log('====================================');
                console.log(`result data: ${JSON.stringify(result)}`);
                console.log('====================================');
                result.code==='fccda001'?reject(result.reason):resolve(result.userData);
                
            })
            .catch(err=>{
                console.log('====================================');
                console.log(`error getting the user searches:${err.reason}`);
                console.log('====================================');
                reject(err);
            })
        });
    }
    static getTokenYelp(){
        return new Promise((resolve,reject)=>{
            //fetch(`https://freecodecampdynprojects.herokuapp.com/api/data/nighttoken`)
            fetch(`http://localhost:5000/api/data/nighttoken`)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
               
                resolve (result.userToken);
            })
            .catch(err=>{
                console.log('====================================');
                console.log(`error getting the user searches:${err.reason}`);
                console.log('====================================');
                reject(err);
            })
        });
    }
}
export default nightApi;