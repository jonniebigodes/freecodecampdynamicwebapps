
class nightApi{
    
    
    /**
     * function to call the api on the server and get the results
     * @param {string} query what to search
     * @param {string} location where to search
     * @param {string} userID who searches 
     * @param {number} numberItems how may items to be searched
     */
    static search(query,location,userId,numberItems){
        return new Promise((resolve,reject)=>{
            fetch(`http://localhost:5000/api/data/nightsearch?what=${query}&where=${location}&ammount=${numberItems}`) 
                 /* fetch(`https://freecodecampdynprojects.herokuapp.com/api/data/stocksearch?stockName=${nameofStock}&startdate=${startdate}&enddate=${enddate}`) */
            .then(response=>{
                   //console.log("getStock status: " +response.status);
                   return response.json();
               })
            .then(result=>{
                   //console.log("result: " + JSON.stringify(result));
                   //return result;
                   if (result.code){
                       //console.log("there was an error");
                       reject(result.reason);
   
                   }
                   resolve(result);
                   
               })
            .catch(error=>{
                   console.log('====================================');
                   console.log('There has been a problem with your fetch operation: ' + error.message);
                   console.log('====================================');
                   //return {isDataOK:false,ErrorInfo:error,resultData:{}};
                   //reject(error.message)
                   throw new Error(error.message);
            });
        });
        
    }

}
export default nightApi;