class PollsApi{
    static getallPolls(){
        return new Promise((resolve,reject)=>{
            fetch(`http://localhost:5000/api/data/getpolls`)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                resolve(result.polldata);
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with getAll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            })
        });
    }
    static createPoll(value){
        return new Promise((resolve,reject)=>{
            fetch(`http://localhost:5000/api/data/createpoll`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(value)
                
            }).then(response=>{
                return response.json();
            }).then(result=>{
                result.code==='fccda001'?reject(`error creating poll:${result.reason}`):resolve(true);
            }).catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with createPoll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            })
        })
    }
    static votePoll(value){
        return new Promise((resolve,reject)=>{
            fetch(`http://localhost:5000/api/data/pollvote`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(value)
            }).then(response=>{
                return response.json();
            }).then(result=>{
                result.code==='fccda001'?reject(`error voting on poll:${result.reason}`):resolve(true);
            }).catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with votePoll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error.message);
            })
        })
    }
    static deletePoll(value){
        return new Promise((resolve,reject)=>{
            fetch(`http://localhost:5000/api/data/delpoll`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(value)
                
            }).then(response=>{
                return response.json();
            }).then(result=>{
                result.code==='fccda001'?reject(`There was an error deleting the poll:${result.reason}`):resolve(true);
                
            }).catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with deletePoll fetch operation: ' + error.message);
                console.log('====================================');
                reject(error);
            })
        })
    }
    static injectPollOption(value){
        return new Promise((resolve,reject)=>{
            fetch(`http://localhost:5000/api/data/addpolloption`,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(value)
            }).then(response=>{
                return response.json();
            }).then(result=>{
                result.code==='fccda001'?reject(`There was an error adding the option to the poll:${result.reason}`):resolve(true);
            })
        });
    }
}
export default PollsApi;