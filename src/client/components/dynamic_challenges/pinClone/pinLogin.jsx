import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import {
    pintwitterloginexternalserver,
    pintwitterloginlocalserver
} from '../../../../common/constants/ApiEndPoints';
import PinButton from './pinButton';
class PinLogin extends Component{
     /**
      * pin login class constructor
      * @param {*} props 
      */
    constructor(props){
        super(props);
        this.state={
            openDrawer:false,
        };
        
    }
    /**
     * guard method for the framework
     * @param {Object} nextProps next props to be injected on the component
     */
    componentWillReceiveProps(nextProps){
        if (nextProps.hasLoginNeeds!==this.props.hasLoginNeeds){
            this.openCloseDrawer();
        }   
    }
    /**
     * class property to change the state
     *
     */
    openCloseDrawer = () => {
        this.setState({openDrawer: !this.state.openDrawer});
    }
    /**
     * class property to handle the logout
     *
     */
    handleLogout=()=>{
        this.props.userLogout();
    }
    /**
     * class property to handle the pin injections
     *
     */
    addPin=()=>{
        this.props.addPinWall();
    }
    setdummyLogin=()=>{
        this.props.enableDummyLogin();
    }
    /**
     * render function case loggedin
     */
    renderLogin=()=>{
        return (
            <div>
                <h3 className="textLoggedIn">Logged in as</h3>
                <h4 className="textLoggedIn">{this.props.userInformation.name?this.props.userInformation.name:this.props.userInformation.email}</h4>
                <div className="posButtonsLogin">
                   
                    <PinButton iconInfo={"dc"} buttonText={"Disconnect"} clickAction={this.handleLogout} hasHref={false} hasSvg={false}/>
                    <hr/>
                    <PinButton iconInfo={"addPin"} buttonText={"Add Pin"} clickAction={this.addPin} hasHref={false} hasSvg={false}/>
                </div>
            </div>
        );
    }
    /**
     * render function case no login
     */
    rendernoLogin=()=>{
        return(
            <div>
                 <h4>Click bellow to authenticate yourself</h4>
                 <div className="posButtonsLogin">
                    <PinButton buttonText={"Connect"} 
                    hasHref 
                    hrefUrl={process.env.NODE_ENV!=='production'?pintwitterloginlocalserver:pintwitterloginexternalserver}
                    hasSvg 
                    svgInfo={{viewBoxData:"0 0 800 800",svgData:"M679 239s-21 34-55 57c7 156-107 329-314 329-103 0-169-50-169-50s81 17 163-45c-83-5-103-77-103-77s23 6 50-2c-93-23-89-110-89-110s23 14 50 14c-84-65-34-148-34-148s76 107 228 116c-22-121 117-177 188-101 37-6 71-27 71-27s-12 41-49 61c30-2 63-17 63-17z"}}/>
                    
                 </div>
                 
                
                {/* <RaisedButton label="Dummy"
                            primary
                            icon={<FontIcon className="muidocs-icon-custom-github"/>}
                            onClick={this.setdummyLogin}
                            fullWidth/> */}
            </div>
        );
    }
    render(){
        const{openDrawer}=this.state;
        const {islogged}= this.props;
        return(
            <Drawer
            open={openDrawer} docked={false} onRequestChange={this.openCloseDrawer}>
                {islogged?this.renderLogin():this.rendernoLogin()}
            </Drawer>
            
        );
    }
}
PinLogin.propTypes={
    islogged:PropTypes.bool.isRequired,
    userLogout:PropTypes.func.isRequired,
    userInformation:PropTypes.shape({
        id:PropTypes.string.isRequired,
        email:PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,
        twitter_token:PropTypes.string.isRequired,
        twittername:PropTypes.string.isRequired,
        
    }).isRequired,
    hasLoginNeeds:PropTypes.bool.isRequired,
    addPinWall:PropTypes.func.isRequired,
    enableDummyLogin:PropTypes.func
};
export default PinLogin;