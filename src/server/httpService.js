/**
 * module to act in the service capacity
 * outside access like http get /posts
 */
(function () {
    var unirest = require('unirest');
    module.exports = {

        getStockInformation: function (value, callback) {
            var resultInfo = {
                error: false,
                messageError: "",
                dataRecieved: {}
            };
            try {

                //console.log("PRE REQUEST stockname: "+ value.queryStock+ " quandlkey: "+value.keyQuandl);
                unirest.get("https://www.quandl.com/api/v3/datasets/WIKI/" + value.queryStock + ".json")
                    .query({
                        "api_key": value.keyQuandl
                    })
                    .query({
                        "start_date": value.startDate
                    })
                    .query({
                        "end_date": value.endDate
                    })
                    .end(function (result) {
                        if (result.status === "404") {
                            //console.log("error:\n"+ responseRequest);
                            resultInfo.error = true;
                            resultInfo.messageError = "The stock " + value.stockname + " to be searched does not exist";
                            callback(null, resultInfo)
                        } else {
                            //console.log("Result:\n"+ result.status);
                            //console.log(JSON.stringify(result));
                            //console.log("name of stuff searched: "+result.body.dataset.dataset_code);
                            let stockinfo = {
                                stockName: "",
                                stockCode: "",
                                refreshDate: "",
                                stockQueryStart: "",
                                StockQueryEnd: "",
                                stockData: []
                            };
                            stockinfo.stockName = result.body.dataset.name;
                            stockinfo.stockCode = result.body.dataset.dataset_code;
                            stockinfo.refreshDate = result.body.dataset.refreshed_at;
                            stockinfo.stockQueryStart = value.startDate;
                            stockinfo.StockQueryEnd = value.endDate;
                            //console.log("NUM REGISTOS DATA: "+ result.body.dataset.data.length);
                            for (var i = 0; i < result.body.dataset.data.length; i++) {
                                stockinfo.stockData.push({
                                    stockDate: result.body.dataset.data[i][0],
                                    openPrice: result.body.dataset.data[i][1],
                                    highestPrice: result.body.dataset.data[i][2],
                                    lowestPrice: result.body.dataset.data[i][3],
                                    closePrice: result.body.dataset.data[i][4]
                                })
                            }
                            resultInfo.dataRecieved = stockinfo;
                            callback(null, resultInfo);

                        }
                    });
            } catch (error) {
                console.log("ERRO HTTP SERVICE:\n" + error);
                resultInfo.error = true;
                resultInfo.messageError = "ERROR ON PROCESSING REQUEST TO STOCK SERVER: " + err;
                callback(null, resultInfo);

            }

        }
    }
})();