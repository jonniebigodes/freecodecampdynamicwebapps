//to be refactored into proper factory pattern
/**
 * module to handle the db logc for the challenges
 
*/
import * as dbClient from 'mongodb';
let urlServer = '';
let dbInstance = {};


export const setUrl = value => {
    urlServer = value;
}
export const getUrl = () => {
    return urlServer;
}
/**
 * es6 fat arrow function exported and exposed to connect to the db
 */

export const connect = () => {
    return new Promise((resolve, reject) => {
        dbClient.MongoClient.connect(urlServer, (err, db) => {
            if (err) reject(`Error on connect: ${err.code} \nstatus message:${err.message}`);
            dbInstance = db;
            resolve(true);
        })

    })
}

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
    })
}
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

            })
        }
        resolve(true); 
    })

        
}


/**
 * es6 fat arrow function exported and exposed to disconnect to the db
 */
export const disconnect=()=>{
    
    if (dbInstance){
        console.log(`Now closing connection`);
        dbInstance.close();
        dbInstance={};
    }
        
}
/**
 * es6 fat arrow function exported and exposed to inject data passed as object
 */
export const injectData=(value)=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
                reject(`Connect first to the database then inject the data`);
        }
        dbInstance.collection(value.collectionName).insertOne(value.Data,(err,data)=>{
                if (err) reject(`Error on insert item:${value.collectionName} \n${err.code} \nstatus message:${err.message}`);
                resolve(true);
        })
             
    })
}
/**
 * es6 fat arrow function exported and exposed to query data passed as an object
 * @param {object} value object containing the information to be searched on the db 
 */
export const search=value=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
        dbInstance.collection(value.collectionName).find({userid:value.data.userID},(err,data)=>{
            if(err){
                reject(`Error on querying data:${value.collectionName}\n${err.code}\nstatus message:${err.message}`);
            }
            resolve(data);
        });
    })
}

export const checkCollections=value=>{
    return new Promise((resolve,reject)=>{
        if (!dbInstance){
            reject(`Connect first to the database then search the data`);
        }
        
    })
}