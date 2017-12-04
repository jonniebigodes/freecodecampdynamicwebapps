import {
    getPinslocalserver,
    getPinsexternalserver,
    votePinlocalserver,
    votePinexternalserver,
    addPinslocalserver,
    addPinsexternalserver,
    removePinlocalserver,
    removePinexternalserver
} from '../constants/ApiEndPoints';
class PinApi{
   
    static getallPins(){
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?getPinslocalserver:getPinsexternalserver)
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                /* console.log('====================================');
                console.log(`result of get all pins :${JSON.stringify(result,null,2)}`);
                console.log('===================================='); */
                result.code==='fccda005'?resolve(result.pindata):reject('Problem obtaining the polls');
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with getAll fetch operation: ' + error.reason);
                console.log('====================================');
                reject(error.reason);
            });
        });
    }
    static addPin(value){
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV!=='production'?addPinslocalserver:addPinsexternalserver,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    usertoken:value.usertoken,
                    image:value.image,
                    id:value.id,
                    name:value.name
                })
            })
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                if(result.code==='fccda005'){
                    result.reason==='wall_added'?resolve({wallcreated:true,walldata:result.options}):resolve({wallcreated:false,walldata:{}});
                }
                else{
                    reject(result.reason);
                }
                
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with addPin fetch operation: ' + error.reason);
                console.log('====================================');
                reject(error.reason);
            });
        });
    }
    static removePin(value){
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV !== 'production'?removePinlocalserver:removePinexternalserver,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    walltoken:value.walltoken,
                    imgtoken:value.imgtoken
                })

            })
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                result.code==='fccda005'?resolve(true):reject('Could not remove the image.\nTry again later');
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with getAll fetch operation: ' + error.reason);
                console.log('====================================');
                reject(error.reason);
            });
        });
    }
    static voteOnPin(value){
        return new Promise((resolve,reject)=>{
            fetch(process.env.NODE_ENV!=='production'?votePinlocalserver:votePinexternalserver,{
                method:'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    imgtoken:value
                })
            })
            .then(response=>{
                return response.json();
            })
            .then(result=>{
                result.code==='fccda005'?resolve(true):reject(result.reason);
            })
            .catch(error=>{
                console.log('====================================');
                console.log('There has been a problem with getAll fetch operation: ' + error.reason);
                console.log('====================================');
                reject(error.reason);
            });
        });
    }
}
export default PinApi;