//import '../../../Assets/stylesheets/votingApp.scss';
//import '../../../Assets/stylesheets/base.scss';
import '../../../../Assets/stylesheets/votingApp.scss';
import '../../../../Assets/stylesheets/base.scss';
import React,{Component} from 'react';
import {Grid,Col,Row,Button,DropdownButton,MenuItem,ButtonGroup} from 'react-bootstrap';
import {Doughnut} from 'react-chartjs-2';

import VoteAppHeader from './voteMachineHeader'; 
//import * as MongoDbFactory from '../../../dbFactory.js';
import * as MockData from '../../../mockData/mockVoting';


class PollDetails extends Component{
    
    constructor(props){
        super(props);
        this.state={pollAdd:false};
        
    }
    generateDataSetChart(value){
        var datasetResult={labels:[],datasets:[]};
        var tmpData={data:[],backgroundColor:[],hoverBackgroundColor:[]};

        for (var i=0;i<value.pollOptions.length;i++){
            datasetResult.labels.push(value.pollOptions[i].optionPoll);
            tmpData.data.push(value.pollOptions[i].numVotes);
            
        }
        tmpData.backgroundColor=['#FF6384','#36A2EB','#FFCE56'];
        tmpData.hoverBackgroundColor=['#FF6384','#36A2EB','#FFCE56'];
        datasetResult.datasets.push(tmpData);
        return datasetResult;
    }
    getPollOptions(value){
        var result=[];
        for (var i=0;i<value.pollOptions.length;i++){
            result.push(<MenuItem key={i} eventKey={"pollOption"+i}>{value.pollOptions[i].optionPoll}</MenuItem>)
        }
        return result;
    }
    onPollOptionSelect(e){
        
        console.log("Selected Option: "+e);
    }
    generatePollDetails(){

        //console.log("generatePollDetails:\n"+ this.props.params.idPoll);
        let tmpItemPoll= MockData.getItemById(this.props.params.idPoll);
        //console.log("item Found: "+ tmpItemPoll.idPoll+" pollnmame: " +tmpItemPoll.pollname+"\noptions" +tmpItemPoll.pollOptions.length );
        return(
            <Grid fluid={true} className="appVoteJumbotronSkin">
                <Row>
                    <Col xs={6} md={4} className="pollDetailsColumn">
                        <div id="polname" className="pollDetailsNamePoll">
                            {tmpItemPoll.pollname}
                        </div> 
                        <ButtonGroup vertical block>
                                <DropdownButton title="Choose your poison" 
                                                bsStyle="primary" id="DropdownButtonPolls" 
                                                onSelect={this.onPollOptionSelect.bind(this)}>
                                    {this.getPollOptions(tmpItemPoll)}
                                </DropdownButton>
                                <Button bsClass="btn btn-primary" aria-hidden="true" bsSize="lg" id="btnVote">
                                    Cast Vote
                                </Button>
                                <Button bsClass="btn btn-primary" aria-hidden="true" bsSize="lg" id="btnShare">
                                    Share on Twitter
                                </Button>
                                
                            </ButtonGroup>
                        
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <div className="pollDetailsChartText">
                                Bellow are the aggregated results of the poll
                            </div>
                            <Doughnut data={this.generateDataSetChart(tmpItemPoll)}/>
                        </Row>
                    </Col>
                </Row>
                <Row className="voffset9">
                </Row>
            </Grid>
        );
    }
    generateNewPoll(){
        return(
            <Grid fluid={true}>
                <Row>
                    <Col xs={6} md={4}>
                        
                    </Col>

                </Row>
            </Grid>
        );
    }
    render(){
        console.log("poll details is new poll: "+this.props.isNewPoll);
        if(this.props.isNewPoll){
            return (
                
                <div id="ContainerExPoll">
                    
                    <h2>new banana</h2>
                </div>
            );
        }
        else{
            return (
                <div id="ContainerExPoll">
                    <div id="ComponentContainer">
                        <VoteAppHeader/>
                    </div>
                    {this.generatePollDetails()}
                </div>
            );
        }
        
    }
};
export default PollDetails;