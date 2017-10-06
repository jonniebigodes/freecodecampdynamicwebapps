import React, { Component } from 'react';
import Cached from 'material-ui/svg-icons/action/cached';
import AllOut from 'material-ui/svg-icons/action/all-out';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
class BookItemsContainer extends Component{

    constructor(props){
        super(props);
        

    }
    updateSnack=()=>{
        this.setState({snackOpened:!this.state.snackOpened});
    }
    itemTrade=(item)=>{
        console.log('====================================');
        console.log(`ITEM CLICKED:${JSON.stringify(item)}`);
        console.log('====================================');
        let bookData= this.props.books.find(x=>x.booktoken==item);
        
         if (bookData.bookisbeingtraded){
             //show message;
             console.log("BEING TRADED");
             return;
         }
         this.props.tradeBook({tokenBook:bookData.booktoken,traderToken:'',ownerToken:bookData.bookowner,ownercontact:bookData.bookownercontact,tradercontact:''});
    }
    spawnItems=()=>{
       
        const result=[];
        for (let item of this.props.books){
            result.push(
                <GridTile key={item.booktoken} title={`${item.bookname} by: ${item.bookauthor}`}
                          subtitle={`added by: ${item.bookownercontact}\ntraded to:\n${item.bookisbeingtraded?item.bookbeingtradedto:'nobody'}`}
                          actionIcon={<IconButton onClick={(e)=>this.itemTrade(item.booktoken)}>{item.bookisbeingtraded?<AllOut color="white"/>:<Cached color="white" key={item.booktoken}/>}</IconButton>}>
                            <img src={item.bookcover===''?'https://image.freepik.com/free-vector/human-head-like-a-open-book_23-2147509213.jpg':item.bookcover}/>
                </GridTile>
            );
        }
        return result;
    }
    render(){
        const bookliststyles = {
            root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
        },
        listdata: {
            width: 800,
            height: 450,
            overflowY: 'auto',
            }
        };
        if (!this.props.books.length || !this.props.books[0]){
            return(
                <div>
                    <h3>Now that's awkward looks like there's nothing to show to you</h3>
                    <h4>Login or register and try to add something to the collection</h4>
                </div>
            );
        }
        return(
            <div style={bookliststyles.root}>
                <GridList key="containerBooks" cellHeight={180} style={bookliststyles.listdata} >
                    {
                        this.spawnItems()
                    }
            </GridList>
        </div>
        );
    }
    
}
BookItemsContainer.propTypes={
    books:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
    tradeBook:PropTypes.func.isRequired
};
export default BookItemsContainer;