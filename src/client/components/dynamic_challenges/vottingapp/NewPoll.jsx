import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {List} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import OptionPoll from './NewPollOption';
import moment from 'moment';
import VoteButton from './VotingButton';
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
        const {idPoll}= this.state;
        if (idPoll===''){
            this.setState({idPoll:this.generateID('poll')});
        }
        this.setState({PollName:e.target.value});
    }
    updatePollOptionName=(e)=>{
        const {polloptionId}= this.state;
        if (polloptionId===''){
            this.setState({polloptionId:this.generateID('optionpoll')});
        }
        this.setState({polloptionName:e.target.value});
    }
    addPoll=()=>{
        const {PollName}= this.state;
        const {pollUser}=this.props;
        if (PollName===''){
            this.setState({snackMessage:'Add a name to the poll first'});
            this.handleCloseSnack();
            return;
        }
        this.props.addPollToCollection(
            {
                pollname:this.state.PollName,
                pollcreator:{
                    userid:pollUser.id,
                    username:pollUser.name?pollUser.name:pollUser.email
                },
                polloptions:this.state.PollOptions
            }
        );
        this.props.newPollExit();
    }
    cancelAdd=()=>{
        this.props.newPollExit();
    }
    addOptionPoll=()=>{
        const{PollOptions,polloptionName}= this.state;
        if (PollOptions.length){
            let tmpOp= PollOptions.find(x=>x.optionname.toLowerCase()===polloptionName.toLowerCase());
            if (tmpOp){
                this.setState({snackMessage:`There is already a option with the name:${polloptionName}`});
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
    removePollOption=(e)=>{
        let tmpArrayOptions= [...this.state.PollOptions.slice(0,e),...this.state.PollOptions.slice(e+1)];
        this.setState({PollOptions:tmpArrayOptions});
    }
    
    generateListOptions(){
        let result=[];
        const {PollOptions}= this.state;
        let indexOption=0;
        for (let item of PollOptions){
            result.push(
                <OptionPoll key={`option_${item.idoption}`} indexItem={indexOption} optionItem={item} actionClick={this.removePollOption}/>
            );
            indexOption++;
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
        const {PollOptions,PollName}= this.state;
        return(
            <form onSubmit={this.cancelFormSubmit}>
                <div className="form-group">
                    <div className="col-sm-10">
                        <TextField hintText="Write down the poll name"
                                    floatingLabelText="Option name"
                                    floatingLabelFixed
                                    value={PollName}
                                    onChange={this.updatePollName}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-xs-6 col-sm-4 col-xs-offset-1">
                            <VoteButton key="newPollAddPoll" 
                                buttonText={"Add"} 
                                hasHref={false} 
                                hasSvg={false} 
                                isDisabled={PollOptions.length==0?true:false}
                                clickAction={this.addPoll}
                                iconInfo={"save"}/>
                        </div>
                        <div className="col-xs-6 col-sm-4">
                            <VoteButton key="newPollCancelButton"
                                buttonText={"Cancel"}
                                hasHref={false}
                                isDisabled={false}
                                hasSvg={false}
                                iconInfo={"cancel"}
                                clickAction={this.cancelAdd}/>
                        </div>
                    </div>
                </div>
            </form>   
        );
    }
    renderOptions(){
        const{polloptionName}= this.state;
        return(
            <form onSubmit={this.cancelFormSubmit}>
                <div className="form-group">
                    <div className="col-sm-10">
                        <TextField hintText="Write down the option name"
                                    floatingLabelText="Option name"
                                    floatingLabelFixed
                                    value={polloptionName}
                                    onChange={this.updatePollOptionName}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-10">
                        <VoteButton buttonText={"Add Option"}
                            hasHref={false}
                            hasSvg={false}
                            iconInfo={"addpoll"}
                            clickAction={this.addOptionPoll}
                            isDisabled={polloptionName==''?true:false}
                            />
                    </div>
                </div>
            </form>
        );
    }
    
    render(){
        const{snackOpen,snackMessage}= this.state;
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
                <Snackbar open={snackOpen} message={snackMessage} autoHideDuration={4000}
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
        name:PropTypes.string.isRequired
    }).isRequired,
    newPollExit:PropTypes.func.isRequired,
    addPollToCollection:PropTypes.func.isRequired
};
export default NewPoll;