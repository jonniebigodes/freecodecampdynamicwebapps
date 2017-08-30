import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Card, CardActions, CardHeader, CardText,CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import '../../../../Assets/stylesheets/nightApp.scss';
class NightLifeItem extends Component{

    constructor(props){
        super(props);
        this.state={isExpanded:false};
    }
    renderList=()=>{
        return (
            <div className="containerItem">
                
            </div>
        );
    }
    showInfo=()=>{
        this.setState({isExpanded:!this.state.isExpanded});
    }

    renderCard=()=>{
        return (
            <Card expanded={this.state.isExpanded} onExpandChange={this.showInfo}>
                <CardHeader
                    title={this.props.item.name}
                    subtitle={this.props.item.name+ " @ "+ this.props.item.city}
                    actAsExpander={true}
                    showExpandableButton={false}
                />
                <CardMedia expandable={true}>
                    <img src={this.props.item.img} className="img_night"/>
                </CardMedia>
                <CardText expandable={true}>
                    <h4>Located at: { this.props.item.address}</h4>
                    <h4>See what people are saying about <a href={this.props.item.url} target="_blank">it</a></h4>
                </CardText>
                <CardActions>
                    <FlatButton label="Action1" />
                    <FlatButton label="Action2" />
                </CardActions>
            </Card>
        );
    }
    render(){
        if (this.props.isList){
            return this.renderList();
        }
        else{
            return this.renderCard();
        }
    }
}

NightLifeItem.props={
    item:PropTypes.object.isRequired,
    isList:PropTypes.bool.isRequired  
}
export default NightLifeItem;