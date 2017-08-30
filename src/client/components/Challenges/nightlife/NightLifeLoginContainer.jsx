import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import '../../../../Assets/stylesheets/nightApp.scss';
class NightLifeLoginContainer extends Component{

    constructor(props){
        super(props);
        this.state={
            openDrawer:false,
            isAuth:false
            
        };
    }
    openCloseDrawer = (e) => {
        e.preventDefault();
        this.setState({openDrawer: !this.state.openDrawer});
    }
    showLoginForm=(e)=>{
            e.preventDefault();
            this.setState({isAuth:!this.state.isAuth});

    }
    renderDrawerContent=()=>{
        if (this.props.islogged){
            return (<h3>wowl</h3>);
        }

       
        if (!this.state.isAuth){
            return (
                <div className="">
                    <RaisedButton label="github"
                        primary={true}
                        icon={<FontIcon className="muidocs-icon-custom-github"/>}
                        onClick={(e)=>{this.showLoginForm(e)}}>

                    </RaisedButton>
                </div>
            );
        }
        else{
            return (<h3>booom</h3>);
        }
    }
   
    render(){
        return(
            <div className={this.state.openDrawer?'containerTriangleExpanded':'containerTriangleDrawer'}>
                    <svg onClick={(e)=>this.openCloseDrawer(e)} width="100" height="100">
                        <polygon points="0 0, 0 100, 100 0" className="triangle" />    
                    </svg>
                    <Drawer 
                        open={this.state.openDrawer}
                       
                        
                        width={250} >
                        {this.renderDrawerContent()}
                    </Drawer>
                </div>
        );
    }
}
NightLifeLoginContainer.props={
    
    islogged:PropTypes.bool.isRequired
}
export default NightLifeLoginContainer;