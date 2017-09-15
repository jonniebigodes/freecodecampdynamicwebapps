import React, { Component } from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class BookTradeContainer extends Component{

    render(){
        const actionsDialog = [
            <FlatButton key="dialogError_nightLife"
                label="Ok"
                primary={true}
                onTouchTap={(e)=>this.resetError(e)}
            />
            ];
        return(
            <div className="container-fluid">
                <Dialog key="errorDialog"
                        actions={actionsDialog}
                        modal={false}
                        open={this.props.isError}
                        onRequestClose={(e)=>this.resetError(e)}>
                        <h3>Ups!!!!<br/> Something went wrong or someone did something wrong!<br/>Check out the problem bellow</h3>
                        <br/>
                        <h4>{this.props.errorMessageApp}</h4>
                </Dialog>
            </div>
        );
    }
}
