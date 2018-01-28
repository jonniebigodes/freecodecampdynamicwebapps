import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import NightLifeSearchResultItem from './NightLifeSearchResultItem';
import '../../../../Assets/stylesheets/nightApp.scss';
import '../../../../Assets/stylesheets/base.scss';
class NightItemsContainer extends PureComponent{
    
    shouldComponentUpdate(nextProps){
        const {itemsNumber}= this.props;
       
        if (itemsNumber!=nextProps.itemsNumber){
           return true;
        }
        return false;
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
     * function to inject the results of the search
     */
    renderItems(){
        const {items,isUserLogged}= this.props;
        let results=[];
        for (const nightItem in items) {
            
            results.push(
                <div className="containerResults" 
                        key={`cittem:${items[nightItem].id}`}>
                        <NightLifeSearchResultItem 
                                    key={`nightitem_${items[nightItem].id}`} 
                                    item={items[nightItem]}
                                    going={this.handleNightAdd} 
                                    notGoing={this.handleNightRemove}
                                    isLoggedIn={isUserLogged}/>
                </div>  
            );
        }
        
        return results;
    }
    /**
     * render function
     */
    render(){
        return (
            <div>
                {this.renderItems()}
            </div>
        );
    }
}
NightItemsContainer.propTypes={
    isUserLogged:PropTypes.bool.isRequired,
    onAddNight:PropTypes.func.isRequired,
    onRemoveNight:PropTypes.func.isRequired,
    items:PropTypes.object.isRequired,
    itemsNumber:PropTypes.number.isRequired
};
export default NightItemsContainer;