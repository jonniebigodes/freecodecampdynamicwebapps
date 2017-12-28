import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';
import BookAppLogin from './BookAppLogin';
import BookInfo from './BookInfo';
import BookUserInfo from './BookUserInformation';
import BookItemsContainer from './bookTradeItemsContainer';
import '../../../../Assets/stylesheets/books.scss';
import '../../../../Assets/stylesheets/base.scss';
class BookTradeContainer extends Component{

    constructor(props){
        super(props);
        this.state={
            light:true,
            adding:false,
            snackOpen:false,
            snackMessage:'',
            hideShowLogin:false,
            editUserData:false
        };
    }
    changeToEdit=()=>{
        this.setState({editUserData:!this.state.editUserData});
        
    }
    changeTheme=()=>{
        this.setState({light:!this.state.light});
    }
    
    openCloseSnackBar=()=>{
        this.setState({snackOpen:!this.state.snackOpen});
    }
    addbookcollection=(e)=>{
        this.changetoAdd();
        this.setState({snackMessage:'Book being added to the collection'});
        this.openCloseSnackBar();
        this.props.bookAdd(e);
        
    }
    handleLoginReg=(value)=>{
        this.props.loginregister(value);
    }
    handleLogout=()=>{
        this.props.disconnectuser();
    }
    onresetError=()=>{
        this.props.resetErrorApp(true);
    }
    changetoAdd=()=>{
        this.setState({adding:!this.state.adding});
    }
    tradeBookHandler=(e)=>{
       /*  console.log('====================================');
        console.log(`Trade container book handler:${JSON.stringify(e)}`); 
        console.log('====================================');*/
        this.setState({snackMessage:'Book trade request sent to the user'});
        this.openCloseSnackBar();
        this.props.booktrade(e);
    }
    rejectBook=(e)=>{
        this.changetoAdd();
        this.setState({snackMessage:`Looks like the book:${e} already exists`});
        this.openCloseSnackBar();
    }
    showHideLogin=()=>{
        this.setState({hideShowLogin:!this.state.hideShowLogin});
    }
    renderNormal=()=>{
        const {booklist,numberBooks,userData,changeInfoUser}= this.props;
        if (this.state.editUserData){
            return (<BookUserInfo userData={userData} cancelEdit={this.changeToEdit} changeDataUser={changeInfoUser}/>);
        }
        return(
            <BookItemsContainer books={booklist}  
                userInformation={userData} 
                tradeBook={this.tradeBookHandler}
                numberBookItems={numberBooks}/>
        );
    }

    renderAdding=()=>{
        const {userData,booklist}= this.props;
        return (
            <BookInfo 
                    listbooks={booklist} 
                    abortAdd={this.changetoAdd} 
                    userInformation={userData} 
                    bookAdd={this.addbookcollection} 
                    bookreject={this.rejectBook}/>
        );
    }
    render(){
        const {isAppError,errorMessageApp,userLoggedIn,userData}= this.props;
        const {hideShowLogin,snackOpen,snackMessage,light}= this.state;
        const actionsDialog = [
            <FlatButton key="dialogError_nightLife"
                label="Ok"
                primary
                onTouchTap={this.onresetError}
            />
            ];
        return (
            <div className={'container-fluid'}>
                    <Dialog key="errorDialog"
                            actions={actionsDialog}
                            modal={false}
                            open={isAppError}
                            onRequestClose={this.onresetError}>
                        <h3>Ups!!!!<br/> Something went wrong or someone did something wrong!<br/>Check out the problem bellow</h3>
                        <br/>
                        <h4>{errorMessageApp}</h4>
                    </Dialog> 
                    <AppHeader appName="Supercalifragilistic Book Coordinator" appStyle="books" showLogin={this.showHideLogin} hasLoginNeeds/>
                    <BookAppLogin 
                        islogged= {userLoggedIn} 
                        loginreg={this.handleLoginReg} 
                        userLogout={this.handleLogout} 
                        userInformation={userData} 
                        themeChange={this.changeTheme} 
                        bookinject={this.changetoAdd}
                        changeInfoUser={this.changeToEdit}
                        hasLoginNeeds={hideShowLogin}/>
                    {
                        this.state.adding?this.renderAdding():this.renderNormal()
                    }
                    <Snackbar open={snackOpen} message={snackMessage}
                            autoHideDuration={3000}
                            onRequestClose={this.openCloseSnackBar}/>
                    <AppFooter appName="book" lightordark={light}/>
            </div>
        );
    }
}
BookTradeContainer.propTypes={
    booklist:PropTypes.object.isRequired,
    numberBooks:PropTypes.number.isRequired,
    isAppError:PropTypes.bool.isRequired,
    errorMessageApp:PropTypes.string.isRequired,
    userData:PropTypes.object.isRequired,
    userLoggedIn:PropTypes.bool.isRequired,
    resetErrorApp:PropTypes.func.isRequired,
    loginregister:PropTypes.func.isRequired,
    disconnectuser:PropTypes.func.isRequired,
    bookAdd:PropTypes.func.isRequired,
    booktrade:PropTypes.func.isRequired,
    changeInfoUser:PropTypes.func.isRequired
};
export default BookTradeContainer;