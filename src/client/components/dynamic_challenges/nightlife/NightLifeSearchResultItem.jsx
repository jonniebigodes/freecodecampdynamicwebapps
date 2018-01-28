import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import FccDynButton from '../../challengesUIComponents/FccDynButton';
class NightLifeSearchResultItem extends PureComponent {
    
   
    constructor(props){
        super(props);
        this.state={
            UserGoing:props.item.isGoing
        };
    }
    
    onGoNoGoClick=()=>{
        const{item,going,notGoing,isLoggedIn}= this.props;
        if (isLoggedIn){
            this.setState({UserGoing:!this.state.UserGoing});
            item.isGoing?notGoing(item.id):going(item.id);
        }
    }

    /**
     * component render function
     */
    render() {
       
        const {item}= this.props;
        const{UserGoing}= this.state;
       
        return (
           <div className="itemResult">
                <div className="infoNightItem">
                    <div>
                        <img src={item.img} className="imgInfo"/>
                    </div>
                    
                    <div className="textItemResult">
                        <span>{item.name}@{item.address} in {item.city}</span>
                        <br/>
                        <span>See what people are saying about it in <a href={item.url} target="_blank" rel="nofollow" className="linksyelp">here</a></span>
                    </div>
                    <div className="goNoGoPos">
                        <FccDynButton key={'btnGoNoGo'}
                                hasHref={false}
                                hasSvg={false}
                                isDisabled={false}
                                buttonText={UserGoing?"Going":"No Go"}
                                iconInfo={UserGoing?"thumbup":"thumbdown"}
                                clickAction={this.onGoNoGoClick}/>
                    </div>
                </div>
                
           </div>
        );

    }
}

NightLifeSearchResultItem.propTypes = {
    isLoggedIn:PropTypes.bool.isRequired,
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