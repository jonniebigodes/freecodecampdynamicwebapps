import React, {Component} from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton';
import {setNightQuery, setLocationNight, fetchNightDataIfNeeded, setnightAppError} from '../../../../common/actions/nightLifeAppActions';
class NightLifeContainer extends Component {
    
    handleChange = (event, index, value) =>{
        console.log('====================================');
        console.log(`selected item:${value}`);
        console.log('====================================');
        this.props.setQueryItem(value);
    }
    updateSearchTerm=(e)=>{
        e.preventDefault();
        //console.log("update term: "+ e.target.value);
        this.props.setLocation(e.target.value);
    }
    cancelFormSubmit=(e)=>{
        e.preventDefault();
        return false;
    }
    render() {
        return (
            <form onSubmit={this.cancelFormSubmit} className="form-inline">
                <div className="form-group">
                    <SelectField key="itemSelector" 
                        floatingLabelText="What to search" 
                        value={this.props.nightvenue} 
                        onChange={(event, index, value)=>this.handleChange(event, index, value)}>
                        <MenuItem value={'default'} primaryText="default"/>
                        <MenuItem value={'restaurants'} primaryText="Restaurants"/>
                        <MenuItem value={'bars'} primaryText="Bars"/>
                    </SelectField>
            
                <TextField hintText="Fill in with a valid stock code"
                           errorText="This field is required"
                           floatingLabelText="Location"
                           value={this.props.location}
                           onChange={(e)=>this.updateSearchTerm(e)}
                          
                           />
                <RaisedButton 
                    key="btnSearch"
                    label="Search" onClick={(e) =>{this.searchStockInformation(e)}} 
                
                />
                </div>
            
            </form>
            
        );
    }
}
const mapStateToProps = state => {
    return {
        items: state.night.items, 
        location: state.night.location, 
        nightvenue: state.night.nightvenueQuery, 
        isError: state.night.onError, 
        errorMessageApp: state.night.errorMessage
    }

}
const mapDispatchToProps = dispatch => {
    return {
        setLocation: (value) => {
            dispatch(setLocationNight(value));
        },
        setQueryItem: (value) => {
            dispatch(setNightQuery(value));
        },
        searchItems: (value) => {
            dispatch(fetchNightDataIfNeeded(value));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NightLifeContainer)