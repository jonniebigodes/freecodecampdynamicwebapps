import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as cryptoModule from 'bcrypt-nodejs';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {Tabs,Tab} from 'material-ui/Tabs';
import Chip from 'material-ui/Chip';
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
    openCloseDrawer = (e) => {
        e.preventDefault();
        this.setState({openDrawer: !this.state.openDrawer});
    }
   
    cancelPostForm=(e)=>{
        e.preventDefault();
        return false;
    }
    handleChangeTab=(value)=>{
        this.setState({tabValue:value});
    }
    handleLogout=()=>{
        this.props.userLogout();
    }
    

    encrypwd=()=>{
        return cryptoModule.hashSync(this.state.password);
    }
    handleLoginRegisterRequest=(e)=>{

        e.preventDefault();
        if (this.state.tabValue==='Login'){
            this.props.loginreg({isLogin:true,email:this.state.email,password:this.state.password})
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
    /**
     * function to render the content of the drawer
     */
    addChips=()=>{
        if (this.props.dataItems.length){
            const chipInState=this.state.chipdata;
            
            for (let resultItem of this.props.dataItems){
                for (let resultItemSearch of resultItem.searchResults.results){
                    console.log(resultItemSearch.category);
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
                    <FlatButton label="Logout" onClick={this.handleLogout} primary={true} fullWidth={true}/>
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
                        <form onSubmit={(e)=>this.cancelPostForm(e)}>
                            <div className="form-group">
                                <label for="inputNightLoginEmail">Email address </label>
                                <input type="email" className="form-control" id="inputNightLoginEmail" key="inputNightLoginEmail" placeholder="Email" onChange={(e)=>this.setEmail(e)}/>
                            </div>
                            <div className="form-group">
                                    <label for="inputNightLoginPassword">Password</label>
                                    <input type="password" className="form-control" id="inputNightLoginPassword" key="inputNightLoginPassword" placeholder="Password"
                                    onChange={(e)=>this.setPassword(e)}/>
                                    
                            </div>
                            <div className="form-group">
                                <RaisedButton label="login"
                                    primary={true}
                                    icon={<FontIcon className="muidocs-icon-custom-github"/>}
                                    onClick={(e)=>this.handleLoginRegisterRequest(e)} fullWidth={true}/>
                                
                                <FlatButton label="Cancel" secondary={true} onClick={(e)=>this.openCloseDrawer(e)} fullWidth={true}/>
                                
                            </div>
                        
                        </form>
                    </Tab>
                    <Tab label="Signup" value="Signin">
                        <form onSubmit={(e)=>this.cancelPostForm(e)}>
                            <div className="form-group">
                                <label for="inputNightLoginEmail">Email address </label>
                                <input type="email" className="form-control" id="inputNightRegisterEmail" key="inputNightRegisterEmail" placeholder="Email" onChange={(e)=>this.setEmail(e)}/>
                            </div>
                            <div className="form-group">
                                    <label for="inputNightLoginPassword">Password</label>
                                    <input type="password" className="form-control" id="inputNightRegisterPassword" key="inputNightRegisterPassword" placeholder="Password"
                                    onChange={(e)=>this.setPassword(e)}/>
                                    <label for="inputNightLoginPassword">Re-type Password</label>
                                    <input type="password" className="form-control" id="rinputNightRegisterPassword" key="rinputNightRegisterPassword" placeholder="Password" onChange={(e)=>this.setConfirmationPwd(e)}/>
                            </div>
                            <div className="form-group">
                                <RaisedButton label="Register"
                                    primary={true}
                                    icon={<FontIcon className="muidocs-icon-custom-github"/>}
                                    onClick={(e)=>this.handleLoginRegisterRequest(e)} fullWidth={true}/>
                                
                                <FlatButton label="Cancel" onClick={(e)=>this.openCloseDrawer(e)} fullWidth={true}/>
                            </div>
                        </form>
                    </Tab>
                </Tabs>
            </div>);
        
    }
   /**
    * render function for the component
    */
    render(){
        return(
            <div className={this.state.openDrawer?'containerTriangleExpanded':'containerTriangleDrawer'}>
                    <svg onClick={(e)=>this.openCloseDrawer(e)} width="100" height="100">
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
NightLifeLoginContainer.props={
    dataItems:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
    islogged:PropTypes.bool.isRequired,
    loginreg:PropTypes.func.isRequired,
    userLogout:PropTypes.func.isRequired,
    userInformation:PropTypes.object.isRequired
};
export default NightLifeLoginContainer;