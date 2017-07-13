import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import '../../../../Assets/stylesheets/stocksApp.scss';

export class StockInformation extends Component {
    state = { showChart:false }
     constructor(props){
        super(props);
        
    }
    chartShow=(e)=>{
        e.preventDefault();
        console.log("current State: "+state.showChart);
        if (state.showChart){
            setState({showChart:false});
        }
        else{
            setState({showChart:true});
        }
    }
    renderStockInfo=()=>{
        if (state.showChart){
            return(
                <Line data={props.chartData} options={{maintainAspectRatio:false}} onClick={(e)=>chartShow(e)}/>
                
            );
        }
        else{
            <div onClick={(e)=>chartShow(e)}>
                    <h1> ShowBanana</h1>
            </div>
        }
    }
    render() {
        return (
            <div className="ChartContainer" onClick={(e)=>chartShow(e)}>
                {renderStockInfo()}
            </div>
        );
    }
}
stockInformation.propTypes={
    chartData:React.PropTypes.object,
    
};
export default StockInformation;