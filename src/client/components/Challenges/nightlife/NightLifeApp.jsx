import React, { Component } from 'react';
import AppHeader from '../../AppHeader';
import NightlifeContainer from './NightlifeContainer';
import AppFooter from '../../AppFooter';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class NightlifeApp extends Component{

    /**
     * component guard method to check the component was mounted
     */
    componentDidMount(){
        injectTapEventPlugin();
    }

    render(){
        return(
            <MuiThemeProvider>
                <div className="container-fluid">
                    <AppHeader appName="Supercalifragilistic Nightlife Coordinator" appStyle="night"/>
                    <NightlifeContainer/>
                    <AppFooter appName="night"/>

                </div>
            </MuiThemeProvider>
        );
    }
}