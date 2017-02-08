import React from 'react';
import {render} from 'react-dom';
import {Router,Route,browserHistory} from 'react-router';
import App from './components/App';
import votingApp from './components/Challenges/vottingapp/voteMachineApp';
import nightLifeApp from './components/Challenges/nightlife/nightLifeApp';
import stocksApp from './components/Challenges/stocks/stocksApp';
import bookTrade from './components/Challenges/books/booksApp';
import pinrestApp from './components/Challenges/pinClone/pinRestCloneApp';
import NotFound from './components/notFound';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
render(
    <Router history={browserHistory}>
        <Route path="/voting" component={votingApp}/>
        <Route path="/nightlife" component={nightLifeApp}/>
        <Route path="/stocks" component={stocksApp}/>
        <Route path="/books" component={bookTrade}/>
        <Route path="/pinclone" component={pinrestApp}/>
        <Route path="/" component={App} />
        <Route path="*" component={NotFound}/> 
    </Router>,
    document.getElementById('root')
);