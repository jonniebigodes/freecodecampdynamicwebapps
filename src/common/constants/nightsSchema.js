import {schema} from 'normalizr';

//const nightSearchSchema= new schema.Entity('results');
const nighSearchQuery= new schema.Entity('infoquery');
const nightInformation = new schema.Entity('nights',{
    yelpQuery:nighSearchQuery,
},{idAttribute:'id'});
const dataNights= new schema.Array(nightInformation);

export const NightsSchema={
    nightInformation,dataNights
};