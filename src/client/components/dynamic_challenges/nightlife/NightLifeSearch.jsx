import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import FccDynButton from '../../challengesUIComponents/FccDynButton';
import '../../../../Assets/stylesheets/nightApp.scss'; 
class NightLifeSearch extends Component{

    constructor(props){
        super(props);
        this.state={
            nightvenue:'default',
            location:'',
            itemsQueried:0
        };
    }

    resetFields=()=>{
        setTimeout(() => {
            this.setState({nightvenue:'default', location:'',
            itemsQueried:0});
        }, 2500);
    }

    /**
     * @param {*} e html element that triggers the update(textinput)
     */ 
    updateSearchTerm=(e)=>{
        //e.preventDefault();
        //console.log("update term: "+ e.target.value);
        //this.props.nightsetLocation(e.target.value);
        this.setState({location:e.target.value});
    }
     /**
     * event handler for select field onChange
     * @param {*} event the event triggered by the componentWillUnmount
     * @param {String} index the index selected to be updated
     * @param {String} value the value to be updated
     */
    handleChange = (event, index, value) =>{
        this.setState({nightvenue:value});
        //this.props.nightSetQueryItem(value);
    }
    /**
     * event handler for select field onChange
     * @param {*} event the event triggered by the componentWillUnmount
     * @param {String} index the index selected to be updated
     * @param {String} value the value to be updated
     */
    handleNumberChanged=(event,index,value)=>{
        //this.props.nightsetNumberOfItemsToSearch(value);
        this.setState({itemsQueried:value});
    }
    searchYelp=value=>{
        const {nightvenue,location,itemsQueried}= this.state;
        const{onSearchAction}= this.props;
        if (value.key==='Enter'){
            value.preventDefault();
            //let tmpNight={token:'',query:nightvenue,where:location,who:'',howMany:itemsQueried};
            onSearchAction({token:'',query:nightvenue,where:location,who:'',howMany:itemsQueried});
        }
    }


    render(){
        const {nightvenue,location,itemsQueried}= this.state;
        return(
            <div className="containerSearch" >
               
                <SelectField key="itemSelector" 
                                    floatingLabelText="What" 
                                    value={nightvenue} 
                                    style={{width:200}}
                                    onChange={this.handleChange}>
                                    <MenuItem value={'default'} primaryText="default"/>
                                    <MenuItem value={'restaurants'} primaryText="Restaurants"/>
                                    <MenuItem value={'bars'} primaryText="Bars"/>
                </SelectField>
                <SelectField key="numberSelector" 
                            floatingLabelText="How many"
                            style={{width:200}}
                            value={itemsQueried}
                            onChange={this.handleNumberChanged}>
                                    <MenuItem value={0} primaryText="0"/>
                                    <MenuItem value={5} primaryText="5"/>
                                    <MenuItem value={10} primaryText="10"/>
                                    <MenuItem value={15} primaryText="15"/>
                                    <MenuItem value={20} primaryText="20"/>
                                    <MenuItem value={30} primaryText="30"/>
                                    <MenuItem value={40} primaryText="40"/>
                                    <MenuItem value={50} primaryText="50"/>
                </SelectField>
                <TextField 
                        hintText="Fill in with a valid city"
                                    floatingLabelText="Location"
                                    value={location}
                                    //style={{width:300}}
                                    underlineShow={false}
                                    onKeyPress={this.searchYelp}
                                    onChange={this.updateSearchTerm}/>
                <FccDynButton key={'btnRegisterCancel'}
                                    hasHref={false}
                                    hasSvg={false}
                                    isDisabled={false}
                                    buttonText={'Search'}
                                    iconInfo={'search'}
                                    clickAction={this.searchYelp}/>
            </div>
        );
    }
}
export default NightLifeSearch;

NightLifeSearch.propTypes={
    onSearchAction:PropTypes.func.isRequired,
};