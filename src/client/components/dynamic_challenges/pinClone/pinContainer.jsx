import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';
import PinList from './pinList';
import PinWallSelector from './pinWallSelector';
import PinLogin from './pinLogin';
import pinAdd from './PinAdd';
import PinView from './pinViewer';
import '../../../../Assets/stylesheets/pinsApp.scss';

class PinContainer extends Component{

    constructor(props){
        super(props);
        this.state={
            isadding:false,
            isImageView:false,
            selectedImage:{},
            hideShowLogin:false,
            snackMessage:'',
            snackOpen:false
        };
       
    }
    showHideLogin=()=>{
        this.setState({hideShowLogin:!this.state.hideShowLogin});
    }
    onresetError=()=>{
        this.props.resetErrorApp();
    }
    voteImage=value=>{
        this.props.castImageVote(value);
        this.setState({snackOpen:!this.state.snackOpen, snackMessage:'The vote was cast on the image'});
    }
    handleCloseSnack=()=>{
        this.setState({snackOpen:!this.state.snackOpen});
    }
    
    getAllWalls=()=>{
        this.props.getAllWalls();
    }
    wallSelector=value=>{
        this.props.selectWall(value);
    }
    pinAdd=()=>{
        this.setState({isadding:true});
    }
    cancelAdd=()=>{
        this.setState({isadding:false});
    }
    injectPin=(value)=>{
        this.props.addPinUserWall(value);
    }
    enableDummyUser=()=>{
        this.props.setDummyLogin();
    }
    handleImagePreview=value=>{
        
        this.setState({isImageView:true,selectedImage:value});
    }
    handleExitViewer=()=>{
        this.setState({isImageView:false,selectedImage:{}});
    }
    removePinData=value=>{
        this.props.deletePin(value);
    }
    renderNormal(){
        const {isadding,isImageView,selectedImage,snackOpen,snackMessage,hideShowLogin}=this.state;
        const {isLoggedIn,pindata,selectedWall,pinUserInfo}= this.props;

        if (isadding){
            return (
                <pinAdd userInfo={pinUserInfo.id} cancelAdd={this.cancelAdd} addPin={this.injectPin}/>
            );
        }
        if (isImageView){
            return (
                <PinView 
                    isUserLogged={isLoggedIn}
                    imageInfo={selectedImage} 
                    exitView={this.handleExitViewer} 
                    voteOnImage={this.voteImage}
                    removePinWall={this.removePinData}
                    userInformation={pinUserInfo}/>
            );
        }
        return (
           <div>
               <PinLogin islogged= {isLoggedIn}
                        userLogout={this.props.disconnectUser}
                        userInformation={pinUserInfo} 
                        showLogin={this.showHideLogin}
                        hasLoginNeeds={hideShowLogin} 
                        addPinWall={this.pinAdd}
                        enableDummyLogin={this.enableDummyUser}/>
                {
                    pindata.name?<PinWallSelector wallname={selectedWall?'':pindata.name} allwallsview={this.getAllWalls}/>:<div/>
                }
                <PinList 
                    castImageVote={this.voteImage}  
                    viewSelectedWall={this.wallSelector}
                    wallData={selectedWall?selectedWall:pindata}
                    imageSelector={this.handleImagePreview}
                />
                <Snackbar open={snackOpen} message={snackMessage} autoHideDuration={4000}
                onRequestClose={this.handleCloseSnack}/>
           </div>
        );
    }
    renderPreload(){
        return(
            <div className="preloaderpos">
                <div className="textPin">
                    setting up the for you...please hold
                </div>
                <div className="progressPos">
                    <CircularProgress size={80} thickness={5} />
                </div>
            </div>
        );
    }
    render(){
        const {isAppError,errorMessageApp,isSearching}= this.props;
        const actionsDialog = [
            <FlatButton key="dialogError_nightLife"
                label="Ok"
                primary
                onTouchTap={this.onresetError}
            />
        ];
        return(
            
                <div className="container-fluid" key="containerpinApp">
                    <Dialog key="errorDialog"
                            actions={actionsDialog}
                            modal={false}
                            open={isAppError}
                            onRequestClose={this.onresetError}>
                        <h3>Ups!!!!<br/> Something went wrong or someone did something wrong!<br/>Check out the problem bellow</h3>
                        <br/>
                        <h4>{errorMessageApp}</h4>
                    </Dialog>
                    <AppHeader appName="Supercalifragilistic Pin Collector" appStyle="pins" showLogin={this.showHideLogin} hasLoginNeeds/>
                    {isSearching?this.renderPreload():this.renderNormal()}
                    <AppFooter appName="pins" lightordark/>
                </div>  
        );
    }
}
PinContainer.propTypes={
    isSearching:PropTypes.bool.isRequired,
    pindata:PropTypes.object.isRequired,
    pinUserInfo:PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        twitter_token: PropTypes.string.isRequired,
        twittername: PropTypes.string.isRequired
    }).isRequired,
    selectedWall:PropTypes.shape({
        idwall:PropTypes.string,
        name:PropTypes.string,
        wallcreatorInfo:{
            iduser:PropTypes.string,
            wallcreator:PropTypes.string
        },
        images:PropTypes.arrayOf(PropTypes.shape({
            idimage:PropTypes.string,
            nameofimage:PropTypes.string,
            imagelink:PropTypes.string,
            numberstars:PropTypes.number
        }))
    }),
    isLoggedIn:PropTypes.bool.isRequired,
    errorMessageApp:PropTypes.string.isRequired,
    isAppError:PropTypes.bool.isRequired,
    resetErrorApp:PropTypes.func.isRequired,
    castImageVote:PropTypes.func.isRequired,
    addPinUserWall:PropTypes.func.isRequired,
    deletePin:PropTypes.func.isRequired,
    getAllWalls:PropTypes.func.isRequired,
    selectWall:PropTypes.func.isRequired,
    disconnectUser:PropTypes.func,
    setDummyLogin:PropTypes.func
};
export default PinContainer;