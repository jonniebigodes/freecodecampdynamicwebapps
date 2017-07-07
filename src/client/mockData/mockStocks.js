(function(){
    var itemColors=["#D44E3D","#EBAA13","#c5d5cb","#9fa8a3","#b3c2bf","#e9ece5","#edd9c0","#9068be","#3fb0ac","#173e43"];
    module.exports={
        
        randomizeColors:function(){
            return itemColors[module.exports.randomizeStockNums(1,itemColors.length-1)];
        },
        /**
         * function to generate mock stock items results
         * @param minvalue the floor value to generate random number
         * @param maxValue the ceiling value to generate random number
         * @return random number between a given interval
         */
        randomizeStockNums:function(minValue,maxValue){
            let item= Math.floor(Math.random()*maxValue)+minValue;
            return item;
        },
        generateDummyGraphData:function(value){
            var tmpData=[];
            var tmpDataSecond=[];
            for (var i=0;i<7;i++){
                tmpData.push(module.exports.randomizeStockNums(1,200));
                tmpDataSecond.push(module.exports.randomizeStockNums(1,200));
            }

            var tmpColor= module.exports.randomizeColors();
            
            return {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                            {
                                label: 'My '+value+ ' dataset',
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: tmpColor,
                                borderColor: tmpColor,
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: tmpColor,
                                pointBackgroundColor: '#fff',
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: tmpColor,
                                pointHoverBorderColor: 'rgba(220,220,220,1)',
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: tmpData
                        },
                           {
                                label: 'My '+value+ ' Second dataset',
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: module.exports.randomizeColors(),
                                borderColor: module.exports.randomizeColors(),
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: tmpColor,
                                pointBackgroundColor: '#fff',
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: tmpColor,
                                pointHoverBorderColor: 'rgba(220,220,220,1)',
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: tmpDataSecond
                        }
                    ]
                };
            }
    }

})();