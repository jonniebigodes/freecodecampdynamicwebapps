import React, { Component } from 'react';
import {connect} from 'react-redux';
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
import injectTapEventPlugin from 'react-tap-event-plugin';
 class NightlifeApp extends Component{

    componentWillMount(){
        injectTapEventPlugin();
    }
    /**
     * component render method
     */
    componentDidMount(){
        this.props.generateToken(true);
        
    }
    /**
     * react guard method to handle the component unload
     */
    componentWillUnmount(){
        this.props.exitNight(true);
    }
    onAppErrorReset=()=>{
        this.props.resetError(true);
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
        this.props.resetError(true);
    }
    render(){
        return(
            <NightlifeContainer 
                nightLifeAppError={this.props.isError}
                nighterrorMessageApp={this.props.errorMessageApp}
                nightSetError={(value)=>this.onAppErrorHandler(value)}
                nightLifeResetAppError={this.onAppresetErrorHandler}
                nightLifeUserInformation={this.props.loginData}
                nightlifeUserLoggedIn={this.props.loggedIn}
                nightLifeSearchResults={this.props.items}
                nightLifeLoginRegister={(value)=>this.onLoginRegisterHandler(value)}
                nightUnloadUser={this.onUserLogoutHandler}
                addToNightEvent={(value)=>this.onaddUserToNightEventHandler}
                removeFromNightEvent={(value)=>this.onremoveUserFromNightEventHandler(value)}
                nightSearchItems={(value)=>this.onSearchItemsHandler(value)}
                nightConnectUser={(value)=>this.onLoginRegisterHandler(value)}/>
        );
    }
}
//region redux connect
const mapStateToProps = state => {
    return {
        items: state.night.items,
        isError: state.night.onError, 
        errorMessageApp: state.night.errorMessage,
        loggedIn:state.night.nightisLoggedin,
        loginData:state.night.nightuserInfo,
        tokenYelp:state.night.yelpToken
    };

};
const mapDispatchToProps = dispatch => {
    return {
        generateToken:(value)=>{
            dispatch(fetchAuthToken(value));
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
        resetError:(value)=>{
            dispatch(resetNightAppError(value));
        },
        exitNight:(value)=>{
            dispatch(nightExit(value));
        },
        setLogin:(value)=>{
            dispatch(authenticateServer(value));
        },
        setRegistry:(value)=>{
            dispatch(registerServer(value));
        },
        unpluguser:(value)=>{
            dispatch(disconnectUser(value));
        }
    };
};
//endregion
export default connect(mapStateToProps, mapDispatchToProps)(NightlifeApp);