import {schema} from 'normalizr';


const stocksData= new schema.Entity('data');

const stockInfo= new schema.Entity('resultQuery',{
    stockQueryData:stocksData
},{idAttribute:'id'});


const dataStocks= new schema.Array(stockInfo);

export const StockSchemas={dataStocks,stockInfo,stocksData};