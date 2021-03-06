const httpService =process.env.NODE_ENV !== 'production'?require('../src/server/httpService'):require('./httpService');
const logger=  process.env.NODE_ENV!== 'production' ? require('../logger'):require('./logger');
//const httpService = require('../src/server/httpService');
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
                response.end(JSON.stringify({code: "fccda005", resultQuery:result}));
            })
            .catch(error => {
                logger.error(`Error StockSearch Controller searchStockData:${JSON.stringify(error,null,2)}`);
                // console.log('====================================');
                // console.log(`Error StockSearch Controller search stock info:${JSON.stringify(error,null,2)}`);
                // console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: error.messageError}));
            });
    }
};