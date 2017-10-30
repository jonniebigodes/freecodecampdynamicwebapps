import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import moment from 'moment';
class NewPoll extends Component{
    constructor(props){
        super(props);
        this.state={
            snackOpen:false,
            snackMessage:'',
            PollName:'',
            polloptionId:'',
            polloptionName:'',
            PollOptions:[]
        };
    }
    generateID=()=>{
        return `poll_option_${moment()}`;
    }
    updatePollName=(e)=>{
        if (this.state.idPoll===''){
            this.setState({idPoll:this.generateID('poll')});
        }
        this.setState({PollName:e.target.value});
    }
    updatePollOptionName=(e)=>{
        if (this.state.polloptionId===''){
            this.setState({polloptionId:this.generateID('optionpoll')});
        }
        this.setState({polloptionName:e.target.value});
    }
    addPoll=()=>{
        if (this.state.PollName===''){
            this.setState({snackMessage:'Add a name to the poll first'});
            this.handleCloseSnack();
            return;
        }
        this.props.addPollToCollection(
            {
                pollname:this.state.PollName,
                pollUser:this.props.pollUser.id,
                pollcreatormail:this.props.pollUser.email,
                polloptions:this.state.PollOptions
            }
        );
        this.props.newPollExit();
    }
    cancelAdd=()=>{
        this.props.newPollExit();
    }
    addOptionPoll=()=>{
        if (this.state.PollOptions.length){
            let tmpOp= this.state.PollOptions.find(x=>x.optionname.toLowerCase()===this.state.polloptionName.toLowerCase());
            if (tmpOp){
                this.setState({snackMessage:`There is already a option with the name:${this.state.polloptionName}`});
                this.handleCloseSnack();
                return;
            }
        }
        this.setState(
            {
                PollOptions:this.state.PollOptions.concat(
                    {
                        idoption:this.state.polloptionId,
                        optionname:this.state.polloptionName,
                        votes:0
                    }
                )
            ,polloptionId:'',polloptionName:''});
    }
    removePoll=(e)=>{
        
        this.setState({PollOptions:this.state.PollOptions.filter(x=>x.idoption!=e)});
    }
    generateListOptions(){
        let result=[];
        for (let item of this.state.PollOptions){
            result.push(
                <ListItem key={`option_poll_${item.idoption}`} 
                    primaryText={item.optionname}
                    leftIcon={<ContentInbox key={`icon_${item.idoption}`} />} onClick={()=>this.removePoll(item.idoption)}/>
            );
        }
        return result;
    }
    cancelFormSubmit=()=>{
        return false;
    }
    handleCloseSnack=()=>{
        this.setState({snackOpen:!this.state.snackOpen});
    }
    renderFormPoll(){
        return(
            <form onSubmit={this.cancelFormSubmit}>
                <div className="form-group">
                    <div className="col-sm-10">
                        <TextField hintText="Write down the Poll name"
                                    floatingLabelText="Option name"
                                    floatingLabelFixed
                                    value={this.state.PollName}
                                    onChange={this.updatePollName}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-1 col-sm-10">
                                        <RaisedButton label="Add" primary onClick={this.addPoll} disabled={this.state.PollOptions.length==0?true:false}/>
                                        <RaisedButton label="Cancel" secondary onClick={this.cancelAdd}/>
                    </div>
                </div>
            </form>   
        );
    }
    renderOptions(){
        return(
            <form onSubmit={this.cancelFormSubmit}>
                <div className="form-group">
                    <div className="col-sm-10">
                        <TextField hintText="poll Option Identifier"
                            floatingLabelText="poll Option Identifier"
                            floatingLabelFixed 
                            disabled
                            value={this.state.polloptionId}/>     
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-10">
                        <TextField hintText="Write down the Poll name"
                                    floatingLabelText="Option name"
                                    floatingLabelFixed
                                    value={this.state.polloptionName}
                                    onChange={this.updatePollOptionName}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-1 col-sm-10">
                        <RaisedButton label="Add Option" primary onClick={this.addOptionPoll} disabled={this.state.polloptionName==''?true:false}/>
                        
                    </div>
                </div>
            </form>
        );
    }
    
    render(){
        return (
           <div className="container-fluid">
               <div className="row">
                   <div className="col-xs-6 col-sm-4">
                       <div className="animated fadeInDown">
                            {this.renderFormPoll()}
                       </div>
                    </div>
                    <div className="col-xs6 col-sm-4">
                        <div className="animated zoomIn">
                            {this.renderOptions()}
                        </div>
                    </div>
                    <div className="col-xs6 col-sm-4">
                        <div className="animated fadeInUp">
                            <List key="containerOptions">
                                <Subheader>Poll Options added</Subheader>
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
}
NewPoll.propTypes={
    pollUser:PropTypes.shape({
        id:PropTypes.string.isRequired,
        email:PropTypes.string.isRequired,
        password:PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,
        city:PropTypes.string.isRequired,
        countrystate:PropTypes.string.isRequired,
        country:PropTypes.string.isRequired
    }).isRequired,
    newPollExit:PropTypes.func.isRequired,
    addPollToCollection:PropTypes.func.isRequired
};
export default NewPoll;