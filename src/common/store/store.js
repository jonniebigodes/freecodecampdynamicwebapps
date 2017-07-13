import {createStore,combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware'
import stocks from '../reducers/stockAppReducer';
import votes from '../reducers/votingAppReducer';

export default createStore(
    combineReducers({
        stocks,
        votes
    }),
    {},
    applyMiddleware(thunk,promise())
    
);