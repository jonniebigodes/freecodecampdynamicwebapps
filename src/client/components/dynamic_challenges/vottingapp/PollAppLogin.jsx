import React, { Component } from 'react';
import PropTypes from'prop-types';
import * as cryptoModule from 'bcrypt-nodejs';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import {Tabs,Tab} from 'material-ui/Tabs';
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
        if (this.state.isEdit){
            this.setState({isEdit:false});
        }
        this.setState({email:'',password:''});
        this.props.userLogout();
    }
    encrypwd=()=>{
        return cryptoModule.hashSync(this.state.password);
    }
    handleLoginRegisterRequest=()=>{

        if (this.state.tabValue==='Login'){
            this.props.loginreg({isLogin:true,email:this.state.email,password:this.state.password});
        }
        else{
            if (this.state.password!==this.state.retype_pwd){
                return;
            }
            this.props.loginreg({isLogin:false,email:this.state.email,password:this.encrypwd()});
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
        return (
            <div>
                <h3 className="textLoggedIn">Logged in as :</h3>
                <h4 className="textLoggedIn">{this.props.userInformation.name?this.props.userInformation.name:this.props.userInformation.email}</h4>
                {/* <button type="button" className="btn btn-link" onClick={this.handleLogout}>Logout</button> */}
                <FlatButton label="Logout" onClick={this.handleLogout} primary fullWidth/>
                <hr/>
                <FlatButton label="Add New Poll" onClick={this.addPoll} primary fullWidth/>
            </div>
        );
    }
    
    renderLocalLoginRegister=()=>{
        return(
            <div>
                <Tabs value={this.state.tabValue} onChange={this.handleChangeTab}>
                    <Tab label="Login" value="Login">
                        <h4> Insert your credentials bellow</h4>
                        <form onSubmit={this.cancelPostForm}>
                            <div className="form-group">
                                <TextField key="inputBookLoginEmail" 
                                    hintText="Set your email here" 
                                    floatingLabelText="Email"
                                    floatingLabelFixed
                                    value={this.state.email}
                                    onChange={this.setEmail}/>
                                
                            </div>
                            <div className="form-group">
                                <TextField key="inputBookLoginPassword" 
                                        hintText="Set your password here" 
                                        floatingLabelText="Password"
                                        floatingLabelFixed
                                        type="password"
                                        value={this.state.password}
                                        onChange={this.setPassword}
                                        onKeyPress={this.handleKeys}/>
                                    
                                    
                            </div>
                            <div className="form-group">
                                <RaisedButton label="login"
                                    primary
                                    icon={<FontIcon className="muidocs-icon-custom-github"/>}
                                    onClick={this.handleLoginRegisterRequest} fullWidth/>
                                
                                <FlatButton label="Cancel" secondary onClick={this.handleLocalCancel} fullWidth/>
                                
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
                                    value={this.state.email}
                                    onChange={this.setEmail}/>
                            </div>
                            <div className="form-group">
                                <TextField key="inputBookRegisterPassword"
                                    hintText="Set your password here"
                                    floatingLabelFixed
                                    floatingLabelText="Password"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.setPassword}/>
                                <TextField key="RetypeinputBookRegisterPassword"
                                    hintText="Re-type your password here"
                                    floatingLabelFixed
                                    type="password"
                                    floatingLabelText="Re-type Password"
                                    value={this.state.retype_pwd}
                                    onChange={this.setConfirmationPwd}
                                    />
                                    
                            </div>
                            <div className="form-group">
                                <RaisedButton label="Register"
                                    primary
                                    icon={<FontIcon className="muidocs-icon-custom-github"/>}
                                    onClick={this.handleLoginRegisterRequest} fullWidth/>
                                
                                <FlatButton label="Cancel" onClick={this.openCloseDrawer} fullWidth/>
                            </div>
                        </form>
                    </Tab>
                </Tabs>
            </div>
        );
    }
    
    
    rendernoLogin=()=>{
        if (this.state.local){
            return this.renderLocalLoginRegister();
        }
        return(
            <div>
                <h4>Choose how you want to login</h4>
                <RaisedButton label="Local"
                            primary
                            icon={<FontIcon className="muidocs-icon-custom-github"/>}
                            onClick={this.setLocalLogin} fullWidth/>
                <hr/>
                <RaisedButton label="FACEBOOK"
                            primary
                            icon={<FontIcon className="muidocs-icon-custom-github"/>}
                            href="http://localhost:5000/api/login/fb/auth"
                            fullWidth
                            />
                <RaisedButton label="TWITTER"
                            primary
                            icon={<FontIcon className="muidocs-icon-custom-github"/>}
                            href="http://localhost:5000/api/login/votting/twitter/connect"
                            fullWidth/>
            </div>
        );
    }
    render(){
        return(
            <div className={this.state.openDrawer?'containerTriangleExpanded':'containerTriangleDrawer'}>
                    <Drawer 
                        open={this.state.openDrawer}
                        containerStyle={{height: 'calc(100% - 64px)', top: 64,left:10}}
                        width={this.state.isEdit?450:250}>
                        {this.props.islogged?this.renderLogin():this.rendernoLogin()}
                    </Drawer>
                </div>
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