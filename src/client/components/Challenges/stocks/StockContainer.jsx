import React, {Component } from 'react';
import { connect } from 'react-redux';
import '../../../../Assets/stylesheets/base.scss';
import '../../../../Assets/stylesheets/stocksApp.scss'
import 'react-date-picker/index.css';
import {DateField, DatePicker} from 'react-date-picker';

import moment from 'moment';
import Container from 'muicss/lib/react/container';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import Button from 'muicss/lib/react/button';
import {LoadStocks,setStock,setInitialData,setFinalDate} from '../../../../common/actions/stockAppActions';
class StockContainer extends Component {
     /*constructor(props){
        super(props);
        this.state={
            IsError:false,            
            startDate:moment.utc(),
            endDate:moment.utc(),
            searchTerm:'',
            
        }
    }*/
   
    componentDidMount=()=>{
        console.log("container stocks mounted");
        

    }
    componentWillMount=()=>{
        
    }
    getCurrentDate = () => {
        return new Date();
    }
    handleStartDate=(e)=>{
        let newDateRecieved= moment(e);
        //this.setState({startDate:newDateRecieved});
        this.props.startDate(newDateRecieved);
    }
    handleEndDate=(e)=>{
        let newDateRecieved= moment(e);
        this.props.endDate(newDateRecieved);
        //this.setState({endDate:newDateRecieved});
    }
    searchStockInformation=(e)=>{
        e.preventDefault();
        console.log("props:\nterm: "+ this.props.searchTerm+" date init: "+ this.props.startDate+" enddata: "+ this.props.endDate);
        //this.props.fetchData(this.props.searchTerm,this.props.startDate,this.props.endDate);
    }
    updateSearchTerm=(e)=>{
        e.preventDefault();
        console.log("update term: "+ e.target.value);
        this.props.searchTerm(e.target.value);
        console.log("props searchterm:"+ this.props.searchTerm);
    }
    cancelFormSubmit=(e)=>{
        e.preventDefault();
        return false;
    }
    renderSearch = () => {
        return (
            <Form inline={true} onSubmit={(e)=>this.cancelFormSubmit(e)}>
                <legend>Search Stocks:</legend>
                <Input label="Stock Name" floatingLabel={true} required={true} onChange={(e)=>this.updateSearchTerm(e)}/>
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
                        onChange={(e)=>this.handleStartDate(e)}
                        selected={this.props.startDate}/>
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
                        onChange={(e) =>this.handleEndDate(e)}
                        selected={this.props.endDate}/>
                </DateField>
                <Button variant="raised" onClick={(e) =>{this.searchStockInformation(e)}}>Submit</Button>
            </Form>
        );
    }
    renderStockInfo=()=>{
        return (<h2>sadas</h2>);
    }

    render(){
        return(
            <Container id="containerStocks" key="containerStocks" fluid={true}>
                {this.renderSearch()}
                
            </Container>
        );
    }
    
    


}
const mapStateToProps=(state)=>{
        return {
            items: state.items,
            startDate:state.startDate,
            endDate:state.endDate,
            searchTerm:state.search
        }
}
/*StockContainer.propTypes={
        fetchData:PropTypes.func,
        items:PropTypes.array,
        startDate:PropTypes.func,
        endDate:PropTypes.func,
        searchTerm:PropTypes.func
};*/
const mapDispatchToProps= (dispatch) => {
    return {
        
        // fetchData: (searchTerm,startDate,endDate) => dispatch(LoadStocks(searchTerm,startDate,endDate)),
        fetchData:(value)=>{
            dispatch({
                type:"SET_NAME_STOCK",
                payload:value
            });
        },
        searchTerm:(value)=>{
            dispatch({
                type:"SET_NAME_STOCK",
                payload:value
            });
        },
        startDate:(value)=>{
            dispatch({
                type:"SET_INITIAL_DATE",
                payload:value
            });
        },
        endDate:(value)=>{
            dispatch({
                type:"SET_END_DATE",
                payload:value
            });
        }
        //fetchData: (searchTerm,startDate,endDate) => dispatch(LoadStocks(searchTerm,startDate,endDate)),
       //searchTerm: (value)=>dispatch(setStock(value)),
        //startDate:(value)=>dispatch(setInitialData(value)),
        //endDate:(value)=>dispatch(setFinalDate(value))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(StockContainer);