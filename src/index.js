import React from 'react';
import {render} from 'react-dom';
import {Router,Route,browserHistory} from 'react-router';
import {Provider} from "react-redux";
import store from "./common/store/store";
import App from './client/components/App';
import PollsApp from './client/components/dynamic_challenges/vottingapp/PollsApp';
import PollInfoDetail from './client/components/dynamic_challenges/vottingapp/PollInfoDetail';
import nightLifeApp from './client/components/dynamic_challenges/nightlife/NightLifeApp';
import stocksApp from './client/components/dynamic_challenges/stocks/stocksApp';
import BookTradeApp from './client/components/dynamic_challenges/books/BookTradeApp';
import pinrestApp from './client/components/dynamic_challenges/pinClone/pinRestCloneApp';
import NotFound from './client/components/notFound';


import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

render(
    <Provider store={store}>
        <Router history={browserHistory}> 
            <Route path="/voting/(:authToken)" component={PollsApp}/>
            <Route path="/voting/poll/(:idPoll)" component={PollInfoDetail}/>
            <Route path="/nightlife" component={nightLifeApp}/>
            <Route path="/stocks" component={stocksApp}/>
            <Route path="/books" component={BookTradeApp}/>
            <Route path="/pinclone" component={pinrestApp}/>
            <Route path="/" component={App} />
            <Route path="*" component={NotFound}/> 
        </Router>
    </Provider>,
    document.getElementById('root')
);

