import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ActionThumbDown from 'material-ui/svg-icons/action/thumb-down';
import '../../../../Assets/stylesheets/nightApp.scss';

class NightLifeSearchResultItem extends Component {
    /**
     * component constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            isgoing:false
        };
    }
    componentDidMount=()=>{
        //console.log(`component did mount :${this.props.item.id}`);
        if (this.props.userIsLogged){
            this.setState({isgoing:this.props.item.isGoing});
        }
    }
    /**
     * card expand function handler
     */
    showInfo = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }
    goingThere=()=>{
        if (!this.props.userIsLogged){
            return;
        }
        if (this.state.isgoing){
            this.props.notGoing(this.props.item.id);
        }
        else{
            this.props.going(this.props.item.id);
        }
        this.setState({
            isgoing: !this.state.isgoing
        });
    }
   
    /**
     * component render function
     */
    render() {
        return (
            <Card expanded={this.state.isExpanded} onExpandChange={this.showInfo}>
                <CardHeader
                    title={this.props.item.name}
                    subtitle={`${this.props.item.name} @ ${this.props.item.city}`}
                    actAsExpander
                    showExpandableButton={false}/>
                <CardMedia expandable>
                    <img src={this.props.item.img} className="img_night"/>
                </CardMedia>
                <CardText expandable>
                    <h4>Located at: {this.props.item.address}</h4>
                    <h4>See what people are saying about
                        <a href={this.props.item.url} target="_blank"> it </a>
                    </h4>
                </CardText>
                <CardActions>
                    <FlatButton label={this.state.isgoing?'Go':'No Go'} onClick={this.goingThere}
                    icon={this.state.isgoing?<ActionThumbUp/>:<ActionThumbDown/>} />
                </CardActions>
            </Card>
        );

    }
}

NightLifeSearchResultItem.propTypes = {
    userIsLogged:PropTypes.bool.isRequired,
    item: PropTypes.shape({
        address:PropTypes.string,
        category:PropTypes.string,
        city:PropTypes.string,
        id:PropTypes.string,
        img:PropTypes.string,
        isGoing:PropTypes.bool,
        name:PropTypes.string,
        url:PropTypes.string,
        zipCode:PropTypes.string
    }).isRequired,
    going: PropTypes.func.isRequired,
    notGoing: PropTypes.func.isRequired
};
export default NightLifeSearchResultItem;