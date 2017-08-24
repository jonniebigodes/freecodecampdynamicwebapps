import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import { PropTypes } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
//import '../../../../Assets/stylesheets/stocksApp.scss';
import '../../Assets/stylesheets/stocksApp.scss';
export default class AppHeader extends Component {
    /**
     * event handler for the click 
     * @param {*} e object of the event
     */
    handleHomeButtonClick = (e) => {
        console.log("handled home got");
        browserHistory.push('/');
    };
    setHeaderStyle=(value)=>{
        switch (value) {
            case "stocks":
                return "headerTextStock";
                break;
        
            default:
                return "footer";
                break;
        }
    }
    /**
     * component render function
     */
    render() {
        
        return (
            <AppBar title={this.props.appName} className={this.setHeaderStyle(this.props.appStyle)}
                    showMenuIconButton={false}
                    iconElementRight={<IconButton onClick={(e)=>this.handleHomeButtonClick(e)}>
                            <i className="material-icons md-24"> home</i>
                        </IconButton>}>
                    
            </AppBar>
               
                        
                
            
              
            
        );
    }
}
AppHeader.propTypes={
    appName:PropTypes.string.isRequired,
    appStyle:PropTypes.string.isRequired,
}
