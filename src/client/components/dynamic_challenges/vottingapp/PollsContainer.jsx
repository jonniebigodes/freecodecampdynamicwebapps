import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';
import PollDetail from './PollDetail';
import PollAppLogin from './PollAppLogin';
import NewPoll from './NewPoll';
import VotesTable from './VotingTable';
class PollsContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            light:true,
            adding:false,
            snackOpen:false,
            snackMessage:'',
            viewMode:false,
            selectedPoll:{},
            hideShowLogin:false
        };
    }
    handleRemovePoll=(value)=>{
       
        this.props.removePoll(value);        
    }
    showHideLogin=()=>{
        this.setState({hideShowLogin:!this.state.hideShowLogin});
    }
    
    onresetError=()=>{
        this.props.resetErrorApp(true);
    }
    
    changeEdit=()=>{
        this.setState({viewMode:!this.state.viewMode});
    }
    changeAdd=()=>{
        this.setState({adding:!this.state.adding});
    }
    onRowSelectedHandler=(selectedRows)=>{
        const {viewMode}= this.state;
        this.setState({viewMode:!viewMode,selectedPoll:selectedRows});
    }
    handleVotes=(value)=>{
        const {viewMode}= this.state;
        this.props.PollVote(value);
        this.setState({viewMode:!viewMode,selectedPoll:{}});
    }
    handleOptionPoll=(value)=>{
        this.props.optionaddPoll(value);
    }
    handleNewPoll=(value)=>{
        
        this.props.newPoll(value);
    }
    handleNewPollInject=()=>{
        this.changeAdd();
    }
    handleLoginReg=(value)=>{
        
        this.props.loginregister(value);
    }
   handleSocialLogin=(value)=>{
       this.props.sharePollSocial(value);
   }

   renderPollData=()=>{
        const {viewMode,adding,selectedPoll}= this.state;
        const {pollUser,numberitems,pollItems,gettingData}= this.props;
        if (gettingData){
            return(
                <div className="preloadTextPosition">
                    <div className="preloadText">
                        Retrieving the poll information
                    </div>
                    <div className="preloadText">
                       Please hold while the request is processed.
                    </div>
                </div>
            );
        }
        if (viewMode){
            return(
                <PollDetail
                    addPollOption={this.handleOptionPoll} 
                    detailExit= {this.changeEdit} 
                    pollInfo={selectedPoll} 
                    votePoll={this.handleVotes} 
                    userInfo={pollUser}
                    shareSocialNetwork={this.handleSocialLogin}
                    pollRemoval={this.handleRemovePoll}/>
            );
        }
        if (adding){
            return (
                <NewPoll newPollExit={this.changeAdd} 
                addPollToCollection={this.handleNewPoll} 
                pollUser={pollUser}/>
            );
        }
        if (numberitems){
            return(
                <VotesTable tableItems={pollItems} key={`votingTable`} selectionHandler={this.onRowSelectedHandler}/> 
            );
        }
        else{
            return(
                <div>
                    <h3>Now that's awkward looks like there's nothing to show to you</h3>
                    <h4>Login or register and try to add something to the collection</h4>
                </div>
            );
        }
    }
   
    render(){
        const {userLoggedIn,pollUser}= this.props;
        const {hideShowLogin}= this.state;
        const actionsDialog = [
            <FlatButton key="dialogError_nightLife"
                label="Ok"
                primary
                onTouchTap={this.onresetError}
            />
            ];
        return (
            <div className="container-fluid">
                <Dialog key="errorDialog"
                    actions={actionsDialog}
                    modal={false}
                    open={this.props.isPollAppError}
                    onRequestClose={this.onresetError}>
                    <h3>Ups!!!!<br/> Something went wrong or someone did something wrong!<br/>Check out the problem bellow</h3>
                    <br/>
                    <h4>{this.props.errorMessageApp}</h4>
                </Dialog> 
                <AppHeader 
                    appName="Supercalifragilistic Voting Machine" 
                    appStyle="poll" 
                    showLogin={this.showHideLogin} 
                    hasLoginNeeds/>
                <PollAppLogin islogged= {userLoggedIn} 
                        loginreg={this.handleLoginReg} 
                        userLogout={this.props.disconnectuser}
                        userInformation={pollUser} 
                        showLogin={this.showHideLogin} 
                        hasLoginNeeds={hideShowLogin} 
                        pollStart={this.handleNewPollInject}/>
                {this.renderPollData()}
                <AppFooter appName="book" lightordark={this.state.light}/>
            </div>
        );
    }
}
PollsContainer.propTypes={
    pollItems:PropTypes.object.isRequired,
    numberitems:PropTypes.number.isRequired,
    isPollAppError:PropTypes.bool,
    gettingData:PropTypes.bool.isRequired,
    errorMessageApp:PropTypes.string,
    resetErrorApp:PropTypes.func,
    userLoggedIn:PropTypes.bool.isRequired,
    pollUser:PropTypes.shape({
        id:PropTypes.string.isRequired,
        email:PropTypes.string.isRequired,
        password:PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,
    }).isRequired,
    loginregister:PropTypes.func.isRequired,
    disconnectuser:PropTypes.func.isRequired,
    PollVote:PropTypes.func.isRequired,
    optionaddPoll:PropTypes.func.isRequired,
    newPoll:PropTypes.func.isRequired,
    removePoll:PropTypes.func.isRequired,
    sharePollSocial:PropTypes.func.isRequired
};
export default PollsContainer;