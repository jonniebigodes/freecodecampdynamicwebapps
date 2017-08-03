import {orangeA400,red200,lime500} from 'material-ui/styles/colors';
export const stockInformationStyles={
    searchStyles:{
            buttonSearch:{
              backgroundColor:orangeA400
            }, 
            buttonSearchlabel:{
                color:'#ffffff'
            },
            errorStyle:{
                color:orangeA400
            },
            underlineStyle:{
                borderColor:red200
            },
            floatingLabelStyle:{
                color:'#ffffff',
                opacity:0.6
            },
            floatingLabelFocusStyle:{
                color:lime500
            }
        },
        gridStyles:{
            root: {
                display: 'flex',
                flexDirection: 'row wrap',
                justifyContent: 'space-between',
                alignContent: 'space-between',
                width: '100%',
                height: '100%',
            }, 
            gridList: {
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                overflowX:'auto',
                overflow:'auto'
            }
            
        }
};