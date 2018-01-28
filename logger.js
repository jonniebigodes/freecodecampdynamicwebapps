'use strict';
const winston= require('winston');
winston.emitErrs = true;

const tsFormat = () => (new Date()).toLocaleTimeString();
//
// Logging levels
//
const config = {
    levels: {
      error: 0,
      debug: 1,
      warn: 2,
      data: 3,
      info: 4,
      verbose: 5,
      silly: 6
    },
    colors: {
      error: 'red',
      debug: 'blue',
      warn: 'yellow',
      data: 'grey',
      info: 'green',
      verbose: 'cyan',
      silly: 'magenta'
    }
  };
  const logger = new winston.Logger({
    levels: config.levels,
    // format: winston.format.combine(
    //   winston.format.colorize(),
    //   winston.format.simple()
    // ),

    transports: [
      new winston.transports.Console({
        timestamp: tsFormat,
        colorize: true,
        prettyPrint: true,
        handleExceptions: true,
      })
    ]
  });
 module.exports=logger;