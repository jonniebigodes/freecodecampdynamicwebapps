import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
class StockChartInfo extends Component{

    constructor(props){
        super(props);
        this.state={
            itemColors:["#D44E3D","#EBAA13","#c5d5cb","#9fa8a3","#b3c2bf","#e9ece5","#edd9c0","#9068be","#3fb0ac","#173e43"],
            infoChart:{
                labels:[],
                datasets:[]
            }
        };
    }
    componentWillMount(){
        const {stockChartData}=this.props;
        let tmpColor= this.randomizeColors();
        let tmpChartData={
            labels:[],
            datasets:[]
        };
        
        tmpChartData.labels=stockChartData.data.map((element)=>{
            
            return element.date;
        });
        
        tmpChartData.datasets.push({
            label:`${stockChartData.code}\nBetween: ${stockChartData.start} and ${stockChartData.end}`,
            fill: false,
            lineTension: 0.1,
            //backgroundColor: tmpColor,
            backgroundColor:'#6b3932',
            //borderColor: tmpColor,
            borderColor:'#6b3932',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: tmpColor,
            pointBackgroundColor: '#6b3932',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: tmpColor,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data:stockChartData.data.map((item)=>{
                
                return item.closingPrice;
            })
        });
        
        this.setState({infoChart:tmpChartData});
    }
    chartPreviewExit=()=>{
        const {exitPreview}=this.props;
        exitPreview();
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
    render(){
        const {infoChart}=this.state;
        const {stockChartData}=this.props;
        return(
           
            <div className="previewContainer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="closeItem" onClick={this.chartPreviewExit}>
                            <span>X</span>
                        </div>
                    </div>
                   {/*  <div className="row">
                        <div className="col-xs-6 col-md-4">
                            <div className="infopreview">
                                <div className="previewText">
                                        Entity: {stockChartData.code}
                                </div>
                                <div className="previewText">
                                        {stockChartData.name}
                                </div>
                                <div className="previewText">
                                        Between {stockChartData.start}
                                </div>
                                <div className="previewText">
                                        and {stockChartData.end}
                                </div> 
                            </div>
                        </div>
                        
                    </div> */}
                    <div className="row">
                        <div className="col-xs-12 col-md-8 col-xs-offset-2">
                            <div className="chartpreview">
                                <Line key={`chart_${stockChartData.id}`}
                                options={{responsive:true}}
                                height={400}
                                width={800}
                                
                                data={infoChart}/>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>    
                
            
        );
    }
}
StockChartInfo.propTypes={
    stockChartData:PropTypes.object,
    exitPreview:PropTypes.func
};
export default StockChartInfo;