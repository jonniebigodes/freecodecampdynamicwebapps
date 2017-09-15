import React, { Component } from 'react';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class BookTradeApp extends Component{
    render(){
        return (
            <MuiThemeProvider>
                <div>
                    <AppHeader appName="Supercalifragilistic Book Trades" appStyle="night"/>
                    <AppFooter appName="books"/>
                </div>
            </MuiThemeProvider>

        );
    }
}