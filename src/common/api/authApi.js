class AuthApi{
    static authUser(valueMail,valuePass){
        return new Promise((resolve,reject)=>{

            fetch(`http://localhost:5000/login/twitter`,{
                method:'post',
                body:JSON.stringify({
                    email:valueMail,
                    pass:valuePass
                })
            })
            .then(result=>{
                resolve(result);
            }).catch(err=>{
                console.log('====================================');
                console.log('There has been a problem with your fetch operation: ' + error.message);
                console.log('====================================');
                   //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                   //reject(error.message)
                throw new Error(error.message);
            })
        });
    
    }

}
export default  AuthApi;