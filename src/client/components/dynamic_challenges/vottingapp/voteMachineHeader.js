//import '../../../Assets/stylesheets/votingApp.scss';
import '../../../../Assets/stylesheets/votingApp.scss';
import React,{Component} from 'react';
import { browserHistory } from 'react-router';

import {Grid,Col,Row,Well,Button,Glyphicon,ButtonGroup} from 'react-bootstrap'; 
class VoteAppHeader extends Component{
    constructor(props){
        super(props);
        this.state={loggedIn:false};
    }
    onHomeButtonClickHandler(e){
        e.stopPropagation();
        browserHistory.push('/');
    }
    ComponentWillMount(){
        //this.setState({loggedIn:true});
    }
    render(){
        return (
            <div id="ProjectContainer">
                    <Well bsSize="lg" className="appVoteJumbotronSkin">
                        <Grid>
                            <Row>
                                <Col xs={12} md={8}>
                                    <div className="votingAppTitle" id="ProjectTitle">
                                        Supercalifragilistic Voting Machine
                                    </div>
                                </Col>
                                <Col xs={6} md={4}>
                                    <ButtonGroup>
                                        <Button onClick={this.onHomeButtonClickHandler.bind(this)} bsStyle="primary">
                                            <Glyphicon glyph="glyphicon glyphicon-th-list"/> Home
                                        </Button>
                                        <Button bsStyle="primary">
                                            <Glyphicon glyph="glyphicon glyphicon-th-list"/> Login
                                        </Button>
                                    </ButtonGroup>
                                    {/*
                                    <Col xs={6} md={4}>
                                        
                                    </Col>
                                    
                                    <Col xs={6} md={4}>
                                        
                                    </Col>*/}
                                </Col>
                                
                            </Row>
                        </Grid>
                        {/*
                        <div className="col-xs-6">
                            <Button>
                                <Glyphicon glyph="glyphicon glyphicon-th-list"/> home
                            </Button>
                        </div>
                        <div className="col-xs-6">
                            <Button>
                                <Glyphicon glyph="glyphicon glyphicon-th-list"/> Login
                            </Button>
                        </div>*/}

                    </Well>
                
            </div>
        );
    }
};
export default VoteAppHeader;