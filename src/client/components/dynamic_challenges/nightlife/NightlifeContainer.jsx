import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../../../Assets/stylesheets/nightApp.scss';
import '../../../../Assets/stylesheets/base.scss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton  from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NightItemsContainer from './NightItemsContainer';
import NightLifeLoginContainer from './NightLifeLoginContainer';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';
class NightLifeContainer extends Component {
    
    constructor(props){
        super(props);
        this.state={
            hideShowLogin:false,
            nightvenue:'default',
            location:'',
            itemsQueried:0
        };
    }
    /**
     * event handler for select field onChange
     * @param {*} event the event triggered by the componentWillUnmount
     * @param {String} index the index selected to be updated
     * @param {String} value the value to be updated
     */
    handleChange = (event, index, value) =>{
        this.setState({nightvenue:value});
        //this.props.nightSetQueryItem(value);
    }
    /**
     * event handler for select field onChange
     * @param {*} event the event triggered by the componentWillUnmount
     * @param {String} index the index selected to be updated
     * @param {String} value the value to be updated
     */
    handleNumberChanged=(event,index,value)=>{
        //this.props.nightsetNumberOfItemsToSearch(value);
        this.setState({itemsQueried:value});
    }
    
    /**
     * function to open/close drawer on the side
     */
    showHideLogin=()=>{
        this.setState({hideShowLogin:!this.state.hideShowLogin});
    }
    /**
     * @param {*} e html element that triggers the update(textinput)
     */ 
    updateSearchTerm=(e)=>{
        //e.preventDefault();
        //console.log("update term: "+ e.target.value);
        //this.props.nightsetLocation(e.target.value);
        this.setState({location:e.target.value});
    }
    /**
     * handler function to handle the query to the server via user input/selection
     */
    searchNightInformation=()=>{
        //e.preventDefault();
        if (this.state.nightvenue=='default'){
           this.props.nightSetError(`Don't you know cupcake that default is not a place to eat or drink????`);
           return;
        }
        if (!this.state.location){
            this.props.nightSetError(`Don't you know cupcake that we ain't psychics? we don't know where you wanna go`);
            return;
        }
        if (!this.state.itemsQueried){

            this.props.nightSetError(`Don't you know cupcake that 0 is not a number? Pick something else`);
            return;
        }
        let tmpNight={token:'',query:this.state.nightvenue,where:this.state.location,who:'',howMany:this.state.itemsQueried};
        if (this.props.nightlifeUserLoggedIn){
           /*  console.log('====================================');
            console.log(`user token before query:${this.props.id}`);
            console.log('===================================='); */
            tmpNight.who= this.props.nightLifeUserInformation.id;
        }
        this.props.nightSearchItems(tmpNight);
    }

    onAddNight=(e)=>{
        this.props.nightlifeUserLoggedIn?this.props.addToNightEvent({userToken:this.props.nightLifeUserInformation.id,idPlace:e}):this.props.nightSetError('You need to be authenticated on the server first before adding yourself to a event');
        
    }

    onRemoveNight=(e)=>{
        this.props.nightlifeUserLoggedIn?this.props.removeFromNightEvent({userToken:this.props.nightLifeUserInformation.id,idPlace:e}):this.props.nightSetError('You need to be authenticated on the server first before adding yourself to a event');
    }
    /**
     * handler function to reset the errors on the app
     */
    OnResetError=()=>{
        //e.preventDefault();
        this.props.nightLifeResetAppError(true);
    }
    /**
     * handler function for login/register user
     */
    loginRegSend=(e)=>{
        
        this.props.nightConnectUser(e);
    }
    /**
     * handler function for user logout
     */
    logoutHandler=()=>{
        
        this.props.nightUnloadUser();
    }
    //region render component
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
                                    value={this.state.nightvenue} 
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
                                    value={this.state.nightitemsQueried}
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
                                value={this.state.nightlocation}
                                className="textSearch"
                                onChange={this.updateSearchTerm}/>
                        </div>
                        <div className="col-xs-6 col-sm-4">
                            <FloatingActionButton 
                                mini
                                key="btnSearch"
                                className="searchButton"
                                onClick={this.searchNightInformation}>
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
                                        value={this.state.nightvenue} 
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
                                        value={this.state.itemsQueried}
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
                                    value={this.state.nightlocation}
                                    className="textSearch"
                                    onChange={this.updateSearchTerm}/>
                            </div>
                            <div className="col-xs-6 col-sm-4">
                                <FloatingActionButton 
                                    mini
                                    key="btnSearch"
                                    className="searchButton"
                                    onClick={this.searchNightInformation}>
                                    <i className="material-icons md-18">search</i>
                                </FloatingActionButton>
                            </div>
                        </div>
                </div>
                <div className="voffset3"/>
                <NightItemsContainer items={this.props.nightLifeSearchResults} onAddNight={(e)=>this.onAddNight(e)} onRemoveNight={(e)=>this.onRemoveNight(e)} userLogged={this.props.nightlifeUserLoggedIn}/>
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
                primary
                onTouchTap={this.OnResetError}
            />
            ];
        return (
            <MuiThemeProvider>
               <div className="container-fluid">
                    <Dialog key="errorDialog"
                                        actions={actionsDialog}
                                        modal={false}
                                        open={this.props.nightLifeAppError}
                                        onRequestClose={this.OnResetError}>
                                        <h3>Ups!!!!<br/> Something went wrong or someone did something wrong!<br/>Check out the problem bellow</h3>
                                        <br/>
                                        <h4>{this.props.nighterrorMessageApp}</h4>
                                </Dialog>
                        <AppHeader appName="Supercalifragilistic NightLife Coordinator" appStyle="books" showLogin={this.showHideLogin} hasLoginNeeds/>
                        <NightLifeLoginContainer islogged={this.props.nightlifeUserLoggedIn} loginreg={(e)=>this.loginRegSend(e)} userInformation={this.props.nightLifeUserInformation} userLogout={this.logoutHandler} dataItems={this.props.nightLifeSearchResults} hasLoginNeeds={this.state.hideShowLogin}/>
                        {this.props.nightLifeSearchResults.length?this.renderItems():this.renderNoItems()}
                </div>
            </MuiThemeProvider>
            
        );
    }
    //endregion
}
NightLifeContainer.propTypes={
    nightLifeAppError:PropTypes.bool.isRequired,
    nighterrorMessageApp:PropTypes.string.isRequired,
    nightLifeResetAppError:PropTypes.func.isRequired,
    nightSetError:PropTypes.func.isRequired,
    nightLifeUserInformation:PropTypes.shape({
        id:PropTypes.string.isRequired,
        email:PropTypes.string.isRequired,
        password:PropTypes.string.isRequired
    }).isRequired,
    nightlifeUserLoggedIn:PropTypes.bool.isRequired,
    nightLifeSearchResults:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
    nightLifeLoginRegister:PropTypes.func.isRequired,
    nightUnloadUser:PropTypes.func.isRequired,
    nightConnectUser:PropTypes.func.isRequired,
    addToNightEvent:PropTypes.func.isRequired,
    removeFromNightEvent:PropTypes.func.isRequired,
    nightSearchItems:PropTypes.func.isRequired,
};
export default NightLifeContainer;