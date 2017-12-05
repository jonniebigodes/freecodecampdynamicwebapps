import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PinButton from './pinButton';
import '../../../../Assets/stylesheets/pinsApp.scss';
class PinView extends Component{

    /**
     * class constructor
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.state={
            starsNumber:0,
            mouseInside:false
        };
        
    }
    /**
     * guard method framework
     * @param {*} nextProps obj containing the next props to be injected
     */
    componentWillReceiveProps(nextProps){
        
        const {imageInfo}= this.props;
        
        if (nextProps.imageInfo.stars!==imageInfo.stars){
            this.setState({stars:imageInfo.stars});
        }   
    }
    /**
     * class property to handle the image preview exit
     
     */
    imageViewExit=()=>{
        this.props.exitView();
    }
    /**
     * class property to handle the pin vote
     
     */
    addVote=()=>{
        this.setState({starsNumber:this.props.imageInfo.stars+1});
        this.props.voteOnImage({wall:this.props.imageInfo.wallid,image:this.props.imageInfo.imageid});
    }
    /**
     * class property to delete the pin
     
     */
    deletePinCollection=()=>{
        this.props.removePinWall({walltoken:this.props.imageInfo.wallid,imgtoken:this.props.imageInfo.imageid});
        setTimeout(() => {
            this.imageViewExit();
        }, 1000);

    }
    /**
     * event handler
     
     */
    onMouseEnter=()=>{
        this.setState({mouseInside:true});
    }
     /**
     * event handler
     
     */
    onMouseLeave=()=>{
        this.setState({mouseInside:false});
    }
     /**
     * render method to show info
     
     */
    renderOptionsNologged(){
        const {starsNumber}= this.state;
        return(
            <div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-8">
                        <div className="posButtonsPinView">
                            <PinButton 
                                iconInfo={starsNumber>0?"star":"starborder"} 
                                buttonText={"Vote"} 
                                clickAction={this.addVote}
                                hasHref={false}
                                hasSvg={false}
                                />
                         
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-8">
                        <div className="posButtonsPinView">
                            <PinButton iconInfo={"back"} 
                                buttonText={"Go Back"} 
                                clickAction={this.imageViewExit} 
                                hasHref={false} hasSvg={false}/>
                         
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    /**
     * render method to show info
     
     */
    renderOptionsLogged(){
       
        const {starsNumber}= this.state;
        return(
            <div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md8">
                        <div className="posButtonsPinView">
                            <PinButton iconInfo={"del"} buttonText={"Delete"} clickAction={this.deletePinCollection} hasHref={false}/>
                           
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-8">
                        <div className="posButtonsPinView">
                            <PinButton iconInfo={starsNumber>0?"star":"starborder"} 
                            buttonText={"Vote"} 
                            clickAction={this.addVote} 
                            hasHref={false} 
                            hasSvg={false}/>
                            
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-8">
                        <div className="posButtonsPinView">
                            <PinButton iconInfo={"back"} 
                            buttonText={"Go Back"} 
                            clickAction={this.imageViewExit} 
                            hasHref={false} 
                            hasSvg={false}/>
                           
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    /**
     * render method to show only action
     
     */
    renderActions=()=>{
        const {userInformation,imageInfo,isUserLogged}= this.props;
        if (isUserLogged){
            if (userInformation.name==imageInfo.imageCreator){
                return this.renderOptionsLogged();
            }
        }
        return this.renderOptionsNologged();
    }
    /**
     * render method to show only infor
     
     */
    renderItemOption(){
        const {imageInfo,}=this.props;
        const {starsNumber}= this.state;
        return(
            <div className="panel panel-default">
                    <div className="panel-heading"/>
                    <div className="panel-body">
                        
                        <div className="overlaypinContainer">
                            <div className="optionsPin">
                               {this.renderActions()}
                            </div>
                            <div className="pin">
                                <img src={imageInfo.imageLink} key={`img_${imageInfo.wallid}_${imageInfo.imageid}`} className="imgPin"/>
                            </div>
                            
                        </div>
                    
                    </div>
                    <div className="panel-footer">
                        <div className="textPin">
                            <div>What:{imageInfo.imageName}</div>
                            <div>By:{imageInfo.imageCreator}</div>
                            <div>Liked by:{starsNumber>imageInfo.stars?starsNumber:imageInfo.stars}</div>
                        </div>
                    </div>
                </div>
            
        );
    }
    /**
     * render method to show info
     
     */
    renderNormal(){
        const {imageInfo}=this.props;
        const {starsNumber}= this.state;
        return(
            <div className="panel panel-default">
                <div className="panel-heading"/>
                <div className="panel-body">
                    <div className="overlaypinContainer">
                        <div className="pin">
                            <img src={imageInfo.imageLink} key={`img_${imageInfo.wallid}_${imageInfo.imageid}`} className="imgPin"/>
                        </div>
                    </div>
                
                </div>
                <div className="panel-footer">
                    <div className="textPin">
                        <div>What:{imageInfo.imageName}</div>
                        <div>By:{imageInfo.imageCreator}</div>
                        <div>Liked by:{starsNumber>imageInfo.stars?starsNumber:imageInfo.stars}</div>
                    </div>
                    
                </div>
        </div>
        );
    }
    /**
     * render method
     
     */
    render(){
        const {mouseInside}= this.state;
        return(
            <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                {mouseInside?this.renderItemOption():this.renderNormal()}
            </div>
        );
    }
}

PinView.propTypes={
    isUserLogged:PropTypes.bool.isRequired,
    userInformation:PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        twitter_token: PropTypes.string,
        twittername: PropTypes.strings
    }),
    imageInfo:PropTypes.shape({
        wallid:PropTypes.string.isRequired,
        wallname:PropTypes.string.isRequired,
        imageCreator:PropTypes.string.isRequired,
        imageid:PropTypes.string.isRequired,
        imageName:PropTypes.string.isRequired,
        imageLink:PropTypes.string.isRequired,
        stars:PropTypes.number.isRequired
    }).isRequired,
    exitView:PropTypes.func.isRequired,
    voteOnImage:PropTypes.func,
    removePinWall:PropTypes.func.isRequired,
};
export default PinView;