//to be refactored into proper factory pattern
/**
 * module to handle the db logc for the challenges
 
*/
import * as dbClient from 'mongodb';
import * as cryptoModule from 'bcrypt-nodejs';
let urlServer = '';
let dbInstance = {};


/* const UsersSchema= mongoose.Schema({
    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
}); */


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
    return new Promise((resolve,reject)=>{


        let pwdCompare= cryptoModule.compareSync(valueclient,valueDb);
        console.log('====================================');
        console.log(`client value: ${valueclient} dbvalue:${valueDb}\ result compare:${pwdCompare}`);
        console.log('====================================');
        if (pwdCompare){
            resolve("PWD_OK");
        }
        else{
            reject('PWD_NOK');
        }
        
    });
};

/**
 * es6 fat arrow function exported and exposed to connect to the db
 */

export const connect = () => {
    console.log('====================================');
    console.log(`entered connect`);
    console.log('====================================');
    return new Promise((resolve, reject) => {
        
         dbClient.MongoClient.connect(urlServer, (err, db) => {
            if (err) reject(`Error on connect: ${err.code} \nstatus message:${err.message}`);
            dbInstance = db;
            resolve(true);
        });

    });
};

/**
 * es6 fat arrow function exported and exposed to test the connection to the db
 */
export const testConnection=()=>{
    console.log(`Testing connection....`);
    return new Promise((resolve,reject)=>{
        connect(urlServer).then((result)=>{
            disconnect();
            resolve(result);
            }).catch((error)=>{
                reject(error);
            })
    });
};
/**
 * es6 fat arrow function exported and exposed to create collections
 */
export const createCollections=(collections)=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
                reject(`Connect first to the database then create the collections`);
        }
        for (const item of collections){
            console.log(`Creating item in collections: ${item}`);
            dbInstance.createCollection(item,{autoIndexID:true},(err,db)=>{
                if (err) reject(`Error creating collection:${item}\nReason:${err.code} \nstatus message:${err.message}`);

            });
        }
        resolve(true); 
    });

        
};


/**
 * es6 fat arrow function exported and exposed to disconnect to the db
 */
export const disconnect=()=>{
    
    if (dbInstance){
        console.log(`Now closing connection`);
        dbInstance.close();
        dbInstance={};
    }
        
};
/**
 * es6 fat arrow function exported and exposed to inject data passed as object
 */
export const injectOneItem=(value)=>{
    console.log('====================================');
    console.log(`entered inject one item`);
    console.log('====================================');
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
                reject(`Connect first to the database then inject the data`);
        }
        dbInstance.collection(value.collectionName).insertOne(value.data,(err,data)=>{
                if (err) reject(`Error on insert item:${value.collectionName} \n${err.code} \nstatus message:${err.message}`);
                console.log(`inserted record:${data.ops[0]._id}`);
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
    console.log('====================================');
    console.log(`search value search: ${JSON.stringify(value.queryParam)}\ncollection name:${value.collectionName} `);
    console.log('====================================');
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
       dbInstance.collection(value.collectionName).find(value.queryParam).toArray((err,result)=>{
           if(err){
                reject(`Error on querying data:${value.collectionName}\n${err.code}\nstatus message:${err.message}`);
            }
            console.log('====================================');
            console.log(`data returned:${JSON.stringify(result)}`);
            console.log('====================================');
            resolve(result);
       });
    });
};
/**
 * search db by id
 * @param {Object} value the object containing the information for work on db
 */
export const searchByID=(value)=>{
    console.log('====================================');
    console.log(`search value search: ${JSON.stringify(value.queryParam)}\ncollection name:${value.collectionName} `);
    console.log('====================================');
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
        dbInstance.collection(value.collectionName).find({"_id":new dbClient.ObjectId(value.queryParam._id)}).toArray((err,result)=>{
            if(err){
                reject(`Error on querying data:${value.collectionName}\n${err.code}\nstatus message:${err.message}`);
             }
             console.log('====================================');
             console.log(`data returned:${JSON.stringify(result)}`);
             console.log('====================================');
             resolve(result);
        });
    });
};

export const removeOne=value=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance) reject(`Connect first to the database then search the data`);
        dbInstance.collection(value.collectionName).deleteOne(value.data,(err,result)=>{
            if (err) reject(`Error on insert item:${value.collectionName} \n${err.code} \nstatus message:${err.message}`);
            resolve(`the record with the following criteria was removed:${JSON.stringify(value.queryParam)}\nresult:${JSON.stringify(result)}`);
        });
    });
}
export const checkCollections=value=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
        
    });
};