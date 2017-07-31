import React, {Component} from 'react';
import {browserHistory} from 'react-router';

import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import '../../../../Assets/stylesheets/stocksApp.scss';
export class StockHeader extends Component {

    handleHomeButtonClick = (e) => {
        console.log("handled home got");
        browserHistory.push('/');
    };
    
    render() {
        
        return (
            <AppBar title="Supercalifragilistic Stock Search"
                    showMenuIconButton={false}
                    iconElementRight={<IconButton onClick={(e)=>this.handleHomeButtonClick(e)}>
                            <i className="material-icons md-24"> home</i>
                        </IconButton>}
            />
              
            /**
             
             
            <Row className="containerApp">
                <Col xs={12} md={8}>
                    <div className="headerText" id="ProjectTitle">
                        Supercalifragilistic Stock Search
                    </div>
                </Col>
                <Col xs={6} md={4}>
                    <i className="material-icons"onClick={() => this.handleHomeButtonClick()} >home</i>
                </Col>
            </Row>*/
        );
    }
}
