import {createStore,combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware'
import stocks from '../reducers/stockAppReducer';
import votes from '../reducers/votingAppReducer';
import night from '../reducers/nightlifeAppReducer';
import books from '../reducers/booktradeAppReducer';
export default createStore(
    combineReducers({
        stocks,
        night,
        books
    }),
    {},
    applyMiddleware(thunk,promise())
    
);