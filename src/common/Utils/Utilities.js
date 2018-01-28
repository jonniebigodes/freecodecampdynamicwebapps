const moment = require('moment');
import * as cryptoModule from 'bcrypt-nodejs';


const getTimeStamp=()=>{
    return moment();
};

const calculateTokenTime=(value)=>{

    // let systemcurrentDate= moment();
    // let parsedTokenDate= moment().milliseconds(yelpInfo.expires);
    // let datediff= parsedTokenDate.diff(systemcurrentDate,'days');

    const tmpStamp= getTimeStamp();
    
    let toMilliseconds= tmpStamp.millisecond(value);
    // console.log('====================================');
    // console.log(`tmpStamp value:${tmpStamp} to mills value:${toMilliseconds}`);
    // console.log('====================================');
    return toMilliseconds.diff(tmpStamp,'days');

};
const encriptPassword=(value)=>{
    return cryptoModule.hashSync(value);
};


export const fccUtilities={getTimeStamp,encriptPassword,calculateTokenTime};