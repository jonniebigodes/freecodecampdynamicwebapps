import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {GridList} from 'material-ui/GridList';
import ImageTile from './imageTile';

class PinList extends Component{

    constructor(props){
        super(props);
        this.pinVoteImage= this.pinVoteImage.bind(this);
        
        this.styles={
            gridList:{
                width:1280,
                height:385,
                margin:20,
                overflowY: 'auto'
            }
        };
    }
    pinVoteImage=value=>{
        this.props.castImageVote(value);
    }
    userWallView=value=>{
        this.props.viewSelectedWall(value);
    }
    selectedImageView=value=>{
        this.props.imageSelector(value);
    }
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