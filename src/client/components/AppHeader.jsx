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
     * 
     */
    handleHomeButtonClick = () => {
        browserHistory.push('/');
    };
    setHeaderStyle=(value)=>{
        switch (value) {
            case "stocks":
                return "headerTextStock";
            default:
                return "footer";
        }
    }
    showHideLogin=()=>{
        this.props.showLogin();
    }
    /**
     * component render function
     */
    render() {
        
        return (
            <AppBar title={this.props.appName} className={this.setHeaderStyle(this.props.appStyle)}
                    showMenuIconButton={this.props.hasLoginNeeds}
                    onLeftIconButtonTouchTap={this.showHideLogin}
                    iconElementRight={<IconButton onClick={this.handleHomeButtonClick}>
                            <i className="material-icons md-24"> home</i>
                        </IconButton>} />  
        );
    }
}
AppHeader.propTypes={
    appName:PropTypes.string.isRequired,
    appStyle:PropTypes.string.isRequired,
    hasLoginNeeds:PropTypes.bool.isRequired,
    showLogin:PropTypes.func.isRequired
};
