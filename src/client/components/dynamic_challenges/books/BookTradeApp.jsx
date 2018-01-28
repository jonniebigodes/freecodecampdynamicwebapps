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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {dynamicThemes} from '../../../../Assets/styles/challengesThemes';
import LinearProgress from 'material-ui/LinearProgress';
import BookTradeContainer from './BookTradeContainer';

class BookTradeApp extends Component{

    
    componentDidMount=()=>{
        // will get the books
        this.props.getBooks();
    }
    onresetError=()=>{
        this.props.resetError();
    }
    componentWillUnmount(){
        this.props.exitBookApp();
    }
    logoutUser=()=>{
        this.props.unpluguser();
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
        const {bookApploggedIn,setError,bookApploginData,tradebookwithuser}= this.props;
        if (!bookApploggedIn){
            setError(`In order to trade any books, you must be logged in!`);
            return;
        }
        value.traderToken=bookApploginData.id;
        value.tradercontact= bookApploginData.email;
        // console.log('====================================');
        // console.log(`BOOK APP TRADE:${JSON.stringify(value)}`);
        // console.log('====================================');
       tradebookwithuser(value);
    }
    showPreloader=()=>{
        
        return(
            <div className="preloader">
                <div className="preloaderText">
                    <span>Getting items</span>
                    <p/>
                    <span>Please hold</span>
                    <LinearProgress mode="indeterminate"/>
                </div>
                
            </div>
        );
    }
    showItems=()=>{
        const {bookItems,listBooks,bookAppIsError,bookAppErrorMessage,bookApploginData,bookApploggedIn,userInfoChange}=this.props;
        return(
            <BookTradeContainer 
                    booklist={bookItems}
                    numberBooks={listBooks.length}
                    isAppError={bookAppIsError}
                    errorMessageApp={bookAppErrorMessage}
                    userData={bookApploginData}
                    userLoggedIn={bookApploggedIn}
                    resetErrorApp={this.resetErrorHandler}
                    loginregister={this.loginRequestHandler}
                    disconnectuser={this.logoutUser}
                    bookAdd={this.bookaddHandler}
                    booktrade={this.bookTradeHandler}
                    changeInfoUser={userInfoChange}/>
        );
    }
    render(){
        const{isSearchingBooks}= this.props;
        return(
           <MuiThemeProvider muiTheme={getMuiTheme(dynamicThemes.booksTheme)}>
               {isSearchingBooks?this.showPreloader():this.showItems()}
           </MuiThemeProvider>
        );
    }
}
const mapStateToProps=state=>{
    return {
        isSearchingBooks:state.books.isSearching,
        bookItems:state.books.booksData,
        listBooks:state.books.results,
        bookAppIsError:state.books.onError,
        bookAppErrorMessage:state.books.errorMessage,
        bookApploggedIn:state.books.bookAppisLoggedin,
        bookApploginData:state.books.bookuserInfo
    };
};
const mapDispatchToProps=dispatch=>{
    return {
        exitBookApp:()=>{
            dispatch(BookExit());
        },
        setError:(value)=>{
            dispatch(setBookAppError(value));
        },
        resetError:()=>{
            dispatch(resetBookAppError());
        },
        getBooks:()=>{
            dispatch(fetchDataBooks());
        },
        unpluguser:()=>{
            dispatch(BookAppDisconnectUser());
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
        },
        
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(BookTradeApp);