import React, {Component} from 'react';
import {browserHistory} from 'react-router';

import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import '../../../../Assets/stylesheets/stocksApp.scss';
export class StockHeader extends Component {
    /**
     * event handler for the click 
     * @param {*} e object of the event
     */
    handleHomeButtonClick = (e) => {
        console.log("handled home got");
        browserHistory.push('/');
    };
    /**
     * component render function
     */
    render() {
        
        return (
            <AppBar title="Supercalifragilistic Stock Search" className="headerText"
                    showMenuIconButton={false}
                    iconElementRight={<IconButton onClick={(e)=>this.handleHomeButtonClick(e)}>
                            <i className="material-icons md-24"> home</i>
                        </IconButton>}>
                    
            </AppBar>
               
                        
                
            
              
            
        );
    }
}
