// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

const pinTheme={
    palette:{
        primary1Color:Colors.deepPurple300,
        accent3Color:Colors.indigo300
    },
    snackbar:{
        backgroundColor:Colors.indigo300
    },
    textField:{
        floatingLabelCOlor:Colors.indigo200,
        errorColor:Colors.red300
    },
    raisedButton:{
        primaryColor:Colors.deepPurple300,
        secondaryColor:Colors.purpleA200
    },
    drawer:{
        width:290,
        
    },

    gridList:{
        width:1280,
        height:385,
        margin:20,
        overflowY: 'auto',
        backgroundColor:Colors.indigo500
    }

};
const stockTheme={
    palette:{
        primary1Color: Colors.green400,
        accent1Color: Colors.brown500,
        primary2Color: Colors.green900,
        pickerHeaderColor:Colors.green400
    },
    dialog:{
        bodyColor: Colors.brown900
    },
    textField:{
        hintColor: Colors.brown800,
        errorColor: Colors.red900,
        borderColor: Colors.green600,
        focusColor: Colors.green800
    },
    raisedButton: {
        secondaryColor: Colors.brown500,
        primaryColor: Colors.green400
    },
    snackbar:{
        backgroundColor:Colors.green400
    }
};
const votesTheme={
    palette: {
        primary1Color : Colors.blueGrey500,
        accent1Color : Colors.indigoA200,
        disabledColor : Colors.grey800,
        canvasColor : Colors.grey50
    },
    tableHeaderColumn : {
        height : 50,
        spacing : 20
    },
     tableRow : {
        stripeColor : fade(Colors.blueGrey500, 0.4),
        height : 42
    },
    tabs : {
        selectedTextColor : Colors.indigo900
    },
     textField : {
        errorColor : Colors.red900
    },
     snackbar : {
        backgroundColor : Colors.blueGrey600
    },
     raisedButton : {
        primaryColor : Colors.blueGrey500,
        color : Colors.blueGrey500,
        textColor : fade(Colors.darkWhite, 0.87)
    },
    drawer:{
        width:290,
        
    },
};
export const dynamicThemes={pinTheme,stockTheme,votesTheme};