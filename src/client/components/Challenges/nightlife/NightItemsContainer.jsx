import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import NightLifeItem from './NightLifeItem';
import '../../../../Assets/stylesheets/nightApp.scss';
import '../../../../Assets/stylesheets/base.scss';
class NightItemsContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            list:true
        };
    }
    renderItems(){
        let results=[];
        for (let item of this.props.items){
            for (let nightItem of item.searchResults.results){
                
                results.push(
                    <div className="containerItemNight" key={"cittem"+ nightItem.id}>
                        <NightLifeItem key={"nightitem_"+ nightItem.id} item={nightItem} isList={false}/>
                        <div className="voffset3"/>
                    </div>
                    
                );
            }
                
        }
        return results;
    }
    render(){
        return (
            <div className="container-fluid">
                {this.renderItems()}
            </div>
        );

        
        
        
    }
}
NightItemsContainer.PropTypes={
    onAddNight:PropTypes.func.isRequired,
    onRemoveNight:PropTypes.func.isRequired,
    items:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired
}
export default NightItemsContainer;