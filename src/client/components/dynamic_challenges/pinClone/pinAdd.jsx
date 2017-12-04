import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
class PinAdd extends Component{
    
    constructor(props){
        super(props);
        this.state={
            snackOpen:false,
            snackMessage:'',
            imageName:'',
            imgURL:'',
            imageId:''
        };
    }
    generateIDPin=()=>{
        this.setState({imageId:`pincimage_${moment()}`});
    }
    updateImageName=(e)=>{
        if (this.state.imageName===''){
            this.generateIDPin();
        }
        this.setState({imageName:e.target.value});
    }
    updateImageLocation=(e)=>{
        this.setState({imgURL:e.target.value});
    }
    addPin=()=>{
        const {imgURL,imageName,imageId}= this.state;
        const {userInfo}= this.props;
        if ((imgURL==='')||(imageName==='')){
            this.setState({snackMessage:'Fill in the missing information'});
            this.handleCloseSnack();
            return;
        }
        this.props.addPin({usertoken:userInfo,image:imgURL,id:imageId,name:imageName});
        setTimeout(() => {
            this.cancelPinAdd();
        }, 1000);
    }
    cancelPinAdd=()=>{
        this.props.cancelAdd();
    }
    handleCloseSnack=()=>{
        this.setState({snackOpen:!this.state.snackOpen});
    }
    cancelFormSubmit=()=>{
        return false;
    }
    render(){
        const {imageName,imgURL,snackOpen,snackMessage}= this.state;
        return (
            <div>
                <div className="formaddpos">
                    <form onSubmit={this.cancelFormSubmit}>
                        <div className="form-group animated fadeInUp">
                            <TextField hintText="Write down the image name"
                                                floatingLabelText="image name"
                                                floatingLabelFixed
                                                value={imageName}
                                                onChange={this.updateImageName}/>
                        </div>
                        <div className="form-group animated fadeInUp">
                            <TextField hintText="Write down the image address"
                                                floatingLabelText="Option name"
                                                floatingLabelFixed
                                                value={imgURL}
                                                onChange={this.updateImageLocation}/>
                        </div>
                        <div className="form-group animated fadeInUp">
                            <div className="row">
                                <div className="col-xs-6">
                                    <RaisedButton label="Add Pin" primary disabled={imageName==''?true:false} onClick={this.addPin}/>
                                </div>
                                <div className="col-xs-6">
                                    <RaisedButton label="Cancel Pin" primary onClick={this.cancelPinAdd} />
                                </div>
                            </div>
                            
                        </div>
                    </form>
                    
                </div>
                <Snackbar open={snackOpen} message={snackMessage} autoHideDuration={4000}
                onRequestClose={this.handleCloseSnack}/>
            </div>
        );
    }
}
PinAdd.propTypes={
    userInfo:PropTypes.string.isRequired,
    addPin:PropTypes.func.isRequired,
    cancelAdd:PropTypes.func.isRequired
};
export default PinAdd;