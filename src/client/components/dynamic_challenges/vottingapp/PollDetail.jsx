import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import {Doughnut} from 'react-chartjs-2';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import moment from 'moment';
class PollDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedoption:'',
            snackOpen:false,
            snackMessage:'',
            editMode:false,
            polloptionid:'',
            polloptionname:'',
            pollColors:['#6cc661','#4d064a','#e33039','#2e3618','#85a388','#7534d6','#f11a91','#e1d59e','#05c47d','#3dc556','#feb55a','#0abe5b','#56eae5','#6c7e4f','#3442ee','#58e9ee','#3d1cad','#e27a69','#93ab91','#419639','#FF6384','#36A2EB','#FFCE56']
        };
    }
    
    generatepollIdentifiers=()=>{
        return `poll_option_${moment()}`;
    }
    handleCloseSnack=()=>{
        this.setState({snackOpen:!this.state.snackOpen});
    }
    castVote=()=>{
        if (this.state.selectedoption==='Default' || this.state.selectedoption===''){
            this.setState({snackOpen:!this.state.snackOpen, snackMessage:'The selected option is not valid'});
        }
        else{
            this.props.votePoll({polltoken:this.props.pollInfo.polltoken,optionToken:this.state.selectedoption});
            //alert(`GOT DATA:${JSON.stringify({polltoken:this.props.pollInfo.polltoken,polloption:this.state.selectedoption},null,2)}`);
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
        
        for (let item of this.props.pollInfo.polloptions){
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
        const optionsfromPoll= this.props.pollInfo.polloptions;
        result.push(<MenuItem value={'Default'} key="vote_option_default" primaryText={'Default'}/>);
        for (let item of optionsfromPoll){
            result.push(<MenuItem key={`vote_option_${item.idoption}`} value={item.idoption} primaryText={item.optionname}/>);
        }
        return result;
    }
    exitVotes=()=>{
        this.props.detailExit();
    }
    addOption=()=>{
        this.setState({editMode:!this.state.editMode,polloptionid:'',polloptionname:''});
    };
    generateListOptions=()=>{
        if (this.props.pollInfo){
            let result=[];

            for (let item of this.props.pollInfo.polloptions){
                result.push(
                    <ListItem primaryText={item.optionname} key={`list_option_:${item.idoption}`}/>
                );
            }
            return result;
        } 
    }
    cancelFormSubmit=()=>{
        return false;
    }
    updatePollOption=(e)=>{
        if (this.state.polloptionid===''){
            this.setState({polloptionid:this.generatepollIdentifiers()});
        }
        this.setState({polloptionname:e.target.value});
    }
    addoptionPoll=()=>{
        const optionExists=this.props.pollInfo.polloptions.find(x=>x.optionname.toLowerCase()==this.state.polloptionname.toLowerCase());
        if (optionExists){
            this.setState({snackOpen:!this.state.snackOpen,snackMessage:'Option with that name already exists',polloptionname:'',polloptionid:''});
            return;
        }
        this.props.addPollOption(
            {
                pollid:this.props.pollInfo.polltoken,
                poll_option_id:this.state.polloptionid,
                poll_option_name:this.state.polloptionname
            });
    }
    shareSocial=()=>{
        this.props.shareSocialNetwork(this.props.pollInfo.polltoken);
    }
    deletePoll=()=>{
        this.props.pollRemoval(this.props.pollInfo.polltoken);
    }
    canEdit=()=>{
        if (!this.props.userInfo.email){
            return;
        }
        
        if ((this.props.userInfo.email.toLowerCase()==this.props.pollInfo.pollcreator.toLowerCase())||(this.props.userInfo.name.toLowerCase()==this.props.pollInfo.pollcreator.toLowerCase())){
            return (
                <div>
                    <hr/>
                    <RaisedButton key="btnPollDetailEdit"label="Edit" onClick={this.addOption}/>
                    <RaisedButton key="btnPollDetailShare" label="Share" disabled={this.props.userInfo.local?true:false} primary onClick={this.shareSocial} />
                    <RaisedButton key="btnPollDetailDelete" label="Delete" primary onClick={this.deletePoll}/>
                </div>
             );
        }
    }
    //region normal component render
    renderNormal=()=>{
        return (
            <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-6 col-md-4">
                            <div className="animated fadeInLeft">
                                <h3>{this.props.pollInfo.pollname}</h3>
                                <h4>cast your fortunes for one of the options</h4>
                                <SelectField key="itemSelector"
                                            floatingLabelText="Where to vote" 
                                            value={this.state.selectedoption} 
                                            className="selectFields"
                                            onChange={(event, index, value)=>this.handleVoteChanged(event, index, value)}>
                                            {this.generatePollOptions()}
                                        </SelectField>
                                <hr/>
                                <RaisedButton key="btnPollDetailVote" label="Vote" onClick={this.castVote}  />
                                
                                <RaisedButton key="btnPollDetailExit" label="Go Back" onClick={this.exitVotes}/>
                                {this.canEdit()}
                            </div>
                            
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-8">
                            <div className="animated fadeInRight">
                                <Doughnut key="PollDetailChart" data={this.generateChartData()}/>
                            </div>
                        </div>
                    </div>
                    <Snackbar key="PollDetailSnackInfo" open={this.state.snackOpen} message="Cannot cast on that option" autoHideDuration={4000}
                    onRequestClose={this.handleCloseSnack}/>
            </div>
        );
    }
    //endregion
    //region edit mode render
    renderEditMode=()=>{
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-6 col-md-4">
                        <form className="form-horizontal" onSubmit={this.cancelFormSubmit}>
                            <div className="form-group">
                                <div className="col-sm-10">
                                    <TextField hintText="poll name"
                                                floatingLabelText="poll name"
                                                floatingLabelFixed 
                                                disabled
                                                value={this.props.pollInfo.pollname}
                                                key="txtDetailNewPollName"/>
                                    
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-10">
                                    <TextField hintText="Write down the option name"
                                                floatingLabelText="Option name"
                                                floatingLabelFixed
                                                onChange={this.updatePollOption}
                                                key="txtDetailNewPollOptionName"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-1 col-sm-10">
                                    <RaisedButton label="Add" key="btnPollDetailAddOption" primary onClick={this.addoptionPoll}/>
                                    <RaisedButton label="Cancel" key="btnPollDetailCancel" secondary onClick={this.addOption}/>
                                </div>
                            </div>
                        </form>
                    
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-8">
                        <div className="animated fadeInRight">
                            <List key="polloptionslist">
                                <Subheader key="HeaderPollInfo" >Poll options available</Subheader>
                                {this.generateListOptions()}
                            </List>
                        </div>
                    </div>
                </div>
                <Snackbar open={this.state.snackOpen} message={this.state.snackMessage} autoHideDuration={4000}
                onRequestClose={this.handleCloseSnack}/>
            </div>
            
        );
    }
    //endregion
    render(){
        return this.state.editMode?this.renderEditMode():this.renderNormal();
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
        pollcreator:PropTypes.string,
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