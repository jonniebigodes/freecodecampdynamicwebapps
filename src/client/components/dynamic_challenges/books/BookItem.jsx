import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Cached from 'material-ui/svg-icons/action/cached';
import AllOut from 'material-ui/svg-icons/action/all-out';
class BookItem extends Component{

    constructor(props){
        super(props);
    }
    itemTrade=()=>{
        const {bookTrade,bookInfo}= this.props;
        bookTrade(bookInfo.booktoken);
        
    }
    handleOnPreview=()=>{
        const {bookInfo,previewBook}= this.props;
        previewBook(bookInfo.booktoken);
    }
    render(){
        const {bookInfo}=this.props;
        //const defaultCover='https://image.freepik.com/free-vector/human-head-like-a-open-book_23-2147509213.jpg';
        const defaultCover=require('../../../../Assets/images/dummybook.jpg');
        return(
            <GridTile 
                key={bookInfo.booktoken} 
                title={`${bookInfo.bookname} by: ${bookInfo.bookauthor}`}
                subtitle={`Added by: ${bookInfo.bookownercontact}\ntraded to:\n${bookInfo.bookisbeingtraded?bookInfo.bookbeingtradedto:'nobody'}`}
                actionIcon={
                    <IconButton onClick={this.itemTrade} >
                        {bookInfo.bookisbeingtraded?<AllOut color="white"/>:<Cached key={bookInfo.booktoken} color="white"/>}
                    </IconButton>}>
                <img src={bookInfo.bookcover===''?defaultCover:bookInfo.bookcover}
                 onClick={this.handleOnPreview} className="previewimg"/>
            </GridTile>
        );
    }
}
BookItem.propTypes={
    bookInfo:PropTypes.object,
    bookTrade:PropTypes.func.isRequired,
    previewBook:PropTypes.func.isRequired
};
export default BookItem;