import React from 'react';
import {render} from 'react-dom';
import {Router,Route,browserHistory} from 'react-router';
import {Provider} from "react-redux";
//import store from "./common/store/store";
import store from "common/store/store";
//import App from './client/components/App';
import App from 'client/components/App';
//import votingApp from './client/components/challenges/vottingapp/voteMachineApp';
import votingApp from 'client/components/challenges/vottingapp/voteMachineApp';
//import pollDetails from './client/components/challenges/vottingapp/voteMachinePollDetails';
import pollDetails from './client/components/challenges/vottingapp/voteMachinePollDetails';
//import nightLifeApp from './client/components/challenges/nightlife/NightLifeApp';
import nightLifeApp from 'client/components/challenges/nightlife/NightLifeApp';
//import stocksApp from './client/components/challenges/stocks/stocksApp';
import stocksApp from 'client/components/challenges/stocks/stocksApp';
//import BookTradeApp from './client/components/challenges/books/BookTradeApp';
import BookTradeApp from 'client/components/challenges/books/BookTradeApp';
//import pinrestApp from './client/components/challenges/pinClone/pinRestCloneApp';
import pinrestApp from 'client/components/challenges/pinClone/pinRestCloneApp';
//import NotFound from './client/components/notFound';
import NotFound from 'client/components/notFound';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

render(
    <Provider store={store}>
        <Router history={browserHistory}> 
            <Route path="/voting" component={votingApp}/>
            <Route path="/voting/poll/(:idPoll)" component={pollDetails}/>
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

