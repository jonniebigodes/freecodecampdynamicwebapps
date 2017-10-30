import React, { Component } from 'react';
import StockContainer from './StockContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppFooter from '../../AppFooter';
import AppHeader from '../../AppHeader';
import '../../../../Assets/stylesheets/stocksApp.scss';
export default class stocksApp extends Component{
    
    componentWillMount(){
        injectTapEventPlugin();
    }
    /**
     * component render function
     */
    render(){

            return (
                <MuiThemeProvider>
                    <div className="container-fluid containerApp" id="ContainerAppStocks" key="AppStocks">
                        <AppHeader appName="Supercalifragilistic Stock Search" appStyle="stocks" hasLoginNeeds={false}/>
                        <StockContainer/>
                        <AppFooter appName="stocks"/>
                    </div>

                </MuiThemeProvider>
                
            );
           
    }
}
