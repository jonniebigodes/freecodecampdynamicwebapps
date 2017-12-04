// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import * as Colors from 'material-ui/styles/colors';
// import { fade } from 'material-ui/utils/colorManipulator';

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
export const dynamicThemes={pinTheme};