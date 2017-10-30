import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Snackbar from 'material-ui/Snackbar';
import AppHeader from '../../AppHeader';
import AppFooter from '../../AppFooter';
import BookAppLogin from './BookAppLogin';
import BookInfo from './BookInfo';
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
            hideShowLogin:false
        };
    }
    
    changeTheme=()=>{
        this.setState({light:!this.state.light});
    }
    
    openCloseSnackBar=()=>{
        this.setState({snackOpen:!this.state.snackOpen});
    }
    addbookcollection=(e)=>{
        this.changetoAdd();
        this.setState({snackMessage:'Book added to the collection'});
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
        return(
            <div>
                <BookAppLogin 
                    islogged= {this.props.userLoggedIn} 
                    loginreg={(value)=>this.handleLoginReg(value)} 
                    userLogout={this.handleLogout} 
                    userInformation={this.props.userData} 
                    themeChange={this.changeTheme} 
                    bookinject={this.changetoAdd}
                    changeInfo={this.props.changeInfoUser}
                    hasLoginNeeds={this.state.hideShowLogin}/>
                <BookItemsContainer books={this.props.booklist}  
                    userInformation={this.props.userData} 
                    tradeBook={(e)=>this.tradeBookHandler(e)}/>
                <Snackbar open={this.state.snackOpen} message={this.state.snackMessage}
                            autoHideDuration={3000}
                            onRequestClose={this.openCloseSnackBar}/>
            </div>
        );
    }

    renderAdding=()=>{
        return (
            <div>
                <BookInfo listbooks={this.props.booklist} abortAdd={this.changetoAdd} userInformation={this.props.userData} bookAdd={(e)=>this.addbookcollection(e)} bookreject={(e)=>this.rejectBook(e)}/>
            </div>
        );
    }
    render(){
        const actionsDialog = [
            <FlatButton key="dialogError_nightLife"
                label="Ok"
                primary
                onTouchTap={this.onresetError}
            />
            ];
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(this.state.light?lightBaseTheme:darkBaseTheme)}>
                <div className={this.state.light?'container-fluid containerLight':'container-fluid containerDark'}>
                    <Dialog key="errorDialog"
                            actions={actionsDialog}
                            modal={false}
                            open={this.props.isAppError}
                            onRequestClose={this.onresetError}>
                        <h3>Ups!!!!<br/> Something went wrong or someone did something wrong!<br/>Check out the problem bellow</h3>
                        <br/>
                        <h4>{this.props.errorMessageApp}</h4>
                    </Dialog> 
                    <AppHeader appName="Supercalifragilistic Book Coordinator" appStyle="books" showLogin={this.showHideLogin} hasLoginNeeds/>
                    {
                        this.state.adding?this.renderAdding():this.renderNormal()
                    }
                    
                    <AppFooter appName="book" lightordark={this.state.light}/>
                </div>
            </MuiThemeProvider>
        );
    }
}
BookTradeContainer.propTypes={
    booklist:PropTypes.arrayOf(
        PropTypes.object.isRequired
    ).isRequired,
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