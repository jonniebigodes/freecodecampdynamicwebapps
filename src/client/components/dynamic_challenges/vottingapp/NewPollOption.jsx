import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import ActionDelete from 'material-ui/svg-icons/action/delete';
class OptionPoll extends Component{

    constructor(props){
        super(props);
    }
    setOptionSelected=()=>{
        const{indexItem,actionClick}= this.props;

        
        actionClick(indexItem);
    }
    render(){
        const {indexItem,optionItem}= this.props;
        return(
            <ListItem 
                key={`option_${optionItem.idoption}`} 
                value={indexItem}
                primaryText={optionItem.optionname}
                leftIcon={<ActionDelete key={`icon_${optionItem.idoption}`}/>}
                onClick={this.setOptionSelected}/>
        );
    }
}
OptionPoll.propTypes={
    indexItem:PropTypes.number.isRequired,
    optionItem:PropTypes.shape({
        idoption:PropTypes.string,
        optionname:PropTypes.string
    }).isRequired,
    actionClick:PropTypes.func
};
export default OptionPoll;