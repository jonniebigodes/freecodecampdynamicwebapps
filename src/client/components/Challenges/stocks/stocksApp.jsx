import React, { Component } from 'react';


// to delete import Container from 'muicss/lib/react/container';
import {StockHeader} from './StockHeader';
import StockContainer from './StockContainer';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
export default class stocksApp extends Component{
    componentDidMount(){
        injectTapEventPlugin();
    }
    render(){

            return (
                <MuiThemeProvider>
                    <div className="container-fluid" >
                        <StockHeader/>
                    </div>
                </MuiThemeProvider>
            );
           /*  <Container>
                <StockHeader/>
                <hr/>
                <StockContainer/>
                <hr/>
                <div className="footer voffset6">
                    Made by <a href="https://www.freecodecamp.com/jonniebigodes" target="_blank">Jonniebigodes</a>
                </div>
            </Container> 
        );*/
    }
}
