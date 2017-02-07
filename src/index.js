import React from 'react';
import {render} from 'react-dom';
import {Router,Route,browserHistory} from 'react-router';
import App from './components/App';
import NotFound from './components/notFound';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
render(
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="*" component={NotFound}/> 
    </Router>,
    document.getElementById('root')
);