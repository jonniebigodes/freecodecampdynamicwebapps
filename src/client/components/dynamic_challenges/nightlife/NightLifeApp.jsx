import React, { Component } from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme  from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {dynamicThemes} from '../../../../Assets/styles/challengesThemes';
import {
    fetchNightDataIfNeeded, 
    setNightAppError,
    resetNightAppError,
    nightExit,
    authenticateServer,
    registerServer,
    disconnectUser,
    removeUserFromNight,
    addUserToNight,
    fetchAuthToken
} from '../../../../common/actions/nightLifeAppActions';
import NightlifeContainer from './NightlifeContainer';
 class NightlifeApp extends Component{
     
    /**
     * component render method
     */
    componentDidMount(){
        this.props.generateToken();
        
    }
    /**
     * react guard method to handle the component unload
     */
    componentWillUnmount(){
        this.props.exitNight();
    }
    
    onUserLogoutHandler=()=>{
        this.props.unpluguser(this.props.loginData.id);
    }
    onLoginRegisterHandler=(value)=>{
        value.isLogin?this.props.setLogin(value):this.props.setRegistry(value);
    }
    onSearchItemsHandler=(value)=>{
        value.token=this.props.tokenYelp.token;
        this.props.searchItems(value);
    }
    onaddUserToNightEventHandler=(value)=>{
        this.props.addUserToNightEvent(value);
    }
    onremoveUserFromNightEventHandler=(value)=>{
        this.props.removeUserFromNightEvent(value);
    }
    onAppErrorHandler=(value)=>{
        this.props.setError(value);
    }
    onAppresetErrorHandler=()=>{
        this.props.resetError();
    }
    render(){
        const {isError,errorMessageApp,loginData,loggedIn,searchresults,searchitems}= this.props;
        return(
           <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme,dynamicThemes.themeNight)}>
                <NightlifeContainer 
                    nightLifeAppError={isError}
                    nighterrorMessageApp={errorMessageApp}
                    nightSetError={this.onAppErrorHandler}
                    nightLifeResetAppError={this.onAppresetErrorHandler}
                    nightLifeUserInformation={loginData}
                    nightlifeUserLoggedIn={loggedIn}
                    nightLifeLoginRegister={this.onLoginRegisterHandler}
                    nightUnloadUser={this.onUserLogoutHandler}
                    addToNightEvent={this.onaddUserToNightEventHandler}
                    removeFromNightEvent={this.onremoveUserFromNightEventHandler}
                    nightSearchItems={this.onSearchItemsHandler}
                    nightConnectUser={this.onLoginRegisterHandler}
                    nightLifeSearchResults={searchresults.length}
                    nightLifeItems={searchitems}/>
            </MuiThemeProvider>
            
        );
    }
}
//region redux connect
const mapStateToProps = state => {
    return {
        isError: state.night.onError, 
        errorMessageApp: state.night.errorMessage,
        loggedIn:state.night.nightisLoggedin,
        loginData:state.night.nightuserInfo,
        tokenYelp:state.night.yelpToken,
        searchitems:state.night.searchResultsEntities,
        searchresults:state.night.searchResults
    };

};
const mapDispatchToProps = dispatch => {
    return {
        generateToken:()=>{
            dispatch(fetchAuthToken());
        },
        searchItems: (value) => {
            dispatch(fetchNightDataIfNeeded(value));
        },
        addUserToNightEvent:(value)=>{
            dispatch(addUserToNight(value));
        },
        removeUserFromNightEvent:(value)=>{
            dispatch(removeUserFromNight(value));
        },
        setError:(value)=>{
            dispatch(setNightAppError(value));
        },
        resetError:()=>{
            dispatch(resetNightAppError());
        },
        exitNight:()=>{
            dispatch(nightExit());
        },
        setLogin:(value)=>{
            dispatch(authenticateServer(value));
        },
        setRegistry:(value)=>{
            dispatch(registerServer(value));
        },
        unpluguser:()=>{
            dispatch(disconnectUser());
        }
    };
};
//endregion
export default connect(mapStateToProps, mapDispatchToProps)(NightlifeApp);