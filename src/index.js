import React from 'react';
import {render} from 'react-dom';
import {Router,Route,browserHistory} from 'react-router';
import {Provider} from "react-redux";
import store from "../src/common/store/store";
import App from '../src/client/components/App';
import votingApp from '../src/client/components/challenges/vottingapp/voteMachineApp';
import pollDetails from '../src/client/components/challenges/vottingapp/voteMachinePollDetails';
import nightLifeApp from '../src/client/components/challenges/nightlife/NightLifeApp';
import stocksApp from '../src/client/components/challenges/stocks/stocksApp';
import BookTradeApp from '../src/client/components/challenges/books/BookTradeApp';
import pinrestApp from '../src/client/components/challenges/pinClone/pinRestCloneApp';
import NotFound from '../src/client/components/notFound';


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

