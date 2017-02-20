import {Line} from 'react-chartjs-2';
import React,{Component} from 'react';
import '../../../../Assets/stylesheets/stocksApp.scss';
class StockViewerChart extends Component{
    
    constructor(props){
        super(props);
    }
    componentDidMount(){
        console.log("StockViewerChart did mount");

    }
    componentWillUnmount(){

    }
    
    render(){
        
        return (
            <div className="ChartContainer"> 
                {/*<Line data={this.props.chartData} width={50} height={300} options={{
                    maintainAspectRatio: false
                }}/>*/}
                
                <Line data={this.props.chartData} options={{maintainAspectRatio:false}}/>
                
            </div>
            
        );
    }
};
export default StockViewerChart;