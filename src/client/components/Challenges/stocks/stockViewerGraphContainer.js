import React,{Component} from 'react';
import {Grid,Row,Col} from 'react-bootstrap';
import StockViewerChart from './stockViewerChart'
import StockSearch from './StockSearch';
import * as MockDataStock from '../../../mockData/mockStocks';

class StockViewerContainer extends Component{
    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        console.log("stockViewerContainer did mount");
    }
    
  
    render(){
        let initialData= MockDataStock.generateDummyGraphData("papapaya");
        
        return (

            <div>
                <Grid fluid={true}>
                    <Row>
                        <StockViewerChart chartData={initialData} className="ChartContainer"/>

                        <hr/>
                        <StockSearch/>
                    </Row>
                </Grid>
                
            </div>
            
            
        );
    }
};
export default StockViewerContainer;
