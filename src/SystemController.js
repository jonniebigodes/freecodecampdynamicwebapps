import * as mongodbFactory from './dbFactory';
/**
 * module to act as a system wide "controller" to hide the access to the db factory and http service
 */
(function(){
    module.exports={
        getUserInformation:function(){

        },
        setUserInformation:function(value){

        },
        connectDb:function(value,callback){
            mongodbFactory.connect(value,function(callback){
                callback();
            });
        },
        disconnectDb:function(value){
            mongodbFactory.disconnect();
        },
        createPollDb:function(value,callback){
            
        },
        createPollDbDetails:function(value,callback){

        }
    }
})();