import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Button from 'muicss/lib/react/button';

export class StockHeader extends Component {

    handleHomeButtonClick = (e) => {
        console.log("handled home got");
        browserHistory.push('/');
    };
    render() {
        return (
            <Row>
                <Col xs={12} md={8}>
                    <div className="StockTitleHeader" id="ProjectTitle">
                        Supercalifragilistic Stock Search
                    </div>
                </Col>
                <Col xs={6} md={4}>
                    <i className="material-icons"onClick={() => this.handleHomeButtonClick()} >home</i>
                </Col>
            </Row>
        );
    }
}
