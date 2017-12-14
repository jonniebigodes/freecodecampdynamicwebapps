import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Doughnut} from 'react-chartjs-2';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import VoteButton  from './VotingButton';
import PollEdit from './PollEdit';
class PollDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedoption:'',
            snackOpen:false,
            snackMessage:'',
            editMode:false,
            pollColors:['#6cc661','#4d064a','#e33039','#2e3618','#85a388','#7534d6','#f11a91','#e1d59e','#05c47d','#3dc556','#feb55a','#0abe5b','#56eae5','#6c7e4f','#3442ee','#58e9ee','#3d1cad','#e27a69','#93ab91','#419639','#FF6384','#36A2EB','#FFCE56']
        };
    }
    
    handleCloseSnack=()=>{
        this.setState({snackOpen:!this.state.snackOpen});
    }
    castVote=()=>{
        const {selectedoption,snackOpen}= this.state;
        const {pollInfo,votePoll}= this.props;
        if (selectedoption==='Default' || selectedoption===''){
            this.setState({snackOpen:!snackOpen, snackMessage:'The selected option is not valid'});
        }
        else{
            votePoll({polltoken:pollInfo.polltoken,optionToken:selectedoption});
        }   
    }

    handleVoteChanged=(event,index,value)=>{
        this.setState({selectedoption:value});
    }
    generateRandomNumberColor=()=>{
        let min=0;
        let max= this.state.pollColors.length;
        return Math.floor(max-Math.random()*(max-min));
    }
    generateChartData=()=>{
        let result={
            labels:[],
            datasets:[
                {
                    data:[],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }
            ]
        };
        const {pollInfo}= this.props;
        for (let item of pollInfo.polloptions){
            result.labels.push(item.optionname);
            result.datasets[0].data.push(item.votes);
            let tmpColor=this.state.pollColors[this.generateRandomNumberColor()];
            result.datasets[0].backgroundColor.push(tmpColor);
            result.datasets[0].hoverBackgroundColor.push(tmpColor);
        }
        return result;
    }
    generatePollOptions=()=>{
        let result=[];
        const {pollInfo}= this.props;
        result.push(<MenuItem value={'Default'} key="vote_option_default" primaryText={'Default'}/>);
        for (let item of pollInfo.polloptions){
            result.push(<MenuItem key={`vote_option_${item.idoption}`} value={item.idoption} primaryText={item.optionname}/>);
        }
        return result;
    }
    exitVotes=()=>{
        this.props.detailExit();
    }
    addOption=()=>{
        this.setState({editMode:!this.state.editMode});
    };
    
    cancelFormSubmit=()=>{
        return false;
    }
    addoptionPoll=(value)=>{
        
        this.props.addPollOption(value);
    }
    shareSocial=()=>{
        const{pollInfo,shareSocialNetwork}= this.props;
        shareSocialNetwork(pollInfo.polltoken);
        this.setState({snackOpen:true,snackMessage:`the poll: ${pollInfo.pollname} was shared on twitter`});
    }
    deletePoll=()=>{
        const{userInfo,pollInfo}=this.props;
        if (!userInfo.id==pollInfo.pollcreator){
           this.setState({snackOpen:true,snackMessage:'Cannot delete a poll you did not create'});
           return;
        }
        this.props.pollRemoval(this.props.pollInfo.polltoken);
        this.exitVotes();
    }
    
    // region render edit mode
    renderEditMode=()=>{
        const{pollInfo}= this.props;
        return(<PollEdit key="editcomponent" selectedPoll={pollInfo} addItemToPoll={this.addoptionPoll} cancelEdit={this.addOption}/>);
    }
    // end region
    // region rendering of options to edit poll
    canEdit=()=>{
        const {userInfo,pollInfo}= this.props;
        if (!userInfo.id){
            return;
        }
        if (userInfo.id===pollInfo.pollcreator.userid){
            return(
                <div>
                    <hr/>
                    <div className="row">
                        <div className="col-xs-6 col-sm-4">
                            <VoteButton key="btnPollDetailEdit"
                                iconInfo={"edit"}
                                buttonText={"Edit"} 
                                isDisabled={false} 
                                hasHref={false} 
                                hasSvg={false}
                                clickAction={this.addOption}/>
                        </div>
                        <div className="col-xs-6 col-sm-4">
                            <VoteButton 
                                key="btnPollDetailShare" 
                                iconInfo={"share"}
                                clickAction={this.shareSocial}
                                buttonText={"Share"} 
                                isDisabled={userInfo.local?true:false} 
                                hasHref={false}
                                hasSvg={false}/>
                        </div>
                        <div className="col-xs-6 col-sm-4">
                            <VoteButton 
                                key="btnPollDetailDelete"
                                iconInfo={"del"}
                                buttonText={"Delete"} 
                                isDisabled={false} 
                                hasHref={false} 
                                hasSvg={false}
                                clickAction={this.deletePoll}/>
                        </div>
                    </div>
                </div>
            );
        }
    }
    //endregion


    // region normal component render
    renderNormal=()=>{
        const{selectedoption}=this.state;
        const {pollInfo}= this.props;
        return (
            <div>
                <div className="row">
                    <div className="col-xs-6 col-md-4">
                        <div className="animated fadeInLeft">
                            <h3>{pollInfo.pollname}</h3>
                            <h4>cast your fortunes for one of the options</h4>
                            <SelectField key="itemSelector"
                                        floatingLabelText="Where to vote" 
                                        value={selectedoption} 
                                        className="selectFields"
                                        onChange={this.handleVoteChanged}>
                                        {this.generatePollOptions()}
                            </SelectField>
                            <hr/>
                            <div className="row">
                                <div className="col-xs-6 col-sm-4">
                                    <VoteButton key="btnPollDetailVote" 
                                            iconInfo={"vote"} 
                                            buttonText={"Vote"} 
                                            clickAction={this.castVote} 
                                            hasHref={false} hasSvg={false}
                                            isDisabled={false}/>
                                </div>
                                <div className="col-xs-6 col-sm-4">
                                    <VoteButton 
                                            key="btnPollDetailExit"
                                            iconInfo={"goback"} 
                                            buttonText={"Back"} 
                                            clickAction={this.exitVotes} 
                                            hasHref={false} hasSvg={false}
                                            isDisabled={false}/>
                                </div>
                                    
                            </div>
                                 {this.canEdit()}
                            </div>
                            
                        </div>
                    <div className="col-xs-12 col-sm-6 col-md-8">
                        <div className="animated fadeInRight">
                            <Doughnut key="PollDetailChart" data={this.generateChartData()}/>
                        </div>
                    </div>
                </div>     
            </div>
        );
    }
    //endregion
    
    render(){
        const{editMode,snackOpen,snackMessage}=this.state;
        return(
            <div className="container-fluid">
                {editMode?this.renderEditMode():this.renderNormal()}
                <Snackbar key="PollDetailSnackInfo" open={snackOpen} message={snackMessage} autoHideDuration={4000}
                    onRequestClose={this.handleCloseSnack}/>
            </div>
        );
         
    }
}
PollDetail.propTypes={
    userInfo:PropTypes.shape({
        id:PropTypes.string.isRequired,
        email:PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,
        local:PropTypes.bool.isRequired
    }).isRequired,
    pollInfo:PropTypes.shape({
        pollcreator:PropTypes.shape({
            userid:PropTypes.string.isRequired,
            username:PropTypes.string.isRequired
        }),
        pollname:PropTypes.string,
        polltoken:PropTypes.string,
        polloptions:PropTypes.arrayOf(
            PropTypes.shape({
                idoption:PropTypes.string,
                optionname:PropTypes.string,
                votes:PropTypes.number
            })
        )
    }),
    detailExit:PropTypes.func.isRequired,
    votePoll:PropTypes.func.isRequired,
    sharePoll:PropTypes.func,
    addPollOption:PropTypes.func,
    shareSocialNetwork:PropTypes.func.isRequired,
    pollRemoval:PropTypes.func
};
export default PollDetail;