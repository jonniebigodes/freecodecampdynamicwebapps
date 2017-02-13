(function(){
    let unirest= require('unirest');
    module.exports={

        twitterSigIn:function(value){
           try {
               unirest.post('https://api.twitter.com/oauth/request_token')
               
               
           } catch (error) {
               console.log("HttpService: \n twitterSigIn Error:\n"+error);
           } 
        }
    }
})();