import {Line} from 'react-chartjs-2';
import React,{Component} from 'react';
import '../../../../Assets/stylesheets/stocksApp.scss';
class StockViewerChart extends Component{
    
    constructor(props){
        super(props);
        this.state={showChart:false}
    }
    componentDidMount(){
        console.log("StockViewerChart did mount");

    }
    componentWillUnmount(){

    }
    showChart(e){
        e.preventDefault();
        console.log("current state: "+this.state.showChart);
        if (this.state.showChart==false){
            this.setState({showChart:true});
        }
        else{
            this.setState({showChart:false});
        }
       
    }
    shouldComponentUpdate(nextProps,nextState){
        let result= this.state.showChart != nextState.showChart;
        console.log("UDATE CHART: "+result);
        return result;
    }
    getInfoDataStock(){
        if (this.state.showChart){
            return(
                <Line data={this.props.chartData} options={{maintainAspectRatio:false}} onClick={(e)=>this.showChart(e)}/>
                
            );
        }
        else{
            return(
                <div onClick={(e)=>this.showChart(e)}>
                    <h1> ShowBanana</h1>
                </div>
            );
        }
    }
    render(){
        
        return (
            <div className="ChartContainer" onClick={(e)=>this.showChart(e)}> 
                
                {this.getInfoDataStock()}
                
            </div>
            
        );
    }
    
};
StockViewerChart.propTypes={
    chartData:React.PropTypes.object,
    
};
export default StockViewerChart;