import React, { Component } from 'react';
import StockContainer from './StockContainer';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppFooter from '../../AppFooter';
import AppHeader from '../../AppHeader';
import '../../../../Assets/stylesheets/stocksApp.scss';
export default class stocksApp extends Component{
    /**
     * component guard method to check the component was mounted
     */
    componentDidMount(){
        injectTapEventPlugin();
    }
    /**
     * component render function
     */
    render(){

            return (
                <MuiThemeProvider>
                    <div className="container-fluid containerApp" id="ContainerAppStocks" key="AppStocks">
                        <AppHeader appName="Supercalifragilistic Stock Search" appStyle="stocks"/>
                        <StockContainer/>
                        <AppFooter appName="stocks"/>
                    </div>

                </MuiThemeProvider>
                
            );
           
    }
}
