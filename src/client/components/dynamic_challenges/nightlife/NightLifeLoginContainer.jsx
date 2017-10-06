import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as cryptoModule from 'bcrypt-nodejs';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {Tabs,Tab} from 'material-ui/Tabs';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import '../../../../Assets/stylesheets/nightApp.scss';
class NightLifeLoginContainer extends Component{
    /**
     * component constructor
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.state={
            openDrawer:false,
            tabValue:'Login',
            email:'',
            password:'',
            retype_pwd:'',
            chipdata:[]
        };
        this.styles = {
            chip:
             {
                 margin: 4,
             },
             wrapper: {
                 display: 'flex',
                flexWrap: 'wrap',
            },
        };
    }
    /**
     * controlled event handler function
     */
    openCloseDrawer = () => {
        //e.preventDefault();
        this.setState({openDrawer: !this.state.openDrawer});
    }
   
    cancelPostForm=()=>{
        
        return false;
    }
    handleChangeTab=()=>{
        this.setState({tabValue:this.state.tabValue==='Login'?'Signup':'Login'});
    }
    handleLogout=()=>{
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
    handleKeys=(e)=>{
        if (e.key==='Enter'){
            e.preventDefault();
            this.handleLoginRegisterRequest();
        }
    }
    /**
     * function to render the content of the drawer
     */
    addChips=()=>{
        if (this.props.dataItems.length){
            const chipInState=this.state.chipdata;
            
            for (let resultItem of this.props.dataItems){
                for (let resultItemSearch of resultItem.searchResults.results){
                    
                    if (!chipInState.length){
                        chipInState.push(
                            {
                                key:`chip_${resultItemSearch.category}`,
                                label:resultItemSearch.category
                            }
                        );
                    }
                    else{
                        let itemStored= chipInState.find(x=>x.label===resultItemSearch.category);
                        if(!itemStored){
                            chipInState.push(
                                {
                                    key:`chip_${resultItemSearch.category}`,label:resultItemSearch.category
                                }
                            );
                        }
                    }
                }
            }
        }
    }
    renderChips=(item)=>{
        return(
            <Chip key={item.key}
            style={this.styles.chip}>
                {item.label}
            </Chip>
        );
    }
    renderDrawerContent=()=>{
        if (this.props.islogged){
            this.addChips();
            
            return (
                <div>
                    <h3 className="textLoggedIn">Logged in as :</h3>
                    <h4 className="textLoggedIn">{this.props.userInformation.email}</h4>
                    {/* <button type="button" className="btn btn-link" onClick={this.handleLogout}>Logout</button> */}
                    <FlatButton label="Logout" onClick={this.handleLogout} primary fullWidth/>
                    <hr/>
                    <div style={this.styles.wrapper}>
                        {
                            this.state.chipdata.map(this.renderChips,this)
                        }
                    </div>
                </div>
                
            );
        }
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
   /**
    * render function for the component
    */
    render(){
        return(
            <div className={this.state.openDrawer?'containerTriangleExpanded':'containerTriangleDrawer'}>
                    <svg onClick={this.openCloseDrawer} width="100" height="100">
                        <polygon points="0 0, 0 100, 100 0" className="triangle" />    
                    </svg>
                    <Drawer 
                        open={this.state.openDrawer}
                        width={250}>
                        {this.renderDrawerContent()}
                    </Drawer>
                </div>
        );
    }
}
NightLifeLoginContainer.propTypes={
    dataItems:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
    islogged:PropTypes.bool.isRequired,
    loginreg:PropTypes.func.isRequired,
    userLogout:PropTypes.func.isRequired,
    userInformation:PropTypes.object.isRequired
};
export default NightLifeLoginContainer;