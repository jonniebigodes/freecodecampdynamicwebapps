import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {dynamicThemes} from '../../../../Assets/styles/challengesThemes';
import '../../../../Assets/stylesheets/votingApp.scss';
import {
    pollAppExit,
    fetchPolls,
    voteOnPoll,
    pollAppDisconnectUser,
    addPollOptionFold,
    addPollFold,
    setPollAppError,
    resetPollAppError,
    pollAppaAuthenticateServer,
    pollAppRegisterServer,
    removePollFold,
    fetchSocialInfo,
    shareOnSocialMedia
} from '../../../../common/actions/VottingAppActions';
import PollsContainer from './PollsContainer';
class PollApp extends Component{

    
    componentDidMount=()=>{
        // will get the books
        this.props.getPolls();
        if (this.props.params.authToken){
            this.props.getSocialAuthData(this.props.params.authToken);
        }

    }
    componentWillUnmount(){
        //this.props.pollAppExit(true);
        this.props.pollsExit();
    }
    handleLoginRegisterHandler=(value)=>{
        if (value.isLogin){
            this.props.voteappLogin(value);
        }
        else{
            this.props.voteRegisterApp(value);
        }
    }
    handleDisconnect=()=>{
        this.props.unplugUser();
    }
    castVoteHandler=(value)=>{
        
        this.props.castPollVote(value);
    }
    addoptionToPoll=(value)=>{
        this.props.optionsPollAdd(value);
    }
   
    onPollResetError=()=>{
        this.props.resetErrorPoll(true);
    }
    onRemovePollHandler=(value)=>{
        this.props.removePollCollection(value);
    }
    
    handleNewPoll=(value)=>{
        // fire the prop action let the action handle it
        
        this.props.addnewPoll(value);
    }
    socialLoginLogin=()=>{
        this.props.socialConnect();
    }
    handleSocialShare=(value)=>{
        const {pollsApploginData,shareOnSocial}=this.props;
       
        shareOnSocial({pollToken:value,usertoken:pollsApploginData.id});
    }
    render(){
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(dynamicThemes.votesTheme)}>
                <PollsContainer
                    pollItems={this.props.pollsData}
                    numberitems={this.props.polldataItems.length}
                    isPollAppError={this.props.pollsAppIsError}
                    errorMessageApp={this.props.pollsAppErrorMessage}
                    gettingData={this.props.pollretrieve}
                    userLoggedIn={this.props.pollsApploggedIn}
                    loginregister={this.handleLoginRegisterHandler}
                    sharePollSocial={this.handleSocialShare}
                    disconnectuser={this.handleDisconnect}
                    PollVote={this.castVoteHandler}
                    optionaddPoll={this.addoptionToPoll}
                    resetErrorApp={this.onPollResetError}
                    pollUser={this.props.pollsApploginData}
                    newPoll={this.handleNewPoll}
                    removePoll={this.onRemovePollHandler}/>
            </MuiThemeProvider>
        );
    }
}
const mapStateToProps=state=>{
    return{
        pollretrieve:state.votes.voteIsSearching,
        pollsData:state.votes.polls,
        pollsAppIsError:state.votes.onError,
        pollsAppErrorMessage:state.votes.errorMessage,
        pollsApploggedIn:state.votes.votesisLoggedin,
        pollsApploginData:state.votes.votesUserInfo,
        polldataItems:state.votes.results
    };
};
const mapDispatchToProps=dispatch=>{
    return {
        setPollError:(value)=>{
            dispatch(setPollAppError(value));
        },
        resetErrorPoll:(value)=>{
            dispatch(resetPollAppError(value));
        },
        pollsExit:()=>{
            dispatch(pollAppExit());
        },
        getPolls:()=>{
            dispatch(fetchPolls());
        },
        castPollVote:(value)=>{
            dispatch(voteOnPoll(value));
        },
        unplugUser:()=>{
            dispatch(pollAppDisconnectUser());
        },
        optionsPollAdd:(value)=>{
            dispatch(addPollOptionFold(value));
        },
        addnewPoll:(value)=>{
            dispatch(addPollFold(value));
        },
        voteappLogin:(value)=>{
            dispatch(pollAppaAuthenticateServer(value));
        },
        voteRegisterApp:(value)=>{
            dispatch(pollAppRegisterServer(value));
        },
        removePollCollection:(value)=>{
            dispatch(removePollFold(value));
        },
        getSocialAuthData:(value)=>{
            dispatch(fetchSocialInfo(value));
        },
        shareOnSocial:(value)=>{
            dispatch(shareOnSocialMedia(value));
        }
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(PollApp);
