import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
    BookExit,
    setBookAppError,
    resetBookAppError,
    fetchDataBooks,
    BookAppDisconnectUser,
    BookAppRegisterServer,
    BookAppaAuthenticateServer,
    addbookCollection,
    tradeBook,
    changeUserInformation
} from '../../../../common/actions/booksAppActions';
import BookTradeContainer from './BookTradeContainer';
class BookTradeApp extends Component{
    componentDidMount=()=>{
        // will get the books
        this.props.getBooks(true);
    }
    onresetError=(e)=>{
        e.preventDefault();
        this.props.resetError(true);
    }
    componentWillUnmount(){
        this.props.exitBookApp(true);
    }
    logoutUser=()=>{
        this.props.unpluguser(true);
    }
    loginRequestHandler=(value)=>{
        if (value.isLogin){
            this.props.logginApp(value);
        }
        else{
            this.props.registerApp(value);
        }
    }
    resetErrorHandler=()=>{
        //e.preventDefault();
        this.props.resetError(true);
    }
    bookaddHandler=(value)=>{
        this.props.addBookCollection(value);
    }
    bookTradeHandler=(value)=>{
        if (!this.props.bookApploggedIn){
            this.props.setError(`In order to trade any books, you must be logged in!`);
            return;
        }
        value.traderToken=this.props.bookApploginData.id;
        value.tradercontact= this.props.bookApploginData.email;
        console.log('====================================');
        console.log(`BOOK APP TRADE:${JSON.stringify(value)}`);
        console.log('====================================');
        this.props.tradebookwithuser(value);
    }
    render(){
        return(
            <div>
                <BookTradeContainer booklist={this.props.bookItems}
                                    isAppError={this.props.bookAppIsError}
                                    errorMessageApp={this.props.bookAppErrorMessage}
                                    userData={this.props.bookApploginData}
                                    userLoggedIn={this.props.bookApploggedIn}
                                    resetErrorApp={this.resetErrorHandler}
                                    loginregister={(e)=>this.loginRequestHandler(e)}
                                    disconnectuser={this.logoutUser}
                                    bookAdd={(e)=>this.bookaddHandler(e)}
                                    booktrade={(value)=>this.bookTradeHandler(value)}
                                    changeInfoUser={this.props.userInfoChange}/>
            </div>
        );
    }
}
const mapStateToProps=state=>{
    return {
        bookItems:state.books.items,
        bookAppIsError:state.books.onError,
        bookAppErrorMessage:state.books.errorMessage,
        bookApploggedIn:state.books.isLoggedin,
        bookApploginData:state.books.userInfo
    };
};
const mapDispatchToProps=dispatch=>{
    return {
        exitBookApp:(value)=>{
            dispatch(BookExit(value));
        },
        setError:(value)=>{
            dispatch(setBookAppError(value));
        },
        resetError:(value)=>{
            dispatch(resetBookAppError(value));
        },
        getBooks:()=>{
            dispatch(fetchDataBooks());
        },
        unpluguser:(value)=>{
            dispatch(BookAppDisconnectUser(value));
        },
        logginApp:(value)=>{
            dispatch(BookAppaAuthenticateServer(value));
        },
        registerApp:(value)=>{
            dispatch(BookAppRegisterServer(value));
        },
        addBookCollection:(value)=>{
            dispatch(addbookCollection(value));
        },
        tradebookwithuser:(value)=>{
            dispatch(tradeBook(value));
        },
        userInfoChange:(value)=>{
            dispatch(changeUserInformation(value));
        }
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(BookTradeApp);