import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {GridList} from 'material-ui/GridList';
import ImageTile from './imageTile';

class PinList extends Component{

    /**
     * class constructor for the list of pins
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.pinVoteImage= this.pinVoteImage.bind(this);
        
        /* this.styles={
            gridList:{
                width:1280,
                height:385,
                margin:20,
                overflowY: 'auto'
            }
        }; */
    }
    /**
     * class property for handling pin vote
     * @param {Object} value object containing the pin information 
     */
    pinVoteImage=value=>{
        this.props.castImageVote(value);
    }
    /**
     * class property for handling selection of the wall
     * @param {string} value contains the id of the wall
     */
    userWallView=value=>{
        this.props.viewSelectedWall(value);
    }
    /**
     * class property for handling pin vote
     * @param {string} value contains the image id
     */
    selectedImageView=value=>{
        this.props.imageSelector(value);
    }
    /**
     * function to generate tiles 
     * 
     */
    generateTiles(){
        const {wallData}=this.props;
        let result=[];
        if (wallData.idwall){
            for (const selitem of wallData.images) {
                /* console.log('====================================');
                console.log(`seel item:\n:${JSON.stringify(selitem,null,2)}`); 
                console.log('====================================');*/
                result.push(
                    <ImageTile 
                        key={`tile_img_${selitem.idimage}`}
                        imageInfo={{
                            wallid:wallData.idwall,
                            wallname:wallData.name,
                            imageCreator:wallData.wallcreatorInfo.wallcreator,
                            imageid:selitem.idimage,
                            imageName:selitem.nameofimage,
                            imageLink:selitem.imagelink,
                            stars:selitem.numberstars
                        }}
                        viewImage={this.selectedImageView}/>
                );
            }
        }
        else{
            for (let item in wallData.wall){
                for (let wallimages of wallData.wall[item].images){
                    result.push(
                        <ImageTile key={`tile_img_${wallimages.idimage}`} imageInfo={{
                                wallid:item,
                                imageCreator:wallData.creator[wallData.wall[item].creator].username,
                                wallname:wallData.wall[item].name,
                                imageid:wallimages.idimage,
                                imageName:wallimages.nameofimage,
                                imageLink:wallimages.imagelink,
                                stars:wallimages.numberstars
                            }}
                            voteImage={this.pinVoteImage}
                            viewWall={this.userWallView}
                            viewImage={this.selectedImageView}/>
                    );
                }
            }
        }
        return result;
    }
    /**
     * render method
     * 
     */
    render(){
        
        return(
            <GridList cols={3} cellHeight={'auto'} padding={6} >
                {this.generateTiles()}
            </GridList>
            
        );
    }
}
PinList.propTypes={
    wallData:PropTypes.object,
    castImageVote:PropTypes.func.isRequired,
    viewSelectedWall:PropTypes.func,
    imageSelector:PropTypes.func.isRequired
};
export default PinList;