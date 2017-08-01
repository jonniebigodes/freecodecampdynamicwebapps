import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import '../../../../Assets/stylesheets/stocksApp.scss';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { PropTypes } from 'prop-types';
export class StockInformation extends Component {
    /**
     * class constructor
     * @param {*} props object sent from the server to construct the chart and feed it 
     */
     constructor(props){
        super(props);
        this.state={
            showChart:false,
            infoChart:{},
            itemColors:["#D44E3D","#EBAA13","#c5d5cb","#9fa8a3","#b3c2bf","#e9ece5","#edd9c0","#9068be","#3fb0ac","#173e43"],
            highestStockPrice:0
        }
    }
    
    /**
     * chart color randomizer
     */
    randomizeColors=()=>{
        return this.state.itemColors[this.randomizeStockNums(1,this.state.itemColors.length-1)];
    }
    /**
     * number randomizer
     */
    randomizeStockNums=(minValue,maxValue)=>{
            let item= Math.floor(Math.random()*maxValue)+minValue;
            return item;
    }
    /**
     * guard method for the component to check if it was mounted
     */
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

    /**
     * event handler to change the state and show the chart
     */
    chartShow=(e)=>{
        e.preventDefault();
        
        if (this.state.showChart){
            this.setState({showChart:false});
        }
        else{
            this.setState({showChart:true});
        }
    }

   
    /**
     * component render function
     */
    render() {
        const stockInfo={
            CardInfo:{
                zIndex:1000,
                
            }
        }
        return (
            <Card style={stockInfo.CardInfo}>
                <CardHeader title={this.props.chartData.stockCode}
                    subtitle={"Stocks for: "+ this.props.chartData.stockName}
                    actAsExpander={true}
                    showExpandableButton={true}
                    />
                     
                <CardText expandable={true}>
                    <Line data={this.state.infoChart}
                          width={200}
                          height={200}
                          options={{maintainAspectRatio:false}}/>
                </CardText>
            </Card>
           
        );
    }
}
StockInformation.propTypes={
    chartData:PropTypes.object.isRequired
}