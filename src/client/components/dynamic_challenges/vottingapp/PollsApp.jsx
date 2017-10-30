import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
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
import injectTapEventPlugin from 'react-tap-event-plugin';
import PollsContainer from './PollsContainer';
class PollApp extends Component{

    componentWillMount(){
        injectTapEventPlugin();
    }
    componentDidMount=()=>{
        // will get the books
        this.props.getPolls();
       
        if (this.props.params.authToken){
            this.props.getSocialAuthData(this.props.params.authToken);
        }

    }
    componentWillUnmount(){
        //this.props.pollAppExit(true);
        this.props.pollsExit(true);
    }
    handleLoginRegisterHandler=(value)=>{
        console.log('====================================');
        console.log(`app handleLoginRegisterHandler: ${JSON.stringify(null,2)}`);
        console.log('====================================');
        if (value.isLogin){
            this.props.voteappLogin(value);
        }
        else{
            this.props.voteRegisterApp(value);
        }
    }
    handleDisconnect=()=>{
        this.props.unplugUser(this.props.pollsApploginData.id);
    }
    castVoteHandler=(value)=>{
        console.log('====================================');
        console.log(`poll app voted on poll info:${JSON.stringify(value,null,2)}`);
        console.log('====================================');
        this.props.castPollVote(value);
    }
    addoptionToPoll=(value)=>{
        this.props.optionsPollAdd(value);
    }
   
    onPollResetError=()=>{
        this.props.resetErrorPoll(true);
    }
    onRemovePollHandler=(value)=>{
        if (this.props.pollsApploggedIn){

            const tmpPoll= this.props.pollsData.find(x=>x.polltoken==value.polltoken && x.pollcreator.toLowerCase()==this.props.pollsApploginData.email.toLowerCase());
            if (tmpPoll){
                this.props.removePollCollection(tmpPoll.polltoken);
            }
            else{
                this.props.setPollError(`Cannot remove the poll you selected.\nYou did not create it`);
            }
        }
        else{
            this.props.setPollError(`Cannot remove the poll you selected.\nYou are not logged in`);
        }
    }
    
    handleNewPoll=(value)=>{
        console.log('====================================');
        console.log(`APP handleNewPoll got data new poll :${JSON.stringify(value,null,2)}`);
        console.log('====================================');
        const pollExists=this.props.pollsData.find(x=>x.pollname.toLowerCase()==value.pollname.toLowerCase());
        console.log('====================================');
        console.log(`APP handleNewPoll got data new poll :${JSON.stringify(pollExists,null,2)}`);
        console.log('====================================');
        if (pollExists){
            this.props.setPollError(`The poll: ${value.pollname} was already added by someone else`);
            return;
        } 
        this.props.addnewPoll(value);
    }
    socialLoginLogin=()=>{
        this.props.socialConnect();
    }
    handleSocialShare=(value)=>{
        this.props.shareOnSocial({pollToken:value,usertoken:this.props.votesUserInfo.id});
    }
    render(){
        return (
            <PollsContainer 
                pollItems={this.props.pollsData} 
                isPollAppError={this.props.pollsAppIsError}
                errorMessageApp={this.props.pollsAppErrorMessage}
                userLoggedIn={this.props.pollsApploggedIn}
                loginregister={this.handleLoginRegisterHandler}
                sharePollSocial={(value)=>this.handleSocialShare(value)}
                disconnectuser={this.handleDisconnect}
                PollVote={(value)=>this.castVoteHandler(value)}
                optionaddPoll={(value)=>this.addoptionToPoll(value)}
                resetErrorApp={this.onPollResetError}
                pollUser={this.props.pollsApploginData}
                newPoll={(value)=>this.handleNewPoll(value)}
                removePoll={(value)=>this.onRemovePollHandler(value)}
                />
        );
    }
}
const mapStateToProps=state=>{
    return{
        pollsData:state.votes.items,
        pollsAppIsError:state.votes.onError,
        pollsAppErrorMessage:state.votes.errorMessage,
        pollsApploggedIn:state.votes.votesisLoggedin,
        pollsApploginData:state.votes.votesUserInfo
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
        pollsExit:(value)=>{
            dispatch(pollAppExit(value));
        },
        getPolls:()=>{
            dispatch(fetchPolls());
        },
        castPollVote:(value)=>{
            dispatch(voteOnPoll(value));
        },
        unplugUser:(value)=>{
            dispatch(pollAppDisconnectUser(value));
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
