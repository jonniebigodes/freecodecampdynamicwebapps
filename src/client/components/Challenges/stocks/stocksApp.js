import React, {Component} from 'react';
import StockViewerContainer from './stockViewerGraphContainer';
import Stockheader from './StockHeader';
class stocksApp extends Component{
    componentDidMount(){
        console.log("stocksApp did mount");
    }
    render(){
        return(
            <div id="stockbaseContainer">
                {/*<h1>SHOW ME THA MONEY</h1>*/}
                <Stockheader/>
                <StockViewerContainer id="stockApp"/>
                <hr/>
                <div className="footer voffset6">
                    Made by <a href="https://www.freecodecamp.com/jonniebigodes" target="_blank">Jonniebigodes</a>
                </div>
            </div>
            
        );
    }
};
export default stocksApp;