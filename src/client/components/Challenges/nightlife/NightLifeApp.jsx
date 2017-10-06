import React, { Component } from 'react';
import NightlifeContainer from './NightlifeContainer';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class NightlifeApp extends Component{

    /**
     * component render method
     */
    

    render(){
        return(
            <MuiThemeProvider>
                <div className="">
                    <AppHeader appName="Supercalifragilistic Nightlife Coordinator" appStyle="night"/>
                    <NightlifeContainer/>
                    <AppFooter appName="night"/>
                </div>
            </MuiThemeProvider>
        );
    }
}