import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table,TableBody,TableHeader,TableHeaderColumn,TableRow,TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';
import PollDetail from './PollDetail';
import PollAppLogin from './PollAppLogin';
import NewPoll from './NewPoll';
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
            selectedIndex:0,
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
    populateTableBody=()=>{
        let results=[];
        for (let item of this.props.pollItems){
            results.push(
                <TableRow key={item.polltoken} >
                    <TableRowColumn>{item.pollname}</TableRowColumn>
                    <TableRowColumn>{item.pollcreator}</TableRowColumn>
                    <TableRowColumn>{item.polloptions.length}</TableRowColumn>
                </TableRow>
            );
        }
        return results;
    }
    changeEdit=()=>{
        this.setState({viewMode:!this.state.viewMode});
    }
    changeAdd=()=>{
        this.setState({adding:!this.state.adding});
    }
    onRowSelectedHandler=(selectedRows)=>{
        this.setState({viewMode:!this.state.viewMode,selectedPoll:this.props.pollItems[selectedRows]});
    }
    handleVotes=(value)=>{
        this.props.PollVote(value);
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
    renderTable=()=>{
        if (this.state.viewMode){
            return(
                <PollDetail addPollOption={(value)=>this.handleOptionPoll(value)} 
                    detailExit= {this.changeEdit} 
                    pollInfo={this.state.selectedPoll} 
                    votePoll={(value)=>this.handleVotes(value)} userInfo={this.props.pollUser}
                    shareSocialNetwork={(value)=>this.handleSocialLogin(value)}
                    pollRemoval={(value)=>this.handleRemovePoll(value)}/>
            );
        }

        if (this.state.adding){
            return (
                <NewPoll newPollExit={this.changeAdd} addPollToCollection={(value)=>this.handleNewPoll(value)} pollUser={this.props.pollUser}/>
            );
        }
        if (this.props.pollItems){
            
            return(
                <div>
                    <PollAppLogin islogged= {this.props.userLoggedIn} 
                        loginreg={(value)=>this.handleLoginReg(value)} 
                        userLogout={this.props.disconnectuser}
                        userInformation={this.props.pollUser} 
                        showLogin={this.showHideLogin} hasLoginNeeds={this.state.hideShowLogin} pollStart={this.handleNewPollInject}
                        />
                    <Table onRowSelection={this.onRowSelectedHandler}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableHeaderColumn>Poll Name</TableHeaderColumn>
                            <TableHeaderColumn>Poll Creator</TableHeaderColumn>
                            <TableHeaderColumn>Number of Options</TableHeaderColumn>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}
                                    deselectOnClickaway
                                    showRowHover>
                            {this.populateTableBody()}
                        </TableBody>
                    </Table>
                    
                    
                </div>
                
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
        const actionsDialog = [
            <FlatButton key="dialogError_nightLife"
                label="Ok"
                primary
                onTouchTap={this.onresetError}
            />
            ];
        return (
            <MuiThemeProvider>
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
                    <AppHeader appName="Supercalifragilistic Voting Machine" appStyle="poll" showLogin={this.showHideLogin} hasLoginNeeds/>
                        {this.renderTable()}
                    <AppFooter appName="book" lightordark={this.state.light}/>
                </div>
            </MuiThemeProvider>
        );
    }
}
PollsContainer.propTypes={
    pollItems:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
    isPollAppError:PropTypes.bool,
    errorMessageApp:PropTypes.string,
    resetErrorApp:PropTypes.func,
    userLoggedIn:PropTypes.bool.isRequired,
    pollUser:PropTypes.shape({
        id:PropTypes.string.isRequired,
        email:PropTypes.string.isRequired,
        password:PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,
        city:PropTypes.string.isRequired,
        countrystate:PropTypes.string.isRequired,
        country:PropTypes.string.isRequired
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