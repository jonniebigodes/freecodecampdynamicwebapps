import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../../../Assets/stylesheets/nightApp.scss';
import '../../../../Assets/stylesheets/base.scss';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NightItemsContainer from './NightItemsContainer';
import NightLifeLoginContainer from './NightLifeLoginContainer';
import NightLifeSearch from './NightLifeSearch';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';

class NightLifeContainer extends Component {
    
    constructor(props){
        super(props);
        this.state={
            hideShowLogin:false,   
        };
    }
   
    /**
     * function to open/close drawer on the side
     */
    showHideLogin=()=>{
        this.setState({hideShowLogin:!this.state.hideShowLogin});
    }
    
    /**
     * handler function to handle the query to the server via user input/selection
     */
    searchNightInformation=value=>{
        const {nightSetError,nightSearchItems,nightlifeUserLoggedIn,nightLifeUserInformation}= this.props;
        
        if (value.query=='default'){
           nightSetError(`Don't you know cupcake that default is not a place to eat or drink????`);
           return;
        }
        if (!value.where){
            nightSetError(`Don't you know cupcake that we ain't psychics? we don't know where you wanna go`);
            return;
        }
        if (!value.howMany){
            nightSetError(`Don't you know cupcake that 0 is not a number? Pick something else`);
            return;
        }
        
        if (nightlifeUserLoggedIn){
            value.who= nightLifeUserInformation.id;
        }
        nightSearchItems(value);
    }

    onAddNight=(e)=>{
        // console.log('====================================');
        // console.log(`add night container value:${JSON.stringify(e,null,2)}`);
        // console.log('====================================');
        const {nightlifeUserLoggedIn,addToNightEvent,nightSetError,nightLifeUserInformation}=this.props;
        nightlifeUserLoggedIn?addToNightEvent({userToken:nightLifeUserInformation.id,idPlace:e}):nightSetError('You need to be authenticated on the server first before adding yourself to a event');
    }

    onRemoveNight=(e)=>{
        // console.log('====================================');
        // console.log(`remove night container value:${JSON.stringify(e,null,2)}`);
        // console.log('====================================');
        const {nightlifeUserLoggedIn,removeFromNightEvent,nightLifeUserInformation,nightSetError}= this.props;
        nightlifeUserLoggedIn?removeFromNightEvent({userToken:nightLifeUserInformation.id,idPlace:e}):nightSetError('You need to be authenticated on the server first before adding yourself to a event');
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
    renderSearchBar(){
        
        return(
            <NightLifeSearch key="searchBar" onSearchAction={this.searchNightInformation}/>
        );
    }
    
    /**
     * aux method for rendering the ui if items are present(queried)
     */
    renderItems=()=>{
        const {nightLifeItems,nightLifeSearchResults,nightlifeUserLoggedIn}= this.props;
        return(
            <div key="ContainerApp">
                <div className="row">
                    {this.renderSearchBar()}
                </div>
                <div className="voffset3"/>
                <div className="row">
                    <NightItemsContainer items={nightLifeItems} onAddNight={this.onAddNight} onRemoveNight={this.onRemoveNight} itemsNumber={nightLifeSearchResults} isUserLogged={nightlifeUserLoggedIn}/>
                </div>
            </div>
            
        );
    }
    /**
     * react render method
     */
    render() {
        const{nightLifeSearchResults,nightlifeUserLoggedIn,nightLifeUserInformation,nightLifeItems}= this.props;
        const actionsDialog = [
            <FlatButton key="dialogError_nightLife"
                label="Ok"
                primary
                onClick={this.OnResetError}
            />];
        return (
               <div className="container-fluid nightAppContainer">
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
                    <NightLifeLoginContainer islogged={nightlifeUserLoggedIn} loginreg={this.loginRegSend} userInformation={nightLifeUserInformation} userLogout={this.logoutHandler} hasLoginNeeds={this.state.hideShowLogin} dataItems={nightLifeItems} numberItems={nightLifeSearchResults}/>
                    {nightLifeSearchResults===0?this.renderSearchBar('search'):this.renderItems()}
                    <AppFooter appName={"nights"}/>    
                </div>
            
            
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
    nightLifeSearchResults:PropTypes.number.isRequired,
    nightLifeItems:PropTypes.object.isRequired,
    nightLifeLoginRegister:PropTypes.func.isRequired,
    nightUnloadUser:PropTypes.func.isRequired,
    nightConnectUser:PropTypes.func.isRequired,
    addToNightEvent:PropTypes.func.isRequired,
    removeFromNightEvent:PropTypes.func.isRequired,
    nightSearchItems:PropTypes.func.isRequired,
};
export default NightLifeContainer;