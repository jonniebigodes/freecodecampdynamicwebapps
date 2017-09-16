import React, {Component} from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem'
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton  from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {setNightQuery, 
    setLocationNight,
    setNumberItems,
    fetchNightDataIfNeeded, 
    setNightAppError,
    resetNightAppError,
    nightExit,
    authenticateServer,
    registerServer,
    disconnectUser,
    removeUserFromNight,
    addUserToNight
} from '../../../../common/actions/nightLifeAppActions';

import '../../../../Assets/stylesheets/nightApp.scss';
import '../../../../Assets/stylesheets/base.scss';
import NightItemsContainer from './NightItemsContainer';
import NightLifeLoginContainer from './NightLifeLoginContainer';
class NightLifeContainer extends Component {
    /**
     * react guard method to handle the component unload
     */
    componentWillUnmount(){
        
        this.props.exitNight(true);
    }
    
    /**
     * event handler for select field onChange
     * @param {*} event the event triggered by the componentWillUnmount
     * @param {String} index the index selected to be updated
     * @param {String} value the value to be updated
     */
    handleChange = (event, index, value) =>{
        
        this.props.setQueryItem(value);
    }
    /**
     * event handler for select field onChange
     * @param {*} event the event triggered by the componentWillUnmount
     * @param {String} index the index selected to be updated
     * @param {String} value the value to be updated
     */
    handleNumberChanged=(event,index,value)=>{
        this.props.setNumberOfItemsToSearch(value);
    }
    
    /**
     * function to open/close drawer on the side
     */
    openCloseDrawer = () => {
        this.setState({openDrawer: !this.state.openDrawer});
    }
    /**
     * @param {*} e html element that triggers the update(textinput)
     */ 
    updateSearchTerm=(e)=>{
        e.preventDefault();
        //console.log("update term: "+ e.target.value);
        this.props.setLocation(e.target.value);
    }

    /**
     * handler function to handle the query to the server via user input/selection
     */
    searchNightInformation=(e)=>{
        e.preventDefault();
        if (this.props.nightvenue=='default'){
           this.props.setError(`Don't you know cupcake that default is not a place to eat or drink????`);
           return;
        }
        if (!this.props.location){
            this.props.setError(`Don't you know cupcake that we ain't psychics? we don't know where you wanna go`);
            return;
        }
        if (!this.props.itemsQueried){

            this.props.setError(`Don't you know cupcake that 0 is not a number? Pick something else`);
            return;
        }
        let tmpNight={query:this.props.nightvenue,where:this.props.location,who:'',howMany:this.props.itemsQueried};
        if (this.props.loggedIn){
            console.log('====================================');
            console.log(`user token before query:${this.props.id}`);
            console.log('====================================');
            tmpNight.who= this.props.loginData.id
        }
        
        this.props.searchItems(tmpNight);
    }

    onAddNight=(e)=>{
        this.props.loggedIn?this.props.addUserToNightEvent({userToken:this.props.loginData.id,idPlace:e}):this.props.setError('You need to be authenticated on the server first before adding yourself to a event');
        
    }

    onRemoveNight=(e)=>{
        this.props.loggedIn?this.props.removeUserFromNightEvent({userToken:this.props.loginData.id,idPlace:e}):this.props.setError('You need to be authenticated on the server first before adding yourself to a event')
    }
    /**
     * handler function to reset the errors on the app
     */
    resetError=(e)=>{
        e.preventDefault();
        this.props.resetError(true);
    }
    /**
     * handler function for login/register user
     */
    loginRegSend=(e)=>{
        console.log(`auth information:${e.isLogin}\ndata: mail=${e.email} password:${e.password}`);
        if (e.isLogin){
            this.props.setLogin(e);
        }
        else{
            this.props.setRegistry(e);
        }
    }
    /**
     * handler function for user logout
     */
    logoutHandler=()=>{
        console.log('====================================');
        console.log(`logout handler: id user${this.props.loginData.id}`);
        console.log('====================================');
        this.props.unpluguser(this.props.loginData.id);
    }

    /**
     * aux method for rendering the ui if no items are present(no queries done)
     */
    renderNoItems(){
        return(
            <div className="searchInit" key="containerSearch">
                    <div className="row">
                        <div className="col-xs-6 col-sm-4">
                            <div className="col-xs-6">
                                <SelectField key="itemSelector" 
                                    floatingLabelText="What to search" 
                                    value={this.props.nightvenue} 
                                    className="selectFields"
                                    onChange={(event, index, value)=>this.handleChange(event, index, value)}>
                                    <MenuItem value={'default'} primaryText="default"/>
                                    <MenuItem value={'restaurants'} primaryText="Restaurants"/>
                                    <MenuItem value={'bars'} primaryText="Bars"/>
                                </SelectField>
                            </div>
                            <div className="col-xs-6">
                                <SelectField key="numberSelector" 
                                    floatingLabelText="How many to search"
                                    className="selectFields"
                                    value={this.props.itemsQueried}
                                    onChange={(event,index,value)=>this.handleNumberChanged(event,index,value)}>
                                    <MenuItem value={0} primaryText="0"/>
                                    <MenuItem value={5} primaryText="5"/>
                                    <MenuItem value={10} primaryText="10"/>
                                    <MenuItem value={15} primaryText="15"/>
                                    <MenuItem value={20} primaryText="20"/>
                                    <MenuItem value={30} primaryText="30"/>
                                    <MenuItem value={40} primaryText="40"/>
                                    <MenuItem value={50} primaryText="50"/>
                                </SelectField>
                            </div>
                        </div>
                        <div className="col-xs-6 col-sm-4">
                        <TextField hintText="Fill in with a valid city"
                                errorText="Try adding a city"
                                floatingLabelText="Location"
                                value={this.props.location}
                                className="textSearch"
                                onChange={(e)=>this.updateSearchTerm(e)}/>
                        </div>
                        <div className="col-xs-6 col-sm-4">
                            <FloatingActionButton 
                                mini={true}
                                key="btnSearch"
                                className="searchButton"
                                onClick={(e) =>{this.searchNightInformation(e)}}>
                                <i className="material-icons md-18">search</i>
                            </FloatingActionButton>
                        </div>
                    </div>
            </div>
        );
    }
    /**
     * aux method for rendering the ui if items are present(queried)
     */
    renderItems=()=>{
        return(
            <div key="ContainerApp">
                    <div className="searchItemsResult" key="containerSearch">
                        <div className="row">
                            <div className="col-xs-6 col-sm-4">
                                <div className="col-xs-6">
                                    <SelectField key="itemSelector" 
                                        floatingLabelText="What to search" 
                                        value={this.props.nightvenue} 
                                        className="selectFields"
                                        onChange={(event, index, value)=>this.handleChange(event, index, value)}>
                                        <MenuItem value={'default'} primaryText="default"/>
                                        <MenuItem value={'restaurants'} primaryText="Restaurants"/>
                                        <MenuItem value={'bars'} primaryText="Bars"/>
                                    </SelectField>
                                </div>
                                <div className="col-xs-6">
                                    <SelectField key="numberSelector" 
                                        floatingLabelText="How many to search"
                                        className="selectFields"
                                        value={this.props.itemsQueried}
                                        onChange={(event,index,value)=>this.handleNumberChanged(event,index,value)}>
                                        <MenuItem value={0} primaryText="0"/>
                                        <MenuItem value={5} primaryText="5"/>
                                        <MenuItem value={10} primaryText="10"/>
                                        <MenuItem value={15} primaryText="15"/>
                                        <MenuItem value={20} primaryText="20"/>
                                        <MenuItem value={30} primaryText="30"/>
                                        <MenuItem value={40} primaryText="40"/>
                                        <MenuItem value={50} primaryText="50"/>
                                    </SelectField>
                                </div>
                            </div>
                            <div className="col-xs-6 col-sm-4">
                            <TextField hintText="Fill in with a valid city"
                                    errorText="Try adding a city"
                                    floatingLabelText="Location"
                                    value={this.props.location}
                                    className="textSearch"
                                    onChange={(e)=>this.updateSearchTerm(e)}/>
                            </div>
                            <div className="col-xs-6 col-sm-4">
                                <FloatingActionButton 
                                    mini={true}
                                    key="btnSearch"
                                    className="searchButton"
                                    onClick={(e) =>{this.searchNightInformation(e)}}>
                                    <i className="material-icons md-18">search</i>
                                </FloatingActionButton>
                            </div>
                        </div>
                </div>
                <div className="voffset3"/>
                <NightItemsContainer items={this.props.items} onAddNight={(e)=>this.onAddNight(e)} onRemoveNight={(e)=>this.onRemoveNight(e)} userLogged={this.props.loggedIn}/>
            </div>
            
        );
    }
    /**
     * react render method
     */
    render() {
        const actionsDialog = [
            <FlatButton key="dialogError_nightLife"
                label="Ok"
                primary={true}
                onTouchTap={(e)=>this.resetError(e)}
            />
            ];
        return (
            <div className="container-fluid">
                <Dialog key="errorDialog"
                        actions={actionsDialog}
                        modal={false}
                        open={this.props.isError}
                        onRequestClose={(e)=>this.resetError(e)}>
                        <h3>Ups!!!!<br/> Something went wrong or someone did something wrong!<br/>Check out the problem bellow</h3>
                        <br/>
                        <h4>{this.props.errorMessageApp}</h4>
                </Dialog>
                <NightLifeLoginContainer islogged={this.props.loggedIn} loginreg={(e)=>this.loginRegSend(e)} userInformation={this.props.loginData} userLogout={()=>this.logoutHandler()} dataItems={this.props.items}/>
                {this.props.items.length?this.renderItems():this.renderNoItems()}
                
                
                
            </div>
            
            
        );
    }
}
const mapStateToProps = state => {
    return {
        items: state.night.items,
        location: state.night.location, 
        nightvenue: state.night.nightvenueQuery, 
        itemsQueried:state.night.numberOfItems,
        isError: state.night.onError, 
        errorMessageApp: state.night.errorMessage,
        loggedIn:state.night.isLoggedin,
        loginData:state.night.userInfo
    };

};
const mapDispatchToProps = dispatch => {
    return {
        setLocation: (value) => {
            dispatch(setLocationNight(value));
        },
        setQueryItem: (value) => {
            dispatch(setNightQuery(value));
        },
        searchItems: (value) => {
            dispatch(fetchNightDataIfNeeded(value));
        },
        addUserToNightEvent:(value)=>{
            dispatch(addUserToNight(value));
        },
        removeUserFromNightEvent:(value)=>{
            dispatch(removeUserFromNight(value));
        },
        setError:(value)=>{
            dispatch(setNightAppError(value));
        },
        resetError:(value)=>{
            dispatch(resetNightAppError(value));
        },
        setNumberOfItemsToSearch:(value)=>{
            dispatch(setNumberItems(value));
        },
        exitNight:(value)=>{
            dispatch(nightExit(value));
        },
        setLogin:(value)=>{
            dispatch(authenticateServer(value));
        },
        setRegistry:(value)=>{
            dispatch(registerServer(value));
        },
        unpluguser:(value)=>{
            dispatch(disconnectUser(value));
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(NightLifeContainer);