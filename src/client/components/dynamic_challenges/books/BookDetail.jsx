import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import BookButton from './BookButton';
import FccDynButton from '../../challengesUIComponents/FccDynButton';
class BookDetail extends Component{

    constructor(props){
        super(props);
    }
    
    itemPreviewExit=()=>{
        const {bookPreviewExit}= this.props;
        bookPreviewExit();
    }
    setTraded=()=>{
        const {bookData,itemTrade}=this.props;
        itemTrade(bookData.booktoken);
        
    }
    render(){
        const {bookData}= this.props;
        //const urlBookNoCover='https://image.freepik.com/free-vector/human-head-like-a-open-book_23-2147509213.jpg';
        const urlBookNoCover=require('../../../../Assets/images/dummybook.jpg');
        return(
            <div>
                <div className="row">
                    <div className="col-xs-6 col-md-4">
                        <div className="textInfoPreview">
                            <h3>{bookData.bookname}</h3>
                            <h4>By:{bookData.bookauthor}</h4>
                            <h4>Added by {bookData.bookowner.name}</h4>
                            <hr/>
                            <h4>Click the link bellow for a full review of the book</h4>
                            <a href={bookData.bookreview===''?'http://www.google.com':bookData.bookreview} target="_blank" >Full Review</a>
                            <hr/>
                            <h5>Traded to {bookData.bookbeingtradedto===''?'nobody':bookData.bookbeingtradedto}</h5>  
                        </div>
                        
                    </div>
                    <div className="col-xs-6 col-md-4">
                        <div>
                            <img 
                                src={bookData.bookcover?bookData.bookcover:urlBookNoCover}
                                className="previewimg"/>
                        </div>
                        
                    </div>
                    <div className="col-xs-6 col-md-4">
                        <div className="posButtonsChange">
                            <FccDynButton 
                                hasHref={false}
                                hasSvg={false}
                                isDisabled={false}
                                buttonText={'Go back'}
                                iconInfo={'goback'}
                                clickAction={this.itemPreviewExit}/>
                            <FccDynButton 
                                hasHref={false}
                                hasSvg={false}
                                isDisabled={bookData.bookisbeingtraded?true:false}
                                buttonText={bookData.bookisbeingtraded?'No Trade':'Trade'}
                                iconInfo={bookData.bookisbeingtraded?'notrade':'traded'}
                                clickAction={this.setTraded}/>
                        </div>
                    </div>
                </div>
                
            </div>
            
        );
    }
}
BookDetail.propTypes={
    bookData:PropTypes.shape({
        booktoken:PropTypes.string,
        bookowner:PropTypes.shape({
            token:PropTypes.string,
            name:PropTypes.string
        }),
        bookname:PropTypes.string,
        bookauthor:PropTypes.string,
        bookcover:PropTypes.string,
        bookreview:PropTypes.string,
        bookownercontact:PropTypes.string,
        bookisbeingtraded:PropTypes.bool,
        bookbeingtradedto:PropTypes.string
    }).isRequired,
    userLoggedIn:PropTypes.bool,
    bookPreviewExit:PropTypes.func.isRequired,
    itemTrade:PropTypes.func.isRequired
};
export default BookDetail;