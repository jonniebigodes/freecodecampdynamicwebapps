(function(){
    let mongoClient= require('mongodb').MongoClient;
    let mongoInstance;

    module.exports={
        connect:function(dbLocation,callback){
            mongoClient.connect(dbLocation,function(err,db){
                mongoInstance= db;
                if (callback){return callback();}
            });
        },
        disconnect:function(){
            mongoInstance.close();

        },
        getInstance:function(){
            return mongoInstance;
        },
        insertOneItem:function(valueCollection,valueItem){
            try{

            }
            catch(err){
                console.log("Error insertOneItem\n"+err);
            }
        },
        insertMultipleItems:function(valueCollection,valueItem){
            try {
                
                
            } catch (error) {
                console.log("Error insertMultipleItems:\n"+err);
            }
        }

    }
})();