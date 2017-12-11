import React, {Component } from 'react';
import PropTypes  from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import '../../../../Assets/stylesheets/base.scss';
import '../../../../Assets/stylesheets/stocksApp.scss';
import AppFooter from '../../AppFooter';
import AppHeader from '../../AppHeader';
import StockSearch from './StockSearch';
import { StockInformation } from './stockInformation';
import StockChartInfo from'./stockChartInfo';
class StockContainer extends Component {
   
    constructor(props){
        super(props);
        this.state={
            isChartOpen:false,
            selectedItem:{}
        };
    }
    
    /**
     * function to set the data and get it from the server
     */
    searchStockInformation=(value)=>{
        this.props.searchStockInfo(value);
    }
   
    /**
     * fat arrow event handler to reset the app error
     * @param {*} event handler
     */
    resetError=()=>{
        
        this.props.setErrorReset();
    }
    
   deleteItem=value=>{
       this.props.removeitem(value);
   }
   showChart=value=>{
      
       const {dataItems}=this.props;
      
       this.setState({isChartOpen:true,selectedItem:dataItems[value]});
   }
   exitPreview=()=>{
       this.setState({isChartOpen:false,selectedItem:{}});
   }
   renderSearches(){
        const {dataItems,numberstocks,searchingstocks}= this.props;
        if (searchingstocks){
            return(
                <div className="containersearchpreload">
                    <div className="textInfo">
                        setting up the for you...please hold
                    </div>
                    <div className="searchprogress">
                        <CircularProgress size={80} thickness={5} />
                    </div>
                </div>
            );
        }
        if (numberstocks===0){
            return(
                <div className="textInfo">
                    Nothing was added yet. Try searching something first.
                </div>
            );
        }
        let results=[];
        for (const item in dataItems){
            
            results.push(
                <StockInformation key={`StockInformation_${item}`}
                infoStocks={dataItems[item]}
                viewItem={this.showChart}
                stockRemove={this.deleteItem}
                />);
        }
        
        return results;
        
        
    }
    renderPreview=()=>{
        const{selectedItem}=this.state;
        return(
            <StockChartInfo stockChartData={selectedItem} exitPreview={this.exitPreview}/>
        );
    }
    /**
     * component render function
     */
    render(){
        const {isChartOpen}= this.state;
        const {isError,MessageAppError}=this.props;
        
        const actionsDialog = [
                <FlatButton
                    key="stockContainerDialogComponent"
                    label="Ok"
                    primary
                    onTouchTap={this.resetError}/>,
                ];
        
        return(
            <div className="container-fluid containerApp" key="containerContentAppStocks">
                
                <Dialog key="errorDialog"
                        actions={actionsDialog}
                        modal={false}
                        open={isError}
                        onRequestClose={this.resetError}>
                    <h3>Ups!!!!<br/> Something went wrong with the search!<br/>Check out the problem bellow</h3>
                    <br/>
                    <h4>{MessageAppError}</h4>
                </Dialog>
                <AppHeader appName="Supercalifragilistic Stock Search" appStyle="stocks" hasLoginNeeds={false}/>
                <div className="searchContainer">
                    <StockSearch queryStocks={this.searchStockInformation}/>
                </div>
                
                <div className={isChartOpen?"containerPreview":"containerResults"}>
                    {isChartOpen?this.renderPreview():this.renderSearches()}
                </div>
                <AppFooter appName="stocks"/>
            </div>
           
        );
    }

}
StockContainer.propTypes={
    setErrorReset:PropTypes.func,
    removeitem:PropTypes.func,
    isError:PropTypes.bool,
    MessageAppError:PropTypes.string,
    StockItems:PropTypes.object,
    searchStockInfo:PropTypes.func,
    dataItems:PropTypes.object,
    numberstocks:PropTypes.number.isRequired,
    searchingstocks:PropTypes.bool.isRequired
};
export default StockContainer;


