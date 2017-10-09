import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import NightLifeSearchResultItem from './NightLifeSearchResultItem';
import '../../../../Assets/stylesheets/nightApp.scss';
import '../../../../Assets/stylesheets/base.scss';
class NightItemsContainer extends Component{
    /**
     * component constructor 
     */
    constructor(props){
        super(props);
        this.state={
            list:[]
        };
    }
    /**
     * event handler to add user to night event
     * @param {String} e id of the item to be added
     */
    handleNightAdd=(e)=>{
        
        this.props.onAddNight(e);
    }
    /**
     * event handler to remove user from the night event
     */
    handleNightRemove=(e)=>{
       
        this.props.onRemoveNight(e);
    }
    /**
     * guard method to check if the item is already added and rendered
     * @param {String} value item to be queried
     * @returns {boolean} result of the list of items added contains the parameter
     */
    isItemAdded=value=>{
        if (!this.state.list.length){
            return false;
        }
        for (let item of this.state.list){
            if (item===value){
                return true;
            }
        }
        return false;
    }
    /**
     * method to add the item to the rendered items already
     * @param {String} value item to be added
     */
    addToItems=item=>{
        this.state.list.push(item);
    }
    /**
     * function to inject the results of the search
     */
    renderItems(){
        let results=[];
        for (let item of this.props.items){
            for (let nightItem of item.searchResults.results){
                results.push(
                    <div className="containerItemNight" 
                        key={`cittem:${nightItem.id}`}>
                        <NightLifeItem 
                                    key={`nightitem_${nightItem.id}`} 
                                    item={nightItem}
                                    userIsLogged={this.props.userLogged}
                                    going={(e)=>this.handleNightAdd(e)} 
                                    notGoing={(e)=>this.handleNightRemove(e)}/>
                        <div className="voffset3"/>
                    </div>
                        
                );
            }
            
            
                
        }
        return results;
    }
    /**
     * render function
     */
    render(){
        return (
            <div className="container-fluid">
                <h3>testing it out</h3>
                
            </div>
        );

        
        
        
    }
}
NightItemsContainer.PropTypes={
    userLogged:PropTypes.bool.isrequired,
    onAddNight:PropTypes.func.isRequired,
    onRemoveNight:PropTypes.func.isRequired,
    items:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired
};
export default NightItemsContainer;