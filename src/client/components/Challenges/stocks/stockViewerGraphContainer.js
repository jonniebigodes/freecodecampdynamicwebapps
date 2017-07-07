import React,{Component} from 'react';
import {Grid,Row,Col} from 'react-bootstrap';
import StockSearch from './StockSearch';
//import * as MockDataStock from '../../../mockData/mockStocks';
import StockListContainer from './StockListContainer';
class StockViewerContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            resultsearchedStock:{}
        };

        
    }
    gotStockInfo(value){
        this.setState({
            resultsearchedStock:value
        });
        console.log("stock viewer graph got the item: "+ value);
        //console.log("")
    }
    componentDidMount(){
        console.log("stockViewerContainer did mount");
    }
  
    render(){
        //let initialData= MockDataStock.generateDummyGraphData("papapaya");
        
        return (

            <div>
                <Grid fluid={true}>
                    <Row>
                        <StockSearch addSearchItem={this.gotStockInfo.bind(this)}/>
                    </Row>
                    <hr/>
                    
                    <Row>
                        <Col xs={6} md={4}>
                           <StockListContainer stockInformation={this.state.resultsearchedStock}/>
                        </Col>
                    </Row>
                </Grid>
                
            </div>
            
            
        );
    }
};

export default StockViewerContainer;
