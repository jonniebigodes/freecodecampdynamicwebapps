import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Step,
    Stepper,
    StepButton,
  } from 'material-ui/Stepper';
class PinWallSelector extends Component{

  /**
   * wall selector class construtor
   * @param {*} props 
   */
    constructor(props){
        super(props);
        this.state={
          stepIndex:1
        };
    }
    /**
     * class property to handle the go back
     
     */
    handlePrev=()=>{
        /* const {stepIndex}=this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
            
        } */
        this.props.allwallsview();
        this.setState({stepIndex: 1});
    }
    /**
     * class property to show the component
     
     */
    renderWall=()=>{
      const {wallname}=this.props;
      const {stepIndex} = this.state;
      return(
        <Stepper linear={false} activeStep={stepIndex}>
          <Step>
            <StepButton onClick={this.handlePrev}>
              All Walls
            </StepButton>
          </Step>
          <Step>
            <StepButton>
              {wallname}
            </StepButton>
          </Step>
        </Stepper>
      );
    }
    /**
     * render method
     */
    render(){
        return(
            <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
              {this.renderWall()}
            </div>
        );
    }
}
PinWallSelector.propTypes={
    wallname:PropTypes.string,
    allwallsview:PropTypes.func
};
export default PinWallSelector;