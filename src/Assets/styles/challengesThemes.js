// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

const pinTheme={
    palette:{
        primary1Color:Colors.deepPurple300,
        accent3Color:Colors.indigo300,
        canvasColor : Colors.deepPurple300
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
        primary1Color: Colors.green500,
        canvasColor: Colors.green500,
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
const booksTheme={
    palette: {
        primary1Color: fade(Colors.brown900, 0.76),
        canvasColor: fade(Colors.brown200, 0.87)
    },
    appBar: {
        height: 62
    },
    raisedButton: {
        color: Colors.brown800,
        textColor: fade(Colors.lightWhite, 0.54)
    },
    snackbar: {
        backgroundColor: Colors.brown600
    },
    dialog: {
        bodyColor: fade(Colors.black, 0.93)
    },
    floatingActionButton: {
        secondaryColor: Colors.redA200
    },
    drawer:{
        width:290
    },
    gridList:{
        width:1280,
        height:385,
        margin:20,
        overflowY: 'auto'
    }
    
};
const themeNight={
    palette: {
        primary1Color: Colors.blueGrey400,
        canvasColor: Colors.blueGrey800,
        accent1Color: Colors.blueA200,
        disabledColor: fade(Colors.lightWhite, 0.54),
        accent2Color: Colors.indigoA200
    },
    appBar: {
        textColor: fade(Colors.lightWhite, 0.54),
        height: 50
    },
    textField: {
        errorColor: Colors.indigoA100,
        focusColor: Colors.blueGrey800
    },
    drawer:{
        width:290,
        
    },
};
//const nightTheme={...darkBaseTheme,...themeNight};
// console.log(`original dark:\n${JSON.stringify(darkBaseTheme,null,2)}`);
// console.log(`themeNight dark:\n${JSON.stringify(themeNight,null,2)}`);
// console.log(`merged dark:\n${JSON.stringify(nightTheme,null,2)}`);
export const dynamicThemes={pinTheme,stockTheme,votesTheme,booksTheme,themeNight};