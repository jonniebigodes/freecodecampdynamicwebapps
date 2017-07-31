import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import '../../../../Assets/stylesheets/stocksApp.scss';
import Panel from 'muicss/lib/react/panel';
import { PropTypes } from 'prop-types';
export class StockInformation extends Component {
 
     constructor(props){
        super(props);
        this.state={
            showChart:false,
            infoChart:{},
            itemColors:["#D44E3D","#EBAA13","#c5d5cb","#9fa8a3","#b3c2bf","#e9ece5","#edd9c0","#9068be","#3fb0ac","#173e43"],
            highestStockPrice:0
        }
    }
    randomizeColors=()=>{
        return this.state.itemColors[this.randomizeStockNums(1,this.state.itemColors.length-1)];
    }
    randomizeStockNums=(minValue,maxValue)=>{
            let item= Math.floor(Math.random()*maxValue)+minValue;
            return item;
    }
    componentDidMount=()=>{
        
        let tmpColor= this.randomizeColors();
        //console.log("color: "+ tmpColor);
        let tmpObj={
            labels:[],
            datasets:[],
            
            
        }
        let tmpDataArray=[];
        let tmphigh=0;
        
        this.props.chartData.stockData.map((element)=>{
            
            tmpObj.labels.push(element.stockDate);
            tmpDataArray.push(element.closePrice)
            if (tmphigh<element.closePrice){
                tmphigh= element.closePrice;
            }
        });
        tmpObj.datasets.push({
            label: this.props.chartData.stockCode+ '\nBetween: '+ this.props.chartData.stockQueryStart+' and '+this.props.chartData.StockQueryEnd,
            fill: false,
            lineTension: 0.1,
            backgroundColor: tmpColor,
            borderColor: tmpColor,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: tmpColor,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: tmpColor,
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: tmpDataArray
        });
        this.setState({infoChart:tmpObj,highestStockPrice:tmphigh});
    }
    
    chartShow=(e)=>{
        e.preventDefault();
        //console.log("current State: "+this.state.showChart);
        if (this.state.showChart){
            this.setState({showChart:false});
        }
        else{
            this.setState({showChart:true});
        }
    }
    renderStockInfo=()=>{
        if (this.state.showChart){
            return(
               
                <Line data={this.state.infoChart} 
                options={{maintainAspectRatio:false}} 
                />
                
            );
        }
        else{
            return (
                <div>
                    <h4> {this.props.chartData.stockCode}</h4>
                    <hr/>
                    {this.props.chartData.stockName}
                    <br/>
                    <h5>Highest Stock Price: {this.state.highestStockPrice}</h5>
                    
                    

                </div>
            );
        }
    }
    render() {
        return (
            <Panel onClick={(e)=>this.chartShow(e)} className={this.state.showChart?'chartVis':'noChart'}>
                {this.renderStockInfo()}
            </Panel>
        );
    }
}
StockInformation.propTypes={
    chartData:PropTypes.object.isRequired
}