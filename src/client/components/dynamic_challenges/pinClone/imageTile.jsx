import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {GridTile} from 'material-ui/GridList';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Star from 'material-ui/svg-icons/toggle/star';

import IconButton from 'material-ui/IconButton';
import '../../../../Assets/stylesheets/pinsApp.scss'; 
class ImageTile extends Component{

    /**
     * class constructor
     */
    constructor(props){
        super(props);
        this.state={
            stars:0
        };
    }
    /**
     * guard methods from the framework
     */
    componentWillMount(){
        this.setState({stars:this.props.imageInfo.stars});
    }
    /**
     * class property to handle the vote operation
     */
    handlevoteImage=()=>{
        const {imageInfo}= this.props;
        this.props.voteImage({wall:imageInfo.wallid,image:imageInfo.imageid});
        let stars= this.state.stars;
        stars+=1;
        this.setState({stars:stars});
    }
    /**
     * class property to handle the wall selection
     */
    viewWall=()=>{
        const {imageInfo}= this.props;
        this.props.viewWall(imageInfo.wallid);
    }
    /**
     * class property to handle the pin selection
     */
    selectviewImage=()=>{
        const {imageInfo}= this.props;
        this.props.viewImage(imageInfo);
    }
    /**
     * render method
     */
    render(){
       const {imageInfo}= this.props;
       const {stars}=this.state;
        return(
            <GridTile key={imageInfo.imageid} 
            title={imageInfo.imageName}
            titlePosition="top"
            actionPosition="left"
            actionIcon={
                <IconButton
                    tooltip={`stars for this image:${this.state.stars}`}
                    tooltipPosition="bottom-right"
                    touch
                    onClick={this.handlevoteImage}>
                        {
                            stars?<Star color="white"/>:<StarBorder color="white"/>
                        }
                </IconButton>
            }
            titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
            cols={imageInfo.stars>0 ? 1 : 2}
            rows={imageInfo.stars>0 ? 1 : 2}>
            <img src={imageInfo.imageLink} key={`wall_image_${imageInfo.imageid}`} className="imgthumb" onClick={this.selectviewImage}/>
            <hr/>
            <div className="textPinTile">
                <div>
                    By:{imageInfo.imageCreator}
                </div>
                <div onClick={this.viewWall} className="textPinTileWall">
                    in wall: {imageInfo.wallname}
                </div>
            </div>
            
            <hr/>
        </GridTile>
        );
    }
}
ImageTile.propTypes={
    imageInfo:PropTypes.shape({
        wallid:PropTypes.string.isRequired,
        wallname:PropTypes.string.isRequired,
        imageCreator:PropTypes.string.isRequired,
        imageid:PropTypes.string.isRequired,
        imageName:PropTypes.string.isRequired,
        imageLink:PropTypes.string.isRequired,
        stars:PropTypes.number.isRequired
    }).isRequired,
    viewImage:PropTypes.func,
    voteImage:PropTypes.func,
    viewWall:PropTypes.func
};
export default ImageTile;