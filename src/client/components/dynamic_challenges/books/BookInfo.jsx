import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
import moment from 'moment';
import '../../../../Assets/stylesheets/books.scss';
import '../../../../Assets/stylesheets/base.scss'; 
import BookButton from './BookButton';
class BookInfo extends Component{

    constructor(props){
        super(props);
        this.state={
            idbook:'',
            bookname:'',
            bookauthor:'',
            bookcover:'',
            coverActive:false,
            bookreview:'',
            reviewActive:false
        };
    }
    activateCover=()=>{
        this.setState({coverActive:!this.state.coverActive});
    }
    activateReview=()=>{
        this.setState({reviewActive:!this.state.reviewActive});
    }
    cancelFormSubmit=()=>{
        return false;
    }
   
    generateIdBook=()=>{
        if (this.state.idbook){
            return;
        }
        this.setState({idbook:`book_${moment()}`});
    }
    addbook=()=>{
        const {userInformation}=this.props;
        const{idbook,bookname,bookauthor,bookreview,bookcover}= this.state;
        
        this.props.bookAdd(
            {
                usertoken:userInformation.id,
                bookId:idbook,
                bookName:bookname,
                authorName:bookauthor,
                userContact:userInformation.email,
                imgCoverLocation:bookcover!=''?bookcover:'',
                bookReview:bookreview!=''?bookreview:''
            }
        );
    }
    updateBookTerm=(e)=>{
        this.generateIdBook();
        this.setState({bookname:e.target.value});
    }
    updateAuthorTerm=(e)=>{
        this.setState({bookauthor:e.target.value});
    }
    updateSearchImage=(e)=>{
        this.setState({bookcover:e.target.value});
    }
    updateSearchReview=(e)=>{
        this.setState({bookreview:e.target.value});
    }
    render(){
        const {bookname}= this.state;
        const{abortAdd}= this.props;
        return (
            <div className="addbookcontainer animated slideInDown">
                <form className="form-horizontal" onSubmit={this.cancelFormSubmit}>
                    <div className="form-group">
                        <div className="col-sm-10">
                            <TextField hintText="Write down the book name"
                                        floatingLabelText="book name"
                                        floatingLabelFixed 
                                        onChange={this.updateBookTerm}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-10">
                            <TextField hintText="Write down the book's author"
                                        floatingLabelText="Author of the book"
                                        floatingLabelFixed
                                        onChange={this.updateAuthorTerm}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-xs-9">
                            <TextField hintText="Link to cover of the book"
                                            floatingLabelText="Image cover location"
                                            floatingLabelFixed
                                            disabled={!this.state.coverActive}
                                            onChange={this.updateSearchImage}/>
                        </div>
                        <div className="col-xs-4">
                            <Toggle label="Add cover" onToggle={this.activateCover}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-xs-9">
                            <TextField hintText="Link for a review of the book"
                                        floatingLabelText="Book review location"
                                        floatingLabelFixed
                                        disabled={!this.state.reviewActive}
                                        onChange={this.updateSearchReview}/>
                        </div>
                        <div className="col-xs-4">
                            <Toggle label="Add Review" onToggle={this.activateReview}/>
                        </div>
                    </div>
                </form>
                <div className="row">
                    <div className="col-xs-6 col-sm-4">
                        <BookButton key={'btnBookAdd'} 
                                    hasHref={false} 
                                    hasSvg={false} 
                                    buttonText={"Add"} 
                                    isDisabled={bookname===''?true:false}
                                    iconInfo={"addbook"} clickAction={this.addbook}/>
                    </div>
                    <div className="col-xs-6 col-sm-4">
                        <BookButton key={'btnBookCancel'} 
                                    hasHref={false} 
                                    hasSvg={false} 
                                    buttonText={"Cancel"} 
                                    isDisabled={false}
                                    iconInfo={"cancel"} clickAction={abortAdd}/>
                    </div>
                </div>
            </div>
            
        );
    }
}
BookInfo.propTypes={
    abortAdd:PropTypes.func.isRequired,
    bookAdd:PropTypes.func.isRequired,
    bookreject:PropTypes.func.isRequired,
    userInformation:PropTypes.shape({
        id:PropTypes.string,
        email:PropTypes.string,
        password:PropTypes.string,
        name:PropTypes.string,
        city:PropTypes.string,
        countrystate:PropTypes.string,
        country:PropTypes.string
    }).isRequired
};
export default BookInfo;