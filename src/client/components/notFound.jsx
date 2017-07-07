import React, {Component} from 'react';
import '../../Assets/stylesheets/base.scss'
import Container from 'muicss/lib/react/container';
import Panel from 'muicss/lib/react/panel';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
class NotFound extends Component {

    render() {
        return (
            <Container key="containerNotFound" fluid={true}>
                <div className="notFoundText">
                    404...404...Did i read that right?<br/>Someone took a wrong left turn somewhere....
                    <p/>
                    As your got here let me teach you something to ease your mind of things.<br/>
                    Namely some nice booze combos to try out.
                </div>
                <div id="boozetext" className="voffset5">
                    <Row>
                        <Col xs="6" md="4">
                            <Panel>
                                <div>
                                    <h3>Side Car</h3>
                                    <ul>
                                        <li>5 cl cognac</li>
                                        <li>2 cl triple sec</li>
                                        <li>2 cl lemon juice</li>
                                    </ul>
                                </div>
                            </Panel>
                        </Col>
                        <Col xs="6" md="4">
                            <Panel>
                                <div>
                                    <h3>Sex on the beach</h3>
                                    <ul>
                                        <li>4 cl vodka</li>
                                        <li>2 cl peach schnapps</li>
                                        <li>2 cl orange juice</li>
                                        <li>4 cl cranberry juice</li>
                                    </ul>
                                </div>
                            </Panel>
                        </Col>
                        <Col xs="6" md="4">
                            <Panel>
                                <div>
                                    <h3>Black russian</h3>

                                    <ul>
                                        <li>5 cl vodka</li>
                                        <li>2 cl coffee liqueur</li>
                                    </ul>

                                </div>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="6" md="4">
                            <Panel>
                                <div>
                                    <h3>Singapore Sling</h3>

                                    <ul>
                                        <li>4 cl gin</li>
                                        <li>1.5 cl cherry brandy</li>
                                        <li>.75 cl Cointreau</li>
                                        <li>.75 cl DOM Bénédictine</li>
                                        <li>1 cl Grenadine</li>
                                        <li>12 cl pineapple juice</li>
                                        <li>1.5 cl lime juice</li>
                                        <li>1 dash Angostura bitters</li>
                                    </ul>

                                </div>
                            </Panel>
                        </Col>
                        <Col xs="6" md="4">
                            <Panel>
                                <h3>Between the Sheets</h3>
                                <ul>
                                    <li>3 cl white rum</li>
                                    <li>3 cl cognac</li>
                                    <li>3 cl triple sec</li>
                                    <li>2 cl fresh lemon juice</li>
                                </ul>
                            </Panel>
                        </Col>
                        <Col xs="6" md="4">
                            <Panel>
                                <h3>Screwdriver</h3>
                                <ul>
                                    <li>5 cl vodka</li>
                                    <li>2 cl orange juice</li>
                                </ul>
                            </Panel>
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}

export default NotFound;