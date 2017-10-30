import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as cryptoModule from 'bcrypt-nodejs';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {Tabs,Tab} from 'material-ui/Tabs';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
class BookAppLoginContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            openDrawer:false,
            tabValue:'Login',
            email:'',
            password:'',
            retype_pwd:'',
            istoggled:false,
            isEdit:false,
            userFullName:'',
            userCity:'',
            userCountryState:'',
            userCountry:'',

        };
        
    }
    componentWillMount(){
        this.setState({openDrawer:this.props.hasLoginNeeds});
    }
    componentWillReceiveProps(nextProps){
        console.log('====================================');
        console.log(`componentWillRecieveProps current prop:${this.props.hasLoginNeeds} next Props:${nextProps.hasLoginNeeds}`);
        console.log('====================================');
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
    setEmail=(e)=>{
        
        this.setState({email:e.target.value});
    }
    setPassword=(e)=>{
        this.setState({password:e.target.value});
    }
    setConfirmationPwd=(e)=>{
        this.setState({retype_pwd:e.target.value});
    }
    handleToggleChange=()=>{
        this.setState({istoggled:!this.state.istoggled});
        this.props.themeChange();
    }
    setBookAdd=()=>{
        this.props.bookinject();
    }
    handleKeys=(e)=>{
        if (e.key === 'Enter'){
            e.preventDefault();
            this.handleLoginRegisterRequest();
        }
    }
    setFullName=(e)=>{
        this.setState({userFullName:e.target.value});
    }
    setCity=(e)=>{
        this.setState({userCity:e.target.value});
    }
    setCountry=(e)=>{
        this.setState({userCountry:e.target.value});
    }
    setCountryState=(e)=>{
        this.setState({userCountryState:e.target.value});
    }
    changeToEdit=()=>{
        this.setState({isEdit:!this.state.isEdit});
    }
    onEditHandler=()=>{
        if (this.state.isEdit){
            this.props.changeInfo(
                {
                    userToken:this.props.userInformation.id,
                    fullusername:this.state.userFullName!=''?this.state.userFullName:this.props.userInformation.name,
                    city:this.state.userCity!=''?this.state.userCity:this.props.userInformation.city,
                    country:this.state.userCountry!=''?this.state.userCountry:this.props.userInformation.country,
                    countrystate:this.state.userCountryState!=''?this.state.userCountryState:this.props.userInformation.countrystate
                });
            this.setState({userCity:'',userCountry:'',userCountryState:'',userFullName:''});
        }
        this.changeToEdit();  
        
        
    }
    renderLogin=()=>{
        return (
            <div>
                <h3 className="textLoggedIn">Logged in as :</h3>
                <h4 className="textLoggedIn">{this.props.userInformation.name?this.props.userInformation.name:this.props.userInformation.email}</h4>
                {/* <button type="button" className="btn btn-link" onClick={this.handleLogout}>Logout</button> */}
                <FlatButton label="Logout" onClick={this.handleLogout} primary fullWidth/>
                <hr/>
                <form onSubmit={this.cancelPostForm}>
                        <div className="form-group">
                            <TextField hintText="Set your full name here"
                            floatingLabelText="Full Name"
                            floatingLabelFixed 
                            onChange={this.setFullName}
                            disabled={!this.state.isEdit}
                            value={this.state.isEdit?this.state.userFullName:this.props.userInformation.name}/>
                        </div>
                        <div className="form-group">
                                <TextField hintText="Set your city name here"
                                floatingLabelText="City"
                                floatingLabelFixed 
                                onChange={this.setCity}
                                disabled={!this.state.isEdit}
                                value={this.state.isEdit?this.state.userCity:this.props.userInformation.city}/>
                                
                        </div>
                        <div className="form-group">
                                <TextField hintText="Set your state here"
                                    floatingLabelText="State"
                                    floatingLabelFixed
                                    value={this.state.isEdit?this.state.userCountryState:this.props.userInformation.countrystate}
                                    disabled={!this.state.isEdit}
                                    onChange={this.setCountryState}/>
                                
                        </div>
                        <div className="form-group">
                                <TextField hintText="Set your country here"
                                    floatingLabelText="Country"
                                    floatingLabelFixed
                                    value={this.state.isEdit?this.state.userCountry:this.props.userInformation.country}
                                    disabled={!this.state.isEdit}
                                    onChange={this.setCountry}/>
                        </div>
                        <div className="form-group">
                            <FlatButton label={this.state.isEdit===false?'Edit':'Save Changes'}
                                primary
                                onClick={this.onEditHandler} fullWidth/>
                            <FlatButton label="Cancel" secondary onClick={this.changeToEdit} fullWidth/>
                            
                        </div>
                    
                    </form>
                <hr/>
                <Toggle
                    label={this.state.istoggled?'Dark':'Light'}
                    onToggle={this.handleToggleChange}/>
                <FlatButton label="Add Book" onClick={this.setBookAdd} primary fullWidth/>
            </div>
            
        );
    }
    rendernoLogin=()=>{
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
                                
                                <FlatButton label="Cancel" secondary onClick={this.openCloseDrawer} fullWidth/>
                                
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
                                    value={this.state.password}
                                    onChange={this.setPassword}/>
                                <TextField key="RetypeinputBookRegisterPassword"
                                    hintText="Re-type your password here"
                                    floatingLabelFixed
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
    
    render(){
        
        return(
            <div className={this.state.openDrawer?'containerTriangleExpanded':'containerTriangleDrawer'}>
                    {/* <svg onClick={this.openCloseDrawer} width="100" height="100">
                        <polygon points="0 0, 0 100, 100 0" className="triangle" />    
                    </svg> */}
                    <Drawer 
                        open={this.state.openDrawer}
                        containerStyle={{height: 'calc(100% - 64px)', top: 64,left:10}}
                        width={this.state.isEdit?450:265}>
                        {this.props.islogged?this.renderLogin():this.rendernoLogin()}
                    </Drawer>
                </div>
        );
    }
}
BookAppLoginContainer.propTypes={
    islogged:PropTypes.bool.isRequired,
    loginreg:PropTypes.func.isRequired,
    userLogout:PropTypes.func.isRequired,
    userInformation:PropTypes.object.isRequired,
    themeChange:PropTypes.func.isRequired,
    bookinject:PropTypes.func.isRequired,
    changeInfo:PropTypes.func.isRequired,
    hasLoginNeeds:PropTypes.bool.isRequired
};
export default BookAppLoginContainer;