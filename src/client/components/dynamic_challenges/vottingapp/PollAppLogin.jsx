import React, { Component } from 'react';
import PropTypes from'prop-types';
import * as cryptoModule from 'bcrypt-nodejs';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import {Tabs,Tab} from 'material-ui/Tabs';
import {
    votesTwitterLoginLocalserver,
    votesTwitterLoginExternalServer
} from '../../../../common/constants/ApiEndPoints';
import VoteButton from './VotingButton';
class PollAppLogin extends Component{
    constructor(props){
        super(props);
        this.state={
            openDrawer:false,
            email:'',
            tabValue:'Login',
            password:'',
            userFullName:'',
            local:false,
            facebook:false,
        };
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.hasLoginNeeds!==this.props.hasLoginNeeds){
            this.openCloseDrawer();
        }   
    }
    openCloseDrawer = () => {
        this.setState({openDrawer: !this.state.openDrawer});
    }
    cancelPostForm=()=>{
        return false;
    }
    handleChangeTab=()=>{
        this.setState({tabValue:this.state.tabValue==='Login'?'Signup':'Login'});
    }
    handleLogout=()=>{
        const {isEdit}= this.state;
        if (isEdit){
            this.setState({isEdit:false});
        }
        this.setState({email:'',password:''});
        this.props.userLogout();
    }
    encrypwd=()=>{
        return cryptoModule.hashSync(this.state.password);
    }
    handleLoginRegisterRequest=()=>{
        const {tabValue,password,retype_pwd}= this.state;
        const {loginreg}= this.props;
        if (tabValue==='Login'){
            loginreg({isLogin:true,email:this.state.email,password:this.state.password});
        }
        else{
            if (password!==retype_pwd){
                // do something here 
                return;
            }
            loginreg({isLogin:false,email:this.state.email,password:this.encrypwd()});
        }
    }
    handleKeys=(e)=>{
        if (e.key === 'Enter'){
            e.preventDefault();
            this.handleLoginRegisterRequest();
        }
    }
    setEmail=(e)=>{
        this.setState({email:e.target.value});
    }
    setPassword=(e)=>{
        this.setState({password:e.target.value});
    }
    
    addPoll=()=>{
        this.props.pollStart();
    }
    handleLocalCancel=()=>{
        this.setState({openDrawer: !this.state.openDrawer,local:false});
    }
    
    setLocalLogin=()=>{
        this.setState({local:true});
    }
    renderLogin=()=>{
        const {userInformation}= this.props;
        return (
            <div>
                <h3 className="textLoggedIn">Logged in as :</h3>
                <h4 className="textLoggedIn">{userInformation.name?userInformation.name:userInformation.email}</h4>
                
                <div className="posButtonsLogin">
                    <VoteButton 
                        key="vButtonDC" 
                        iconInfo={"dc"} 
                        isDisabled={false}
                        buttonText={"Disconnect"} 
                        clickAction={this.handleLogout} 
                        hasHref={false} 
                        hasSvg={false}/>
                    <hr/>
                    <VoteButton 
                        key="vButtonAddPoll" 
                        iconInfo={"addpoll"}
                        isDisabled={false}
                        buttonText={"Add Poll"} 
                        clickAction={this.addPoll} 
                        hasHref={false} 
                        hasSvg={false}/>
                </div>
            </div>
        );
    }
    
    renderLocalLoginRegister=()=>{
        const {tabValue,email,password,retype_pwd}= this.state;
        return(
            <div>
                <Tabs value={tabValue} onChange={this.handleChangeTab}>
                    <Tab label="Login" value="Login">
                        <h4> Insert your credentials bellow</h4>
                        <form onSubmit={this.cancelPostForm}>
                            <div className="form-group">
                                <TextField key="inputBookLoginEmail" 
                                    hintText="Set your email here" 
                                    floatingLabelText="Email"
                                    floatingLabelFixed
                                    value={email}
                                    onChange={this.setEmail}/>
                                
                            </div>
                            <div className="form-group">
                                <TextField key="inputBookLoginPassword" 
                                        hintText="Set your password here" 
                                        floatingLabelText="Password"
                                        floatingLabelFixed
                                        type="password"
                                        value={password}
                                        onChange={this.setPassword}
                                        onKeyPress={this.handleKeys}/>
                            </div>
                            <div className="form-group">
                                <VoteButton key="btnLogin"
                                     buttonText={"Login"} 
                                     iconInfo={"local"}
                                     clickAction={this.handleLoginRegisterRequest} 
                                     hasHref={false} 
                                     hasSvg={false}
                                     isDisabled={false}/>
                               
                                <VoteButton key="btnLoginCancel"
                                    buttonText={"Cancel"}
                                    iconInfo={"cancel"}
                                    clickAction={this.handleLocalCancel}
                                    hasHref={false}
                                    hasSvg={false}
                                    isDisabled={false}/>
                                
                                
                            </div>
                        
                        </form>
                    </Tab>
                    <Tab label="Signup" value="Signup">
                        <form onSubmit={this.cancelPostForm}>
                            <div className="form-group">
                                <TextField key="inputBookRegisterEmail"
                                    hintText="Set your email here"
                                    floatingLabelFixed
                                    floatingLabelText="Email"
                                    value={email}
                                    onChange={this.setEmail}/>
                            </div>
                            <div className="form-group">
                                <TextField key="inputBookRegisterPassword"
                                    hintText="Set your password here"
                                    floatingLabelFixed
                                    floatingLabelText="Password"
                                    type="password"
                                    value={password}
                                    onChange={this.setPassword}/>
                                <TextField key="RetypeinputBookRegisterPassword"
                                    hintText="Re-type your password here"
                                    floatingLabelFixed
                                    type="password"
                                    floatingLabelText="Re-type Password"
                                    value={retype_pwd}
                                    onChange={this.setConfirmationPwd}/>
                                    
                            </div>
                            <div className="form-group">
                                <VoteButton key="btnLoginRegister" 
                                    buttonText={"Register"} 
                                    iconInfo={"local"} 
                                    hasHref={false}
                                    hasSvg={false}
                                    isDisabled={false}/>
                                <VoteButton key="btnCancelRegister" 
                                    hasHref={false} 
                                    hasSvg={false}
                                    isDisabled={false}
                                    iconInfo={"cancel"} 
                                    buttonText={"Cancel"} 
                                    clickAction={this.openCloseDrawer}/>
                            </div>
                        </form>
                    </Tab>
                </Tabs>
            </div>
        );
    }
    
    
    rendernoLogin=()=>{

        const {local}= this.state;
       
        if (local){
            
            return this.renderLocalLoginRegister();
        }
        return(
            <div>
                <h4>Choose how you want to login</h4>
                <div className="votingLoginButtonPos">
                    <VoteButton 
                        buttonText={"Local"} 
                        iconInfo={"local"} 
                        isDisabled={false}
                        clickAction={this.setLocalLogin} 
                        hasHref={false} 
                        hasSvg={false}/>
                    <hr/>
                    <VoteButton buttonText={"Twitter"}
                        hasHref
                        isDisabled={false}
                        hrefUrl={process.env.NODE_ENV!=='production'?votesTwitterLoginLocalserver:votesTwitterLoginExternalServer}
                        hasSvg
                        svgInfo={{viewBoxData:"0 0 800 800",svgData:"M679 239s-21 34-55 57c7 156-107 329-314 329-103 0-169-50-169-50s81 17 163-45c-83-5-103-77-103-77s23 6 50-2c-93-23-89-110-89-110s23 14 50 14c-84-65-34-148-34-148s76 107 228 116c-22-121 117-177 188-101 37-6 71-27 71-27s-12 41-49 61c30-2 63-17 63-17z"}}/>
                </div>
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
            //  <div className={this.state.openDrawer?'containerTriangleExpanded':'containerTriangleDrawer'}>
            //         <Drawer 
            //             open={this.state.openDrawer}
            //             containerStyle={{height: 'calc(100% - 64px)', top: 64,left:10}}
            //             width={this.state.isEdit?450:250}>
            //             {this.props.islogged?this.renderLogin():this.rendernoLogin()}
            //         </Drawer>
            //     </div>
        );
    }
}
PollAppLogin.propTypes={
    islogged:PropTypes.bool.isRequired,
    loginreg:PropTypes.func.isRequired,
    userLogout:PropTypes.func.isRequired,
    userInformation:PropTypes.shape({
        id:PropTypes.string.isRequired,
        email:PropTypes.string.isRequired,
        password:PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,
        
    }).isRequired,
    hasLoginNeeds:PropTypes.bool.isRequired,
    pollStart:PropTypes.func.isRequired
};
export default PollAppLogin;