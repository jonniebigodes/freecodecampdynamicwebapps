import {schema} from 'normalizr';
// creator schema
const userSchema = new schema.Entity('creator',{},{idAttribute:'userid'});
//
// image schema
const imageSchema = new schema.Entity('images');
//
// wall schema
const wallInfo= new schema.Entity('wall',{
    creator:userSchema,
    dataImages:[imageSchema]
},{idAttribute:'idwall'});
//

// array of walls 
const dataWalls= new schema.Array(wallInfo);
//

export const PinSchemas = {
    dataWalls,
    userSchema,
    imageSchema
};