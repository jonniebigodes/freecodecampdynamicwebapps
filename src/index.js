import React from 'react';
import {render} from 'react-dom';
import {Router,Route,browseHistory} from 'react-router';

render(
    <Router history={browseHistory}>
    </Router>,
    document.getElementById('root')
);