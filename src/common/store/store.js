// dev mode
//import {createStore,combineReducers,applyMiddleware,compose} from 'redux';
//
// prod mode 
import {createStore,combineReducers,applyMiddleware} from 'redux';
//
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import stocks from '../reducers/stockAppReducer';
import votes from '../reducers/votingAppReducer';
import night from '../reducers/nightlifeAppReducer';
import books from '../reducers/booktradeAppReducer';

// dev mode
//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//
/* export default createStore(
    combineReducers({
        stocks,
        night,
        books,
        votes
    }),
    {},
    composeEnhancers(
        applyMiddleware(thunk,promise())
    )
    
); */
// prod mode
export default createStore(
    combineReducers({
        stocks,
        night,
        books,
        votes
    }),
    {},
    applyMiddleware(thunk,promise()));