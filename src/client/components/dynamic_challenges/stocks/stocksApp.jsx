import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {dynamicThemes} from '../../../../Assets/styles/challengesThemes';
import {
    fetchStocksIfNeeded,
    resetAppError,
    setAppError,
    delStocks,
    setStocksExit
} from '../../../../common/actions/stockAppActions';
import StockContainer from './StockContainer';
import '../../../../Assets/stylesheets/stocksApp.scss';
class stocksApp extends Component{
    
    
    componentWillUnmount(){
        this.props.unloadStocksApp();
    }
    /**
     * component render function
     */

    handleSearchRequest=value=>{
        this.props.searchItemsNeeded(value);
    }
    handleResetError=()=>{
        this.props.setErrorReset();
    }
    handleSetError=value=>{
        this.props.setError(value);
    }
    handleRemove=value=>{
        this.props.removeitem(value);
    }
    render(){
        
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(dynamicThemes.stockTheme)}>
                    <StockContainer key="ContainerAppStocks" 
                        searchStockInfo={this.handleSearchRequest} 
                        isError={this.props.AppisError}
                        MessageAppError={this.props.AppErrorInfo}
                        setErrorReset={this.handleResetError}
                        dataItems={this.props.queryResults}
                        removeitem={this.handleRemove}
                        numberstocks={this.props.stockresults.length}
                        searchingstocks={this.props.lookingforstocks}/>
            </MuiThemeProvider>
                
            );
           
    }
}
/**
 * funtion to connect the actions to the ui
 * @param {*} dispatch function send to store 
 */
const mapDispatchToProps = (dispatch) => {
    return {
        
        searchItemsNeeded:(value)=>{
            dispatch(fetchStocksIfNeeded(value));
        },
        setErrorReset:()=>{
            dispatch(resetAppError());
        },
        setError:(value)=>{
            dispatch(setAppError(value));
        },
        removeitem:(value)=>{
            dispatch(delStocks(value));
        },
        unloadStocksApp:()=>{
            dispatch(setStocksExit());
        }
    };
};
/**
 * fat arrow function to map the state of the app to props for the component
 * @param {*} state current state 
 */
const mapStateToProps =(state)=>{
    return {
       AppisError:state.stocks.onError,
       AppErrorInfo:state.stocks.errorMessage,
       queryResults:state.stocks.entities,
       stockresults:state.stocks.results,
       lookingforstocks:state.stocks.isSearching
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(stocksApp);
