import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import BookButton from './BookButton';
import Toggle from 'material-ui/Toggle/Toggle';
class BookUserInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            userCountryState:'',
            isEditCountryState:false,
            userFullName:'',
            isEditFullName:false,
            userCity:'',
            isEditCity:false,
            userCountry:'',
            isEditCountry:false
        };
    }
    setFullName=(e)=>{
        this.setState({userFullName:e.target.value});
    }
    setCity=(e)=>{
        this.setState({userCity:e.target.value});
    }
    setCountry=(e)=>{
        this.setState({userCountry:e.target.value});
    }
    setCountryState=(e)=>{
        this.setState({userCountryState:e.target.value});
    }
    changeToEditCountryState=()=>{
        this.setState({isEditCountryState:!this.state.isEditCountryState});
    }
    changeToEditFullName=()=>{
        this.setState({isEditFullName:!this.state.isEditFullName});
    }
    changeToEditCity=()=>{
        this.setState({isEditCity:!this.state.isEditCity});
    }
    changeToEditCountry=()=>{
        this.setState({isEditCountry:!this.state.isEditCountry});
    }
    cancelFormPost=()=>{
        return false;
    }
    onEditHandler=()=>{
        const {userData,changeDataUser,cancelEdit}= this.props;
             changeDataUser(
                {
                    userToken:userData.id,
                    fullusername:this.state.userFullName!=''?this.state.userFullName:userData.name,
                    city:this.state.userCity!=''?this.state.userCity:userData.city,
                    country:this.state.userCountry!=''?this.state.userCountry:userData.country,
                    countrystate:this.state.userCountryState!=''?this.state.userCountryState:userData.countrystate
                });
            this.setState({userCity:'',userCountry:'',userCountryState:'',userFullName:''});
            setTimeout(() => {
                cancelEdit();
            }, 3000);
    }
    render(){
        const {isEditFullName,userFullName,userCity,isEditCity,userCountryState,isEditCountryState,userCountry,isEditCountry}= this.state;
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-6 col-sm-4">
                        <TextField hintText="Set your full name here"
                                floatingLabelText="Full Name"
                                floatingLabelFixed 
                                onChange={this.setFullName}
                                disabled={!isEditFullName}
                                value={isEditFullName?userFullName:this.props.userData.name}/>
                        <Toggle label="Edit"
                                labelPosition="right"
                                toggled={isEditFullName}
                                onToggle={this.changeToEditFullName}/>
                        <TextField hintText="Set your city name here"
                                        floatingLabelText="City"
                                        floatingLabelFixed 
                                        onChange={this.setCity}
                                        disabled={!isEditCity}
                                        value={isEditCity?userCity:this.props.userData.city}/>
                        <Toggle label="Edit"
                                labelPosition="right"
                                toggled={isEditCity}
                                onToggle={this.changeToEditCity}/>
                    </div>
                    <div className="col-xs-6 col-sm-4">
                        <TextField hintText="Set your state here"
                                            floatingLabelText="State"
                                            floatingLabelFixed
                                            value={isEditCountryState?userCountryState:this.props.userData.countrystate}
                                            disabled={!isEditCountryState}
                                            onChange={this.setCountryState}/>
                        <Toggle label="Edit"
                                labelPosition="right"
                                toggled={this.state.isEditCountryState}
                                onToggle={this.changeToEditCountryState}/>
                        <TextField hintText="Set your country here"
                                            floatingLabelText="Country"
                                            floatingLabelFixed
                                            value={isEditCountry?userCountry:this.props.userData.country}
                                            disabled={!isEditCountry}
                                            onChange={this.setCountry}/>
                        <Toggle label="Edit"
                                labelPosition="right"
                                toggled={isEditCountry}
                                onToggle={this.changeToEditCountry}/>
                    </div>
                    <div className="col-xs-6 col-sm-4">
                        <div className="posButtonsChange">
                            <BookButton key={'btnSaveUserInfo'} 
                                                hasHref={false} 
                                                hasSvg={false} 
                                                isDisabled={isEditFullName||isEditCity||isEditCountry||isEditCountryState?false:true}
                                                buttonText={'Edit'} 
                                                iconInfo={'save'}
                                                clickAction={this.onEditHandler}/>
                            <BookButton key={'btncancelchangeuserinfo'} 
                                                hasHref={false} 
                                                hasSvg={false} 
                                                isDisabled={false}
                                                buttonText={'Cancel'} 
                                                iconInfo={'goback'}
                                                clickAction={this.props.cancelEdit}/>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
            
        );
    }
}
BookUserInfo.propTypes={
    userData:PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        password: PropTypes.string,
        name: PropTypes.string,
        city: PropTypes.string,
        countrystate: PropTypes.string,
        country: PropTypes.string
    }).isRequired,
    cancelEdit:PropTypes.func.isRequired,
    changeDataUser:PropTypes.func

};
export default BookUserInfo;