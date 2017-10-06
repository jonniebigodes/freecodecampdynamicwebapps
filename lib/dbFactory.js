'use strict';Object.defineProperty(exports,'__esModule',{value:!0}),exports.checkCollections=exports.searchUniqueSubDocument=exports.removeById=exports.removeOne=exports.updateById=exports.updateData=exports.searchByID=exports.search=exports.injectOneItem=exports.disconnect=exports.connect=exports.comparePassword=exports.isConnected=exports.getUrl=exports.setUrl=void 0;var _mongodb=require('mongodb'),dbClient=_interopRequireWildcard(_mongodb),_bcryptNodejs=require('bcrypt-nodejs'),cryptoModule=_interopRequireWildcard(_bcryptNodejs);function _interopRequireWildcard(a){if(a&&a.__esModule)return a;var b={};if(null!=a)for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&(b[c]=a[c]);return b.default=a,b}var urlServer='',dbInstance={},setUrl=exports.setUrl=function(a){urlServer=a},getUrl=exports.getUrl=function(){return urlServer},isConnected=exports.isConnected=function(){return dbInstance===void 0},comparePassword=exports.comparePassword=function(a,b){var c=cryptoModule.compareSync(a,b);return c?'PWD_OK':'PWD_NOK'},connect=exports.connect=function(){return new Promise(function(a,b){''===urlServer&&b('Error on connect: no connection string was provided'),dbClient.MongoClient.connect(urlServer,function(c,d){c&&b('Error on connect: '+c.code+' \nstatus message:'+c.message),dbInstance=d,a(!0)})})},disconnect=exports.disconnect=function(){console.log('Now closing connection'),dbInstance&&(dbInstance.close(),dbInstance=null)},injectOneItem=exports.injectOneItem=function(a){return console.log('===================================='),console.log('entered inject one item'),console.log('===================================='),new Promise(function(b,c){dbInstance||c('Connect first to the database then inject the data'),dbInstance.collection(a.collectionName).insertOne(a.data,function(d,e){d&&c('Error on insert item:'+a.collectionName+' \n'+d.code+' \nstatus message:'+d.message),b(e.ops[0]._id)})})},search=exports.search=function(a){return console.log('===================================='),console.log('search value search: '+JSON.stringify(a.queryParam,null,2)+'\ncollection name:'+a.collectionName+' '),console.log('===================================='),new Promise(function(b,c){dbInstance||c('Connect first to the database then search the data'),dbInstance.collection(a.collectionName).find(a.queryParam).toArray(function(d,e){d&&c('Error on querying data:'+a.collectionName+'\n'+d.code+'\nstatus message:'+d.message),b(e)})})},searchByID=exports.searchByID=function(a){return console.log('===================================='),console.log('searchByID value search: '+JSON.stringify(a.queryParam)+'\ncollection name:'+a.collectionName+' '),console.log('===================================='),new Promise(function(b,c){dbInstance||c('Connect first to the database then search the data'),dbInstance.collection(a.collectionName).find({_id:new dbClient.ObjectId(a.queryParam._id)}).toArray(function(d,e){d&&c('Error on querying data:'+a.collectionName+'\n'+d.code+'\nstatus message:'+d.message),b(e)})})},updateData=exports.updateData=function(a){return console.log('===================================='),console.log('updateData value search: '+JSON.stringify(a.queryParam,null,2)+'\ncollection name:'+a.collectionName+' '),console.log('===================================='),new Promise(function(b,c){dbInstance||c('Connect first to the database then search the data'),dbInstance.collection(a.collectionName).update(a.queryParam.dataselect,a.queryParam.datacriteria,function(d,e){d&&c('Error on querying data:'+a.collectionName+'\n'+d.code+'\nstatus message:'+d.message),b(e)})})},updateById=exports.updateById=function(a){return console.log('===================================='),console.log('updateById value search: '+JSON.stringify(a,null,2)),console.log('===================================='),new Promise(function(b,c){dbInstance||c('Connect first to the database then search the data'),dbInstance.collection(a.collectionName).update({_id:new dbClient.ObjectId(a.queryParam.dataselect.item)},a.queryParam.datacriteria,function(d,e){d&&c('Error on querying data:'+a.collectionName+'\n'+d.code+'\nstatus message:'+d.message),b(e)})})},removeOne=exports.removeOne=function(a){return new Promise(function(b,c){dbInstance||c('Connect first to the database then search the data'),dbInstance.collection(a.collectionName).deleteOne(a.data,function(d,e){d&&c('Error on removeOne item:'+a.collectionName+' \n'+d.code+' \nstatus message:'+d.message),b('the record with the following criteria was removed:'+JSON.stringify(a.queryParam)+'\nresult:'+JSON.stringify(e))})})},removeById=exports.removeById=function(a){return console.log('===================================='),console.log('removeById value search: '+JSON.stringify(a.queryParam)+'\ncollection name:'+a.collectionName+' '),console.log('===================================='),new Promise(function(b,c){dbInstance||c('Connect first to the database then search the data'),dbInstance.collection(a.collectionName).deleteOne({_id:new dbClient.ObjectId(a.queryParam.data)},function(d,e){d&&c('Error on querying data:'+a.collectionName+'\n'+d.code+'\nstatus message:'+d.message),b(e)})})},searchUniqueSubDocument=exports.searchUniqueSubDocument=function(a){return new Promise(function(b,c){dbInstance||c('Connect first to the database then search the data'),dbInstance.collection(a.collectionName).aggregate(a.queryParam,function(d,e){d&&c('Error on querying data:'+a.collectionName+'\n'+d.code+'\nstatus message:'+d.message),b(e)})})},checkCollections=exports.checkCollections=function(){return new Promise(function(a,b){dbInstance||b('Connect first to the database then search the data')})};