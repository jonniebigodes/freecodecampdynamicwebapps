import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import '../../../../Assets/stylesheets/stocksApp.scss';
export class StockInformation extends Component {
    /**
     * class constructor
     * @param {*} props object sent from the server to construct the chart and feed it 
     */
     constructor(props){
        super(props);
    }
    removeStock=()=>{
        
        const {infoStocks,stockRemove}= this.props;
        stockRemove(infoStocks.id);
    }
    viewChartItem=()=>{
        const {infoStocks,viewItem}= this.props;
        viewItem(infoStocks.id);
    }
    searchHigh(value){
        let result=0;
        for (let item of value){
            if (result<item.highestPrice){
                result= item.highestPrice;
            }
        }
        return result;
    }

    searchLow(value){
        let result=100000;
        for (let item of value){
            if (result>item.lowestPrice){
                result=item.lowestPrice;
            }
        }
        return result;
    }
    /**
     * component render function 
     */
    render() {
        const {infoStocks}= this.props;
        return (
            <div className="itemContainer">
                <div className="closeItem" onClick={this.removeStock}>
                    <span>X</span>
                </div>
                <div className="dataItem" onClick={this.viewChartItem}>
                    <div className="textInfo">
                        Entity: {infoStocks.code}
                    </div>
                    <hr/>
                    <div className="textInfo">
                        Start:{infoStocks.start}
                    </div>
                    <div className="textInfo">
                        End:{infoStocks.end}
                    </div>
                    <div className="textInfo">
                        Highest Price:{this.searchHigh(infoStocks.data)}
                    </div>
                    <div className="textInfo">
                        Lowest Price:{this.searchLow(infoStocks.data)}
                    </div>
                </div>
            </div>
        );
    }
}
StockInformation.propTypes={
    viewItem:PropTypes.func.isRequired,
    infoStocks:PropTypes.object.isRequired,
    stockRemove:PropTypes.func.isRequired
};