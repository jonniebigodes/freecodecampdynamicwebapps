//to be refactored into proper factory pattern
/**
 * module to handle the db logc for the challenges
 
*/
import * as dbClient from 'mongodb';
import * as cryptoModule from 'bcrypt-nodejs';
let urlServer = '';
let dbInstance = {};
export const setUrl = value => {
    urlServer = value;
};
export const getUrl = () => {
    return urlServer;
};
export const isConnected=()=>{
    return dbInstance===undefined;
};
/**
 * aux function to compare the passwords to check if they match
 * @param {String} valueclient password sent from the client
 * @param {String} valueDb hashed version of the password stored in the db
 */
export const comparePassword=(valueclient,valueDb)=>{
    let pwdCompare= cryptoModule.compareSync(valueclient,valueDb);
    if (pwdCompare){
            //resolve("");
        return "PWD_OK";
    }
    else{
        return 'PWD_NOK';
    }
};

/**
 * es6 fat arrow function exported and exposed to connect to the db
 */

export const connect = () => {
    
    return new Promise((resolve, reject) => {
        if (urlServer===''){
            reject(`Error on connect: no connection string was provided`);
        }
         dbClient.MongoClient.connect(urlServer, (err, db) => {
            if (err) reject(`Error on connect: ${err.code} \nstatus message:${err.message}`);
            dbInstance = db;
            resolve(true);
        });

    });
};


/**
 * es6 fat arrow function exported and exposed to disconnect to the db
 */
export const disconnect=()=>{
    //console.log(`Now closing connection`);
    if (dbInstance){
        dbInstance.close();
        //dbInstance={};
        dbInstance=null;
    }    
};
/**
 * es6 fat arrow function exported and exposed to inject data passed as object
 */
export const injectOneItem=(value)=>{
    /* console.log('====================================');
    console.log(`entered inject one item`);
    console.log('===================================='); */
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
                reject(`Connect first to the database then inject the data`);
        }
        dbInstance.collection(value.collectionName).insertOne(value.data,(err,data)=>{
                if (err) reject(`Error on insert item:${value.collectionName} \n${err.code} \nstatus message:${err.message}`);
                //console.log(`inserted record:${data.ops[0]._id}`);
                resolve(data.ops[0]._id);
        });
             
    });
};
/**
 * es6 fat arrow function exported and exposed to query data passed as an object
 * @param {object} value object containing the information to be searched on the db 
 * @return {Promise} promise containing the result of the operation(cause callbacks are evil....)
 * 
 */
export const search=(value)=>{
   /*  console.log('====================================');
    console.log(`search value search: ${JSON.stringify(value.queryParam,null,2)}\ncollection name:${value.collectionName} `);
    console.log('===================================='); */
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
       dbInstance.collection(value.collectionName).find(value.queryParam).toArray((err,result)=>{
           if(err){
                reject(`Error on querying data:${value.collectionName}\n${err.code}\nstatus message:${err.message}`);
            }
            /* console.log('====================================');
            console.log(`data returned:${JSON.stringify(result)}`);
            console.log('===================================='); */
            resolve(result);
       });
    });
};
/**
 * search db by id
 * @param {Object} value the object containing the information for work on db
 * @returns {Promise} contains the sucess or fail of the operation
 */
export const searchByID=(value)=>{
    /* console.log('====================================');
    console.log(`searchByID value search: ${JSON.stringify(value.queryParam)}\ncollection name:${value.collectionName} `);
    console.log('===================================='); */
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
        dbInstance.collection(value.collectionName).find({"_id":new dbClient.ObjectId(value.queryParam._id)}).toArray((err,result)=>{
            if(err){
                reject(`Error on querying data:${value.collectionName}\n${err.code}\nstatus message:${err.message}`);
             }
             
             resolve(result);
        });
    });
};


/**
 * method to update data on the collections
 * @param {Object} value the object containing the data to be updated 
 * @returns {Promise} with the result or fail of the operation
 */
export const updateData=value=>{
    /* console.log('====================================');
    console.log(`updateData value search: ${JSON.stringify(value.queryParam,null,2)}\ncollection name:${value.collectionName} `);
    console.log('===================================='); */
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
        dbInstance.collection(value.collectionName).update(value.queryParam.dataselect,value.queryParam.datacriteria,(err,result)=>{
            if(err){
                reject(`Error on querying data:${value.collectionName}\n${err.code}\nstatus message:${err.message}`);
             }
             
             resolve(result);
        });
    });
};


/**
 * method to update data by object id on the collections
 * @param {Object} value the object containing the data to be updated 
 * @returns {Promise} with the result or fail of the operation
 */
export const updateById=value=>{
    /* console.log('====================================');
    console.log(`updateById value search: ${JSON.stringify(value,null,2)}`);
    console.log('===================================='); */
    return new Promise((resolve,reject)=>{
        if (!dbInstance)reject(`Connect first to the database then search the data`);
        dbInstance.collection(value.collectionName).update(
            {
                _id:new dbClient.ObjectId(value.queryParam.dataselect.item)
            }
            ,value.queryParam.datacriteria,(errorupdate,result)=>{
                if(errorupdate){
                    reject(`Error on querying data:${value.collectionName}\n${errorupdate.code}\nstatus message:${errorupdate.message}`);
                }
                
                resolve(result);
            });
    });
};
/**
 * method to remove single data on the collections
 * @param {Object} value the object containing the data to be updated 
 * @returns {Promise} with the result or fail of the operation
 */
export const removeOne=value=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance) reject(`Connect first to the database then search the data`);
        dbInstance.collection(value.collectionName).deleteOne(value.queryParam,(err,result)=>{
            if (err) reject(`Error on removeOne item:${value.collectionName} \n${err.code} \nstatus message:${err.message}`);
            resolve(`the record with the following criteria was removed:${JSON.stringify(value.queryParam)}\nresult:${JSON.stringify(result)}`);
        });
    });
};
/**
 * method to remove data by object id on the collections
 * @param {Object} value the object containing the data to be updated 
 * @returns {Promise} with the result or fail of the operation
 */
export const removeById=(value)=>{
    /* console.log('====================================');
    console.log(`removeById value search: ${JSON.stringify(value.queryParam)}\ncollection name:${value.collectionName} `);
    console.log('===================================='); */
    return new Promise((resolve,reject)=>{
        if (!dbInstance) reject(`Connect first to the database then search the data`);
        dbInstance.collection(value.collectionName).deleteOne({_id:new dbClient.ObjectId(value.queryParam.data)},(err,result)=>{
            if (err)reject(`Error on querying data:${value.collectionName}\n${err.code}\nstatus message:${err.message}`);
            
            resolve(result);
        });
    });
};
/**
 * method to search for a single subdocument present in the collection
 * @param {Object} value contains the parameters for searching the subdocument
 * @returns {Promise} with the result sucess of the operation
 */
export const searchUniqueSubDocument=value=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance)reject(`Connect first to the database then search the data`);
        dbInstance.collection(value.collectionName).aggregate(value.queryParam,(err,result)=>{
            if (err)reject(`Error on querying data:${value.collectionName}\n${err.code}\nstatus message:${err.message}`);
            resolve(result);
        });
    });
};
export const checkCollections=value=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
        
    });
};