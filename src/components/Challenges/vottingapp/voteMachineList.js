import '../../../Assets/stylesheets/votingApp.scss';
import '../../../Assets/stylesheets/base.scss';
import React,{Component} from 'react';
import {Jumbotron,Button,Glyphicon,Grid,Col,Row,InputGroup,ButtonGroup} from 'react-bootstrap';
import * as MockVoteData from '../../../mockData/mockVoting';
import PollItem from './voteMachinePollItem';
import PollDetails from './voteMachinePollDetails';
class VoteMachineList extends Component{
    constructor(props){
        super(props);
        this.state={currentLayoutActive:"list"};
    }
    

    getStandardlayout(){
        return <Jumbotron className="appVoteJumbotronSkin">
                    <Grid>
                        <Row className="voffset3">
                            <div className="informativeText voffset3">
                                Bellow are the polls that are hosted on the Supercalicfragilistic<br/>App Machine
                            </div>
                        </Row>
                        <Row className="voffset3">
                            
                            <Col xs={12} md={8}>
                                <ButtonGroup>
                                    <Button bsClass="btn btn-primary" aria-hidden="true" bsSize="small" id="btnLoginTwitter" onClick={this.btnLoginHandler.bind(this)}>
                                        <Glyphicon glyph="glyphicon glyphicon-th-list"/> Lines
                                    </Button>
                                    <Button bsClass="btn btn-primary"  aria-hidden="true" bsSize="lg" id="btnLoginTwitter" onClick={this.btnLoginHandler.bind(this)}>
                                        <Glyphicon glyph="glyphicon glyphicon-th"/> Rows
                                    </Button>
                                </ButtonGroup>  
                            </Col>
                            <Col xs={6} md={4}>
                                <div className="customSearchInput">
                                    <InputGroup >
                                        <input type="text" className="form-control input-lg" placeholder="search" />
                                        <span>
                                            <Button bsClass="btn-info" bsSize="small">
                                                <Glyphicon glyph="glyphicon glyphicon-search"/>
                                            </Button>
                                        </span>
                                        
                                    </InputGroup>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            {this.generateMockItemsLine()}
                        </Row>
                        <Row>
                            <div className="voffset3">
                                <div className="col-sm-offset-11" id="containerAddPoll">
                                    <Button bsClass="btn btn-primary" aria-hidden="true" bsSize="small" id="btnAddPoll" onClick={this.btnAddPollHandler.bind(this)}>
                                        <Glyphicon glyph="glyphicon glyphicon-plus-sign"/> Add Poll   
                                    </Button>
                                </div>
                            </div>
                        </Row>
                    </Grid>
                   
                    
                </Jumbotron>
    }
    btnLoginHandler(e){
        e.stopPropagation();
        
    }
    btnAddPollHandler(e){
        e.stopPropagation();
        //browserHistory.push('/voting/poll/create');
        console.log("btnAddPollHandler");
        this.setState({currentLayoutActive:"newPoll"});
    }
    
    componentDidMount(){
        console.log("get state: "+ this.state.currentLayoutActive);
        //this.setState({currentLayoutActive:"list"});
    }
    generateMockItemsLine(){
        let MockItemsPoll= [];
        MockVoteData.generateItemsByNumber(10,3);
        //MockVoteData.generateItems();
        let tmpItems= MockVoteData.getMocktems();
        tmpItems.forEach(function(element){
            MockItemsPoll.push(<PollItem ItemPollInformation={element} 
                                key={element.idPoll} id={element.id}/>);
        });
        return MockItemsPoll;
    }
    generateMockItemsColumn(){
        let MockItemsPoll= [];
        MockVoteData.generateItemsByNumber(10,3);
        let tmpItems= MockVoteData.getMocktems();
        tmpItems.forEach(function(element){
            MockItemsPoll.push(<PollItem ItemPollInformation={element} 
                                key={element.idPoll} id={element.id}/>);
        });
        return MockItemsPoll;
    }
    render(){
        return (
            <div id="ListPollContainer">
                {this.state.currentLayoutActive=="list"?this.getStandardlayout():<PollDetails isNewPoll={true}/>}
            </div>
        );
        
        
    }
};
export default VoteMachineList;