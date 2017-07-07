(function(){
    let itemsApp=[];
    let userInformation={username:"dummy"};
    module.exports={
        /**
         * function to return the mock data
         */
        getMocktems:function(){
            return itemsApp;
        },
        /**
         * function to generate a fixed length of data for the challenge
         */
        generateItems:function(){
            if (itemsApp.length>0){
                module.exports.destroyItems();
            }
            for (var i=0; i<100; i++){
                let tmpPollItem={idPoll:"poll_id_"+i,pollname:"MockPoll_"+i,pollOptions:[],pollCreator:"Dummy User"};
                for (var x=0; x<3; x++){
                    tmpPollItem.pollOptions.push({optionPoll:"option_"+x,numVotes:module.exports.randomizePollVotes(1,100)});
                }
                itemsApp.push(tmpPollItem);
            }
            
        },
        /**
         * function to generate mock voting polls results
         * @param minvalue the floor value to generate random number
         * @param maxValue the ceiling value to generate random number
         * @return random number between a given interval
         */
        randomizePollVotes:function(minValue,maxValue){
            let item= Math.floor(Math.random()*maxValue)+minValue;
            return item;
        },
        /**
         * function to clear the mock array
         */
        destroyItems:function(){
            while(itemsApp.length>0){
                itemsApp.pop();
            }
        },
        getDummyUserName:function(){
            return userInformation;
        },
        /**
         * function to generate mock item for the votting app challenge based on number of items and options provided
         * @param value number of items to be added to the array(polls)
         * @param valueNumOptions number of options by polls
         * @return the mock array injected with the mock data based on the options provided
         */
        generateItemsByNumber:function(value,valueNumOptions){
            if (itemsApp.length>0){
                module.exports.destroyItems();
            }

            for (var i=0; i<value; i++){
                let tmpPollItem={idPoll:"poll_id_"+i,pollname:"MockPoll_"+i,pollOptions:[],pollCreator:"Dummy User"};
                for (var x=0; x<valueNumOptions; x++){
                    tmpPollItem.pollOptions.push({optionPoll:"option_"+x,numVotes:module.exports.randomizePollVotes(1,100)});
                }
                itemsApp.push(tmpPollItem);
            }

        },
        getItemById:function(value){
            let result={idPoll:"",pollname:""+i,pollOptions:[],pollCreator:""};
            try {
                if (itemsApp.length>0){
                    
                    for (var i =0; i<itemsApp.length; i++){
                        if (itemsApp[i].idPoll.toLowerCase()===value.toLowerCase()){
                            result=itemsApp[i];
                            return result;
                        }
                    }
                }
            } catch (error) {
                console.log("ERRO MOCKDATA:\ngetItemById: "+ error);
            }
            return result;
        }

    }    
})();