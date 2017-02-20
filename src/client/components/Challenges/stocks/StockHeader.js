import React,{Component} from 'react';
import {Grid,Col,Row,Well,Button,Glyphicon,ButtonGroup} from 'react-bootstrap'; 
import { browserHistory } from 'react-router';

class Stockheader extends Component{
    constructor(props){
        super(props);
    }
    handleHomeButtonClick(e){
        e.stopPropagation();
        console.log("handled home got");
        browserHistory.push('/');
    }
    render(){
        return (
            <Well>
                <Grid>
                    <Row>
                        <Col xs={12} md={8}>
                            <div className="StockTitleHeader" id="ProjectTitle">
                                    Supercalifragilistic Voting Machine
                            </div>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button onClick={(e)=>this.handleHomeButtonClick(e)}>
                                <Glyphicon glyph="glyphicon glyphicon-home"/> Home
                            </Button>
                        </Col>
                    </Row>
                </Grid>
            </Well>
        );
    }
}
export default Stockheader;