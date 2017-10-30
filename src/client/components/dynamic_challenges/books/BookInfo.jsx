import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import moment from 'moment';
import '../../../../Assets/stylesheets/books.scss';
import '../../../../Assets/stylesheets/base.scss'; 
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
    bookPresent=()=>{
        return this.props.listbooks.find(x=>x.bookname.toLowerCase()==this.state.bookname.toLowerCase());
    }
    generateIdBook=()=>{
        if (this.state.idbook){
            return;
        }
        this.setState({idbook:`book_${moment()}`});
    }
    addbook=()=>{
        
        if(this.bookPresent()){
            console.log(`book exists:`);
            // set error
            this.props.bookreject(this.state.bookname);
        }
        else{
            let newBook={
                usertoken:this.props.userInformation.id,
                bookId:this.state.idbook,
                bookName:this.state.bookname,
                authorName:this.state.bookauthor,
                userContact:this.props.userInformation.email
            };
            if (this.state.bookreview!=''){
                //console.log("has review");
                newBook.bookReview=this.state.bookreview;
            }
            if (this.state.bookcover!=''){
                //console.log("has review");
                newBook.imgCoverLocation=this.state.bookcover;
            }
            if(newBook.bookName==='' && newBook.authorName===''){
                this.props.bookreject(this.state.bookname);
                return;
            }
            this.props.bookAdd(newBook);
        }
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
                            <TextField hintText="Link to review of the book"
                                        floatingLabelText="Book review location"
                                        floatingLabelFixed
                                        disabled={!this.state.reviewActive}
                                        onChange={this.updateSearchReview}/>
                            
                        </div>
                        <div className="col-xs-4">
                            <Toggle label="Add cover" onToggle={this.activateReview}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-10">
                            <TextField hintText="Book id"
                                    disabled value={this.state.idbook}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-1 col-sm-10">
                            <RaisedButton label="Add" primary onClick={this.addbook}/>
                            <RaisedButton label="Cancel" secondary onClick={this.props.abortAdd}/>
                        </div>
                    </div>
                </form>
            </div>
            
        );
    }
}
BookInfo.propTypes={
    listbooks:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
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