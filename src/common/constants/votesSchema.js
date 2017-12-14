import {schema} from 'normalizr';


const pollOptionsSchema= new schema.Entity('polloptions');
const pollCreator= new schema.Entity('pollcreator');

const pollInformation=new schema.Entity('polls',{
    creator:pollCreator,
    pollOptions:[pollOptionsSchema]
},{idAttribute:'polltoken'});

const dataPolls=new schema.Array(pollInformation);

export const VotesSchema= {
    dataPolls,
    pollOptionsSchema,
    pollInformation

};
 