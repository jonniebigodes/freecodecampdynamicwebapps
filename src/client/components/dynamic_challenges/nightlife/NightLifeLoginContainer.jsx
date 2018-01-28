import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import * as cryptoModule from 'bcrypt-nodejs';
import Drawer from 'material-ui/Drawer';
import {Tabs,Tab} from 'material-ui/Tabs';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import '../../../../Assets/stylesheets/nightApp.scss';
import FccDynButton from '../../challengesUIComponents/FccDynButton';

import {fccUtilities} from'../../../../common/Utils/Utilities';
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
    componentWillMount(){
        this.setState({openDrawer:this.props.hasLoginNeeds});
    }
    componentWillReceiveProps(nextProps){
        // console.log('====================================');
        // console.log(`componentWillRecieveProps current prop:${this.props.hasLoginNeeds} next Props:${nextProps.hasLoginNeeds}`);
        // console.log('====================================');
        if (nextProps.hasLoginNeeds!==this.props.hasLoginNeeds){
            this.openCloseDrawer();
        }   
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
    // encrypwd=()=>{
        

    //     return cryptoModule.hashSync(this.state.password);
    // }
    handleLoginRegisterRequest=()=>{
        const {email,password,retype_pwd}=this.state;
        // console.log('====================================');
        // console.log(`data enc utils:${fccUtilities.encriptPassword(password)}`);
        // console.log('====================================');
        if (this.state.tabValue==='Login'){
            this.props.loginreg({isLogin:true,email:email,password:password});
        }
        else{
            if (password!==retype_pwd){
                return;
            }
            this.props.loginreg({isLogin:false,email:email,password:fccUtilities.encriptPassword(password)});
        }

        setTimeout(() => {
            this.setState({email:'',password:'',retype_pwd:''});
        }, 2500);
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
        const {numberItems,dataItems}= this.props;
        const {chipdata}= this.state;
        if (numberItems){
           
            for (const resultItem in dataItems){
                if (!chipdata.length){
                    chipdata.push({
                        key:`chip_${dataItems[resultItem].category}`,
                        label:dataItems[resultItem].category
                    });
                }
                let isStored= chipdata.find(x=>x.label===dataItems[resultItem].category);
                if (!isStored){
                    chipdata.push({
                        key:`chip_${dataItems[resultItem].category}`,
                        label:dataItems[resultItem].category
                    });
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
        const {tabValue,email,password,retype_pwd}=this.state;
        if (this.props.islogged){
            this.addChips();
            
            return (
                <div className="containerLoggedIn">
                    <h3 className="textLoggedIn">Logged in as :</h3>
                    <h4 className="textLoggedIn">{this.props.userInformation.email}</h4>
                    <FccDynButton key={'btnLogout'}
                            hasHref={false}
                            hasSvg={false}
                            isDisabled={false}
                            buttonText={'Disconnect'} 
                            iconInfo={'dc'}
                            clickAction={this.handleLogout}/>
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
                                    value={password}
                                    onChange={this.setPassword}/>
                                <TextField key="RetypeinputBookRegisterPassword"
                                    hintText="Re-type your password here"
                                    floatingLabelFixed
                                    floatingLabelText="Re-type Password"
                                    value={retype_pwd}
                                    onChange={this.setConfirmationPwd}/>
                            </div>
                        </form>
                    </Tab>
                </Tabs>
                <div className="containerButtonsLogin">
                    <FccDynButton key={'btnRegisterLogin'}
                            hasHref={false}
                            hasSvg={false}
                            isDisabled={false}
                            buttonText={tabValue=='Login'?"Login":"Create"} 
                            iconInfo={'register'}
                            clickAction={this.handleLoginRegisterRequest}/>
                    <FccDynButton key={'btnRegisterCancel'}
                            hasHref={false}
                            hasSvg={false}
                            isDisabled={false}
                            buttonText={'Cancel'}
                            iconInfo={'goback'}
                            clickAction={this.openCloseDrawer}/>       
                </div>
                
                
            </div>
        );
        
    }
   /**
    * render function for the component
    */
    render(){
        const{openDrawer}=this.state;
        return(
            <Drawer open={openDrawer}
                    docked={false}
                    onRequestChange={this.openCloseDrawer}>
                    {this.renderDrawerContent()}
            </Drawer>
        );
    }
}
NightLifeLoginContainer.propTypes={
    dataItems:PropTypes.object.isRequired,
    numberItems:PropTypes.number.isRequired,
    islogged:PropTypes.bool.isRequired,
    loginreg:PropTypes.func.isRequired,
    userLogout:PropTypes.func.isRequired,
    userInformation:PropTypes.object.isRequired,
    hasLoginNeeds:PropTypes.bool.isRequired
};
export default NightLifeLoginContainer;