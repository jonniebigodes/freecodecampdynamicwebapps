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
    removePinfromWall
} from '../../../../common/actions/pinAppActions';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PinContainer from './pinContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {dynamicThemes} from '../../../../Assets/styles/challengesThemes';
class PinApp extends Component{
    
    componentWillMount(){
        injectTapEventPlugin();
    }
    componentDidMount(){
        this.props.reqPins();
        this.props.getPins();
        if (this.props.params.authToken){
            this.props.getPinSocialAuthData(this.props.params.authToken);
        }
    }
    componentWillUnmount(){
        this.props.pinsExit();
    }
    handleResetError=()=>{
        this.props.pinResetError();
    }
    handleVoteCast=value=>{
        this.props.pinVote(value);
    }
    handleViewSelectedWall=value=>{
        this.props.viewUserWall(value);
    }
    handleGetAllWalls=()=>{
        this.props.viewAll();
    }
    handleDisconnect=()=>{
        this.props.unplugPinApp();
    }
    handlePinAdd=(value)=>{
        this.props.injectPin(value);
    }
    makeDummyLogin=()=>{
        this.props.makeDummy();
    }
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
            dispatch(disconnectPinApp());
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