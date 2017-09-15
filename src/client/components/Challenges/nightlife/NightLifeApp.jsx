import React, { Component } from 'react';
import AppHeader from '../../AppHeader';
import NightlifeContainer from './NightlifeContainer';
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