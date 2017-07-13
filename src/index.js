import React from 'react';
import {render} from 'react-dom';
import {Router,Route,browserHistory} from 'react-router';
import {Provider} from "react-redux";
import store from "./common/store/store";

import App from './client/components/App';
import votingApp from './client/components/Challenges/vottingapp/voteMachineApp';
import pollDetails from './client/components/Challenges/vottingapp/voteMachinePollDetails';
import nightLifeApp from './client/components/Challenges/nightlife/nightLifeApp';
import stocksApp from './client/components/Challenges/stocks/stocksApp';
import bookTrade from './client/components/Challenges/books/booksApp';
import pinrestApp from './client/components/Challenges/pinClone/pinRestCloneApp';
import NotFound from './client/components/notFound';


import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

render(
    <Provider store={store}>
        <Router history={browserHistory}> 
            <Route path="/voting" component={votingApp}/>
            <Route path="/voting/poll/(:idPoll)" component={pollDetails}/>
            <Route path="/nightlife" component={nightLifeApp}/>
            <Route path="/stocks" component={stocksApp}/>
            <Route path="/books" component={bookTrade}/>
            <Route path="/pinclone" component={pinrestApp}/>
            <Route path="/" component={App} />
            <Route path="*" component={NotFound}/> 
        </Router>
    </Provider>,
    document.getElementById('root')
);

