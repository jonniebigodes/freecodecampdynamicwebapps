import {
    getPollsLocal,
    getPollsExternal,
    createPollLocal,
    createPollExternal,
    votePollLocal,
    votePollExternal,
    removePollLocal,
    removePollExternal,
    addPollOptionLocal,
    addPollOptionExternal,
    sharePollLocal,
    sharePollExternal
} from '../constants/ApiEndPoints';

/**
 * class containing the api for the polls challenge
 */
class PollsApi{
    /**
     * method to get all the polls in the system
     * @returns {Promise} the result of the server request
     */
    static getallPolls(){
        return new Promise((resolve,reject)=>{
            
            fetch(process.env.NODE_ENV !== 'production'?getPollsLocal:getPollsExternal)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                result.code==='fccda005'?resolve(result.polldata):reject('Problem obtaining the polls');
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with getAll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            });
        });
    }
    /**
     * method to inject the poll
     * @param {Object} value object containing the information about the poll
     * @returns {Promise} the result of the operation 
     */
    static createPoll(value){
        
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?createPollLocal:createPollExternal,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({
                        usertoken:value.pollcreator.userid,
                        pollname:value.pollname,
                        polldataoptions:value.polloptions
                    })
                
            }).then(response=>{
                return response.json();
            }).then(result=>{
                result.code==='fccda001'?reject(`error creating poll:${result.reason}`):resolve(result.token);
            }).catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with createPoll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            });
        });
    }
    /**
     * method to cast votes on poll
     *  @param {string} value  contains the poll option id
     * @returns {Promise} the result of the operation
     */
    static votePoll(value){
        /* console.log('====================================');
        console.log(`api voteon poll data:${JSON.stringify(value,null,2)}`);
        console.log('===================================='); */
        //return;
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?votePollLocal:votePollExternal,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({polltoken:value})
            }).then(response=>{
                return response.json();
            }).then(result=>{
                
                result.code==='fccda001'?reject(`error voting on poll:${result.reason}`):resolve(true);
            }).catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with votePoll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            });
        });
    }
    /**
     * method to remove poll
     * @param {string} value poll token to remove
     * @returns {Promise} the result of the operation
     */
    static deletePoll(value){
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?removePollLocal:removePollExternal,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({
                        polltoken:value
                    })
                
            }).then(response=>{
                return response.json();
            }).then(result=>{
                result.code=='fccda001'?reject(`There was an error deleting the poll:${result.reason}`):resolve(true);
                
            }).catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with deletePoll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error);
            });
        });
    }
    /**
     * method to inject a poll option to a existing poll
     * @param {Object} value containing the info about the poll option to be added
     * @returns {Promise} the result of the operation 
     */
    static injectPollOption(value){
        
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?addPollOptionLocal:addPollOptionExternal,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(
                        {
                            polltoken:value.pollid,
                            polloptiontoken:value.poll_option_id,
                            optionname:value.poll_option_name
                        }
                    )
            }).then(response=>{
                return response.json();
            }).then(result=>{
                result.code==='fccda001'?reject(`There was an error adding the option to the poll:${result.reason}`):resolve(true);
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with injectPollOption fetch operation: ' + error.message);
                console.log('====================================');
                reject(error);
            });
        });
    }
    /**
     * method to share to social networks(only twitter so far)
     * @param {Object} value containing the poll token and user token
     * @returns {Promise} result of the operation
     */
    static shareSocialPoll(value){
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?sharePollLocal:sharePollExternal,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({
                        tokenpoll:value.pollToken,
                        authtoken:value.usertoken
                    })
                
            }).then(response=>{
                return response.json();
            })
            .then(result=>{
                result.code==='fccda001'?reject(`Error sharing the poll:${result.reason}`):resolve(true);
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with shareSocialPoll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error);
            });
        });
    }
}
export default PollsApi;