import React, { Component } from 'react';
import {connect} from 'react-redux';
import{
    fetchPinsData,
    disconnectPinApp,
    resetPinAppError,
    requestPins,
    voteOnPin,
    addPinToWall,
    viewSelectedWall,
    viewAllUserWAlls,
    fetchPinSocialInfo,
    setDummyLoginData,
    removePinfromWall,
    pinAppDisconnect
} from '../../../../common/actions/pinAppActions';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PinContainer from './pinContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {dynamicThemes} from '../../../../Assets/styles/challengesThemes';
class PinApp extends Component{
    /**
     * guard methods from the framework
     */
    componentWillMount(){
        injectTapEventPlugin();
    }
    /**
     * guard methods from the framework
     */
    componentDidMount(){
        this.props.reqPins();
        this.props.getPins();
        if (this.props.params.authToken){
            this.props.getPinSocialAuthData(this.props.params.authToken);
        }
    }
    /**
     * guard methods from the framework
     */
    componentWillUnmount(){
        this.props.pinsExit();
    }
    /**
     * class property to handle reset of the app error
     */
    handleResetError=()=>{
        this.props.pinResetError();
    }
    /**
     * class property to handle the vote operation
     * @param {Object} value object containing the information about the pin
     */
    handleVoteCast=value=>{
        this.props.pinVote(value);
    }
    /**
     * class property to handle the wall selection
     * @param {string} value id of the wall
     */
    handleViewSelectedWall=value=>{
        this.props.viewUserWall(value);
    }
    /**
     * class property to get all the walls back
     */
    handleGetAllWalls=()=>{
        this.props.viewAll();
    }
    /**
     * class property to handle user disconnect
     */
    handleDisconnect=()=>{
        this.props.unplugPinApp();
    }
    /**
     * class property to handle the add pin operation
    * @param {Object} value object containing the information about the pin to be added
     */
    handlePinAdd=(value)=>{
        this.props.injectPin(value);
    }
    /**
     * to delete
     */
    makeDummyLogin=()=>{
        this.props.makeDummy();
    }
    /**
     * class property to handle the delete operation
     * @param {Object} value object containing the information about the pin
     */
    handleDelete=value=>{
        this.props.unplugPin(value);
    }
    render(){
        
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(dynamicThemes.pinTheme)}>
                <PinContainer 
                    pindata={this.props.userWallData.idwall!=''?this.props.userWallData:this.props.pinData} 
                    isAppError={this.props.pinAppIsError} 
                    errorMessageApp={this.props.pinAppMessageError}
                    resetErrorApp={this.handleResetError}
                    isSearching={this.props.retrievePinData}
                    castImageVote={this.handleVoteCast}
                    addPinUserWall={this.handlePinAdd}
                    deletePin={this.handleDelete}
                    selectWall={this.handleViewSelectedWall}
                    getAllWalls={this.handleGetAllWalls}
                    isLoggedIn={this.props.pinAppLoggedIn}
                    disconnectUser={this.handleDisconnect}
                    pinUserInfo={this.props.pinAppUserInfo}
                    setDummyLogin={this.makeDummyLogin}/>
            </MuiThemeProvider>
        );
    }
}
const mapStateToProps=state=>{
    return{
        retrievePinData:state.pins.isSearching,
        pinData:state.pins.dataEntities,
        userWallData:state.pins.selectedwall,
        pinAppIsError:state.pins.pinAppOnError,
        pinAppMessageError:state.pins.pinAppErrorMessage,
        pinAppLoggedIn:state.pins.pinisLoggedIn,
        pinAppUserInfo:state.pins.pinUserInfo
    };
};
const mapDispatchToProps=dispatch=>{
    return{
        reqPins:()=>{
            dispatch((requestPins()));
        },
        getPins:()=>{
            dispatch(fetchPinsData());
        },
        viewUserWall:(value)=>{
            dispatch(viewSelectedWall(value));
        },
        viewAll:()=>{
            dispatch(viewAllUserWAlls());
        },
        pinsExit:()=>{
            dispatch(disconnectPinApp());
        },
        pinResetError:()=>{
            dispatch(resetPinAppError());
        },
        pinVote:(value)=>{
            dispatch(voteOnPin(value));
        },
        injectPin:(value)=>{
            dispatch(addPinToWall(value));
        },
        unplugPin:(value)=>{
            dispatch(removePinfromWall(value));
        },
        unplugPinApp:()=>{
            dispatch(pinAppDisconnect());
        },
        getPinSocialAuthData:(value)=>{
            dispatch(fetchPinSocialInfo(value));
        },
        makeDummy:()=>{
            dispatch(setDummyLoginData());
        }
        
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(PinApp);