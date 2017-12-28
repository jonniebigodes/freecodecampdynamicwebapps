import React, { Component } from 'react';
import {GridList} from 'material-ui/GridList';
import PropTypes from 'prop-types';
import BookItem from './BookItem';
import BookDetail from './BookDetail';
class BookItemsContainer extends Component{

    constructor(props){
        super(props);
        this.state={
            isPreview:false,
            selectedBook:{}
        };
    }

    itemTrade=(item)=>{
        console.log('====================================');
        console.log(`ITEM CLICKED:${JSON.stringify(item)}`);
        console.log('====================================');
        const {books, tradeBook}= this.props;
        tradeBook({tokenBook:item,traderToken:'',ownerToken:books[item].bookowner.token,ownercontact:books[item].bookowner.bookownercontact,tradercontact:''});
        //let bookData= this.props.books.find(x=>x.booktoken==item);
        
        //  if (bookData.bookisbeingtraded){
        //      //show message;
        //      console.log("BEING TRADED");
        //      return;
        //  }
        //  this.props.tradeBook({tokenBook:bookData.booktoken,traderToken:'',ownerToken:bookData.bookowner,ownercontact:bookData.bookownercontact,tradercontact:''});
    }
    handlePreview=(value)=>{
        const {books}= this.props;
        this.setState({isPreview:true,selectedBook:books[value]});
    }
    spawnItems=()=>{
       const {books}= this.props;
        const result=[];
        for (const item in books){
            result.push(
                <BookItem key={`item_book_${books[item].booktoken}`} 
                    bookInfo={books[item]} 
                    bookTrade={this.itemTrade}
                    previewBook={this.handlePreview}/>
                );
        }
        return result;
    }
    exitPreview=()=>{
        this.setState({selectedBook:{},isPreview:false});
    }
    render(){
        const {numberBookItems}= this.props;
        const {isPreview,selectedBook}= this.state;
        if (numberBookItems===0){
            return(
                <div>
                    <h3>Now that's awkward looks like there's nothing to show to you</h3>
                    <h4>Login or register and try to add something to the collection</h4>
                </div>
            );
        }
        if (isPreview){
            return(
                <BookDetail bookData={selectedBook} bookPreviewExit={this.exitPreview} itemTrade={this.itemTrade}/>
            );
        }
        return(
            <GridList key="containerBooks" cols={3} cellHeight={'auto'} padding={6} >
            {
                this.spawnItems()
            }
            </GridList>
        );
        
    }
    
}
BookItemsContainer.propTypes={
    books:PropTypes.object.isRequired,
    tradeBook:PropTypes.func.isRequired,
    numberBookItems:PropTypes.number
};
export default BookItemsContainer;