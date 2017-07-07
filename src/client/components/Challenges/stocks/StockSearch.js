import '../../../../Assets/stylesheets/base.scss';
import '../../../../Assets/stylesheets/stocksApp.scss'
import 'react-date-picker/index.css';
import {DateField,DatePicker} from 'react-date-picker';
import React,{Component} from 'react';
import moment from 'moment';
import {Grid,Row,Col,InputGroup,InputGroupAddon,ButtonGroup,Button} from 'react-bootstrap';

class StockSearch extends Component{
    constructor(props){
        super(props);
        this.state={
            IsError:false,            
            startDate:moment.utc(),
            endDate:moment.utc(),
            searchTerm:'',
           
            
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
        // to delete
        console.log("NEW DATE: "+ newDateRecieved.toDate());
        //
        this.setState({startDate:newDateRecieved});
    }
    shouldComponentUpdate(nextProps,nextState){
        //console.log("PROPS: "+ nextProps+"\nnexttate:"+ nextState);
        let result= (this.state.date != nextState.date)||(this.state.IsError!=nextState.IsError);
        console.log("updating component: "+ result);
        return result;
    }
    updateSearchTerm(e){
        e.preventDefault();
        
        //console.log("SEARCH BOX:"+e.key);
        //let itemtoSearch= this.state.searchdata;
        //itemtoSearch+=e.key;
        //this.setState({searchdata:itemtoSearch});
        //console.log("set state changed: "+ this.state.searchdata);
        this.setState({searchTerm:e.target.value});
    }
    GetStockInfo(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("done typing");
        //console.log("startDate:"+ this.state.startDate.format("DD-MM-YYYY"));
        //console.log("endDate:"+this.state.endDate.format("DD-MM-YYYY"));
        
        let urlinfoStock= "http://localhost:5000/api/data/stocksearch?startdate="+this.state.startDate.format("DD-MM-YYYY")+"&enddate="+this.state.endDate.format("DD-MM-YYYY")+"&stockName="+this.state.searchTerm.toUpperCase();
        //console.log("URL:\n"+ urlinfoStock);
        if (this.state.searchTerm.length==0){
            //alert("Someone Forgot something didnt he?");
            this.setState({IsError:true});
        }
        else{
            fetch(urlinfoStock)
                .then(function(response){
                    //console.log("RESULT:\n"+ response.json());
                    return response.json();
                    //return response;
                })
                .then(function(responseJson){
                    console.log(responseJson);
                    //let itemToSend=JSON.parse(responseJson);
                    //console.log("Parsed item:\nCode:"+itemToSend.stockCode+" stardate: "+ itemToSend.stockQueryStart+" end: "+ itemToSend.stockQueryEnd);
                    //this.props.SearchStocks(responseJson);
                    console.log("Parsed item:\nCode:"+responseJson.stockCode+" stardate: "+ responseJson.stockQueryStart+" end: "+ responseJson.StockQueryEnd);
                    this.props.addSearchItem(responseJson);
                })
                .catch(function(error){
                    console.error("ERROR FETCH:\n"+error);
                });
        }
        console.log("State term: "+ this.state.searchTerm+" len"+this.state.searchTerm.length+ " IsErrorstate"+ this.state.IsError);
    }
    dismissError(e){
        e.preventDefault()
        this.setState({IsError:false});
    }
   showLayout(){
       if (this.state.IsError){
        return(
            <div id="Container">
                <Grid fluid={true} className="GridError">
                    <Row>
                        <div id="containerFormSearch">
                            <form className="form-inline" onSubmit={(e)=>this.GetStockInfo(e)}>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="searchInput" placeholder="Stock Code"
                                        onChange={(e)=>this.updateSearchTerm(e)}/>
                                </div>
                                <div className="form-group">
                                    <label>Dates:</label>
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
                                        <label>TO:</label>
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

                                </div>
                                <Button bsStyle="primary" bsSize="small" type="submit">Search</Button>
                            </form>
                        </div>
                        
                        
                    </Row>
                </Grid>
                <div className="GridSearchError voffset5">
                        <div className="SearchError">
                            <h3>Someone forgot to add a stock to search</h3>
                            <Button onClick={(e)=>this.dismissError(e)}>Ok</Button>
                        </div>
                </div>
            </div>
            
            
            
        );
       }
       else{
           return(
                <Grid fluid={true}>
                    <Row>
                        <div id="containerFormSearch">
                            <form className="form-inline" onSubmit={(e)=>this.GetStockInfo(e)}>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="searchInput" placeholder="Stock Code"
                                        onChange={(e)=>this.updateSearchTerm(e)}/>
                                </div>
                                <div className="form-group">
                                    <label>Dates:</label>
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
                                        <label>TO:</label>
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

                                </div>
                                <Button bsStyle="primary" bsSize="small" type="submit">Search</Button>
                            </form>
                        </div>
                        
                        
                    </Row>
                </Grid>    
            
           );
       }
   }
    render(){
        {return this.showLayout()}

    }
    
}
StockSearch.propTypes={
    addSearchItem:React.PropTypes.func
};
export default StockSearch;