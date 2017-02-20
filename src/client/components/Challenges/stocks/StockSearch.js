import '../../../../Assets/stylesheets/base.scss';
import 'react-date-picker/index.css';
import {DateField,DatePicker} from 'react-date-picker';
import React,{Component} from 'react';
import moment from 'moment';
import {Grid,Row,Col,InputGroup,InputGroupAddon,FormControl,ButtonGroup} from 'react-bootstrap';

class StockSearch extends Component{
    constructor(props){
        super(props);
        this.state={
            startDate:moment.utc(),
            endDate:moment.utc(),
            searchdata:''
        }
    }
    getCurrentDate(){
        var itemDate=new Date();
        console.log("Current date is: "+itemDate);
        return itemDate;
    }

    componentDidMount(){
        this.getCurrentDate();
    }
    handleEndDate(e){
        //
        console.log("HANDLE DATE END: "+e);
        //
        var newEndData= moment(e);
        this.setState({endDate:newEndData});
        //this.setState({endDate:e});
    }
    handleStartDate(e){
        //to delete
        console.log("HANDLE DATE START: "+ e);
        //
        var newDateRecieved=moment(e);
        console.log("NEW DATE: "+ newDateRecieved.toDate());
        this.setState({startDate:newDateRecieved});
    }
    shouldComponentUpdate(nextProps,nextState){
        //console.log("PROPS: "+ nextProps+"\nnexttate:"+ nextState);
        let result= this.state.date != nextState.date;
        //console.log("equal ones: "+ result);
        return result;
    }
    updateSearchTerm(e){
        e.preventDefault();
        console.log("data input:´"+e.target.value);
        
        //console.log("SEARCH BOX:"+e.key);
        //let itemtoSearch= this.state.searchdata;
        //itemtoSearch+=e.key;
        //this.setState({searchdata:itemtoSearch});
        //console.log("set state changed: "+ this.state.searchdata);
    }
    GetStockInfo(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("done typing");
    }
    render(){
        return (
            <div>
                {/*<h2> here s a potato</h2>*/}
                <Grid fluid={true}>
                    <Row>
                        <Col md={12} xs={8}>
                            
                            <Col md={4} xs={6}>
                                
                                <div className="input-group">
                                    <span className="input-group-addon">Stock Search:</span>
                                    <input type="text" 
                                    className="form-control" 
                                    id="searchBox" 
                                    onChange={(e)=>this.updateSearchTerm(e)}/>
                                </div>
                               {/*<h2 className="voffset6"> search bar </h2>*/}
                            </Col>
                            <Col md={4} xs={6}>
                                <ButtonGroup>
                                    <DateField 
                                        
                                        dateFormat="YYYY-MM-DD"
                                        defaultValue={this.getCurrentDate()}
                                        updateOnDateClick={true}
                                        collapseOnDateClick={true}
                                        forceValidDate={true}
                                        footer={false}
                                        showClock={false}>
                                        <DatePicker
                                            id="startDate"
                                            navigation={true}
                                            forceValidDate={true}
                                            highlightToday={true}
                                            highlightWeekends={true}
                                            weekNumbers={false}
                                            weekStartDay={0}
                                            onChange={this.handleStartDate.bind(this)}
                                            selected={this.state.startDate}
                                            />

                                        </DateField>
                                    <h4>To:</h4>
                                    <DateField
                                        id="endate"
                                        dateFormat="YYYY-MM-DD"
                                        defaultValue={this.getCurrentDate()}
                                        forceValidDate={true}
                                        footer={false}
                                        showClock={false}
                                        dateFormat="YYYY-MM-DD"
                                        defaultValue={this.getCurrentDate()}
                                        updateOnDateClick={true}
                                        collapseOnDateClick={true}
                                        forceValidDate={true}
                                        footer={false}
                                        showClock={false}>
                                        <DatePicker
                                            navigation={true}
                                            forceValidDate={true}
                                            highlightToday={true}
                                            highlightWeekends={true}
                                            weekNumbers={false}
                                            weekStartDay={0}
                                            onChange={(e)=>this.handleEndDate(e)}
                                            selected={this.state.endDate}/>
                                        </DateField>

                                </ButtonGroup>
                                

                            </Col>

                        </Col>
                        <Col md={4} xs={6}>
                            <h3>
                                search stock summary
                            </h3>
                        </Col>
                    </Row>
                </Grid>    
            </div>
        );
    }
}
export default StockSearch;