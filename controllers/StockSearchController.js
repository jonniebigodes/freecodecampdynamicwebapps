//const httpService = require('./httpService'); 
const httpService = require('../src/server/httpService');
module.exports = {
    searchStockData(request, response) {
        if (request.query.stockName === '') {
            response
                .status(500)
                .send("UPS!!!! someone forgot something didnt they!!!");
            return;
        }
        httpService.getStockInformation({queryStock: request.query.stockName, startDate: request.query.startdate, endDate: request.query.enddate, keyQuandl: request.app.KEY_QUANDL})
            .then(result=> {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(result.dataRecieved));
            })
            .catch(error => {
                console.log('====================================');
                console.log(`Error StockSearch Controller search stock info:${JSON.stringify(error,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: error.messageError}));
            });
    }
};