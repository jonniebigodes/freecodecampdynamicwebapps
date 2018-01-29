import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import * as cryptoModule from 'bcrypt-nodejs';
import Drawer from 'material-ui/Drawer';
import {Tabs,Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
//import BookButton from './BookButton';
import FccDynButton from '../../challengesUIComponents/FccDynButton';
import {fccUtilities} from '../../../../common/Utils/Utilities';
class BookAppLoginContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            openDrawer:false,
            tabValue:'Login',
            email:'',
            password:'',
            retype_pwd:''
        };
        
    }
    componentWillMount(){
        this.setState({openDrawer:this.props.hasLoginNeeds});
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
        this.props.userLogout();
    }
    
    handleLoginRegisterRequest=()=>{
        const {email,password,retype_pwd,tabValue}=this.state;
        if (tabValue==='Login'){
            this.props.loginreg({isLogin:true,email:email,password:password});
        }
        else{
            if (password!==retype_pwd){
                return;
            }
            this.props.loginreg({isLogin:false,email:this.state.email,password:fccUtilities.encriptPassword(password)});
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
    
    cancelLogin=()=>{
        this.setState({email:'',password:'',retype_pwd:''});
    }
    onEditHandler=()=>{
       
        this.props.changeInfoUser();
    }
    renderLogin=()=>{
        const {userInformation}= this.props;
        return (
            <div className="containerLoggedInBooks">
                <h3 className="textLoggedIn">Logged in as :</h3>
                <h4 className="textLoggedIn">{userInformation.name?userInformation.name:userInformation.email}</h4>
                <div>
                    <FccDynButton key={'logoutbtn'} 
                        hasHref={false} 
                        hasSvg={false} 
                        isDisabled={false}
                        buttonText={'Disconnect'} 
                        iconInfo={'dc'}
                        clickAction={this.handleLogout}/>
                    {/* <BookButton key={'logoutbtn'} 
                        hasHref={false} 
                        hasSvg={false} 
                        isDisabled={false}
                        buttonText={'Disconnect'} 
                        iconInfo={'dc'}
                        clickAction={this.handleLogout}/> */}
                </div>
                <hr/>
                <div>
                    <FccDynButton key={'btnAddBook'} 
                            hasHref={false} 
                            hasSvg={false} 
                            isDisabled={false}
                            buttonText={'Add'} 
                            iconInfo={'addbook'}
                            clickAction={this.setBookAdd}/>
                    <FccDynButton key={'btnViewInfo'} 
                            hasHref={false} 
                            hasSvg={false} 
                            isDisabled={false}
                            buttonText={'View User'} 
                            iconInfo={'viewuser'}
                            clickAction={this.onEditHandler}/>
                    {/* <BookButton key={'btnAddBook'} 
                        hasHref={false} 
                        hasSvg={false} 
                        isDisabled={false}
                        buttonText={'Add'} 
                        iconInfo={'addbook'}
                        clickAction={this.setBookAdd}/>
                    <BookButton key={'btnViewInfo'} 
                        hasHref={false} 
                        hasSvg={false} 
                        isDisabled={false}
                        buttonText={'View User'} 
                        iconInfo={'viewuser'}
                        clickAction={this.onEditHandler}/> */}
                </div>
                
            </div>
            
        );
    }
    rendernoLogin=()=>{
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
                                    onChange={this.setConfirmationPwd}
                                    />
                                    
                            </div>
                        </form>
                    </Tab>
                </Tabs>
                <div className="containerButtonsLoginBook">
                    <FccDynButton key={'btnRegisterLogin'}
                                hasHref={false} 
                                hasSvg={false} 
                                isDisabled={email==='' || password===''?true:false}
                                buttonText={tabValue=='Login'?"Login":"Create"} 
                                iconInfo={'register'}
                                clickAction={this.handleLoginRegisterRequest} />
                    <FccDynButton key={'btnRegisterCancel'}
                                hasHref={false}
                                hasSvg={false}
                                isDisabled={false}
                                buttonText={'Cancel'}
                                iconInfo={'goback'}
                                clickAction={this.cancelLogin}/>
                    {/* <div className="row">
                        <div className="col-xs-6 col-sm-4 col-xs-offset-1">
                            <BookButton key={'btnRegisterLogin'}
                                hasHref={false} 
                                hasSvg={false} 
                                isDisabled={email==='' || password===''?true:false}
                                buttonText={tabValue=='Login'?"Login":"Create"} 
                                iconInfo={'register'}
                                clickAction={this.handleLoginRegisterRequest} />

                        </div>
                        <div className="col-xs-6 col-sm-4 col-xs-offset-1">
                        
                            <BookButton key={'btnRegisterCancel'}
                                hasHref={false}
                                hasSvg={false}
                                isDisabled={false}
                                buttonText={'Cancel'}
                                iconInfo={'goback'}
                                clickAction={this.cancelLogin}/>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
    
    render(){
        const{openDrawer}=this.state;
        const {islogged}= this.props;
        return(
            <Drawer open={openDrawer} docked={false} onRequestChange={this.openCloseDrawer}>
                {islogged?this.renderLogin():this.rendernoLogin()}
            </Drawer>
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
    changeInfoUser:PropTypes.func.isRequired,
    hasLoginNeeds:PropTypes.bool.isRequired
};
export default BookAppLoginContainer;