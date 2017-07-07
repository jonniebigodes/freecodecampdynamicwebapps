import '../../../../Assets/stylesheets/base.scss';
import '../../../../Assets/stylesheets/stocksApp.scss'
import 'react-date-picker/index.css';
import {DateField,DatePicker} from 'react-date-picker';
import React,{Component} from 'react';
import moment from 'moment';



class StockSearch extends Component {
    state = {  
        IsError:false,            
        startDate:moment.utc(),
        endDate:moment.utc(),
        searchTerm:'', }

    getCurrentDate=()=>{
        return new Date();
    }
    componentDidMount(){
        getCurrentDate();
    }

    handleEndDate=(e)=>{
        let newEndDate= moment(e);
        setState({endDate:e});
    }
    handleStartDate=(e)=>{
        let newStartDate=moment(e);
        setState({startDate:newStartDate});
    }
    updateSearchTerm=(e)=>{
        setState({searchTerm:e.target.value});
    }
    render() {
        return (
            <h2></h2>
        );
    }
}

export default StockSearch;