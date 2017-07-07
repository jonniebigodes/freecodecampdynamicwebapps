import {createStore,combineReducers} from 'redux';
import stocks from '../reducers/stockAppReducer';
import votes from '../reducers/votingAppReducer';

export default createStore(
    combineReducers({
        stocks,
        votes
    }),
    {},
    
);