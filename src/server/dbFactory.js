//to be refactored into proper factory pattern
/**
 * module to handle the db logc for the challenges
 */

(function(){
    // variables to contain the information of the import and the dbobject instance
    var client= require('mongodb').MongoClient,mongoInstance;
    

    module.exports={
        /**
         * function to connect to the mongo db instance
         * @param dburl connection string
         * @param callback callback to be activated whenn the connection is done/error
         */
        connect:function(dbUrl,callback){
            client.connect(dbUrl,function(err,db){
                mongoInstance= db;
                if (callback){return callback();}
            });
        },
        /**
         * getter function for the object containing db instance
         */
        getInstance:function(){
            return mongoInstance;
        },
        /**
         * function to cloose the the connection to the db
         */
        close:function(){
            mongoInstance.close();
        },
       countRecords:function(valueItem,callback){
           try {
               module.exports.getInstance().collection(valueItem.collection).find().count(function(err,data){
                   if (err){
                       callback(err,null);
                   }
                   callback(null,data);
               });
               
           } catch (error) {
            console.log("erro dbfactory:\searchById"+ err);
            callback(err,null);   
           }
       },
       insertDocument:function(valueItem,callback){
           try {
               if (valueItem.numRecords>1){
                   module.exports.getInstance().collection(valueItem.collection).insertMany(valueItem.records,function(err,data){
                       if (err){
                           callback(err,null);
                       }

                   });
               }
               else{
                   module.exports.getInstance().collection(valueItem.collection).insert(valueItem.record,function(err,data){
                       if (err){
                           callback(err,null);
                        }

                    });
               }
               
               
           } catch (error) {
               console.log("erro dbfactory:\ninsertDocument"+ err);
               callback(err,null);
           }
       }
        

    }
})();