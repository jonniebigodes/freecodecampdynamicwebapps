import React, { Component } from 'react';
import Container from 'muicss/lib/react/container';
import {StockHeader} from './StockHeader';
export default class stocksApp extends Component{
    componentDidMount=()=>{
        console.log("stocksApp did mount");
    }
    render(){
        return(
            <Container>
                <StockHeader/>
                <hr/>
                
                <hr/>
                <div className="footer voffset6">
                    Made by <a href="https://www.freecodecamp.com/jonniebigodes" target="_blank">Jonniebigodes</a>
                </div>
            </Container>
        );
    }
}