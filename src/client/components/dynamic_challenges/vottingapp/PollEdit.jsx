import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import VoteButton  from './VotingButton';
import moment from 'moment';
class PollEdit extends Component{
    constructor(props){
       super(props);
       this.state={
           polloptionid:'',
           polloptionname:'',
           snackOpen:false,
           snackMessage:''
       };
   }
   componentWillReceiveProps(nextProps){
       const {selectedPoll}= this.props;
       if (selectedPoll.polloptions.length!==nextProps.selectedPoll.polloptions.length){
           this.generateListOptions();
           this.setState({polloptionid:'',polloptionname:''});
       }
   }
   updatePollOption=(e)=>{
        const{polloptionid}= this.state;
        if (polloptionid===''){
            this.setState({polloptionid:this.generatepollIdentifiers()});
        }
        this.setState({polloptionname:e.target.value});
    }
    generateListOptions=()=>{
        const {selectedPoll}= this.props;
        if (selectedPoll){
            let result=[];

            for (let item of selectedPoll.polloptions){
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
    generatepollIdentifiers=()=>{
        return `poll_option_${moment()}`;
    }
    pollOptionAdd=()=>{
        const{selectedPoll,addItemToPoll}= this.props;
        const{polloptionname,snackOpen}= this.state;
        const optionExists=selectedPoll.polloptions.find(x=>x.optionname.toLowerCase()==polloptionname.toLowerCase());
        if (optionExists){
            this.setState({snackOpen:!snackOpen,snackMessage:'Option with that name already exists',polloptionname:'',polloptionid:''});
            return;
        }
        addItemToPoll(
            {
                pollid:selectedPoll.polltoken,
                poll_option_id:this.state.polloptionid,
                poll_option_name:this.state.polloptionname
            }
        );
        this.setState({snackOpen:!snackOpen,snackMessage:`Option ${polloptionname} is being added. Please hold`,polloptionname:'',polloptionid:''});
        return;
    }
    handleCloseSnack=()=>{
        this.setState({snackOpen:!this.state.snackOpen});
    }
    cancelEditPoll=()=>{
        this.props.cancelEdit();
    }
    render(){
        const {selectedPoll}=this.props;
        const {snackOpen,snackMessage,polloptionname}=this.state;
        return(
            <div>
                <div className="row">
                    <div className="col-xs-6 col-md-4">
                        <form className="form-horizontal" onSubmit={this.cancelFormSubmit}>
                            <div className="form-group">
                                <div className="col-sm-10">
                                    <div className="editPollName">
                                        {selectedPoll.pollname}
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-10">
                                    <TextField hintText="Write down the option name"
                                            floatingLabelText="Option name"
                                            value={polloptionname}
                                            floatingLabelFixed
                                            onChange={this.updatePollOption}
                                            key="txtDetailNewPollOptionName"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-xs-6 col-sm-4 col-xs-offset-1">
                                        <VoteButton 
                                            key="btnPollDetailAddOption" 
                                            clickAction={this.pollOptionAdd}
                                            buttonText={"Add"}
                                            iconInfo={"save"}
                                            isDisabled={polloptionname===''?true:false}
                                            hasHref={false}
                                            hasSvg={false}/>
                                    </div>
                                    <div className="col-xs-6 col-sm-4">
                                        <VoteButton 
                                            key="btnPollDetailCancel"
                                            isDisabled={false}
                                            clickAction={this.cancelEditPoll}
                                            buttonText={"Cancel"}
                                            iconInfo={"cancel"}
                                            hasHref={false}
                                            hasSvg={false}/>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-8">
                        <div className="animated fadeInRight">
                            <List key="polloptionslist" style={{width:250,maxWidth:300}}>
                                <Subheader key="HeaderPollInfo">Poll options available</Subheader>
                                {this.generateListOptions()}
                            </List>
                        </div>
                    </div>
                </div>
                <Snackbar key="PollDetailSnackInfo" open={snackOpen} message={snackMessage} 
                    autoHideDuration={4000}
                    onRequestClose={this.handleCloseSnack}/>
            </div>
    );
   }
}
PollEdit.propTypes={
    selectedPoll:PropTypes.shape({
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
    addItemToPoll:PropTypes.func.isRequired,
    cancelEdit:PropTypes.func.isRequired
};
export default PollEdit;