import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
//import FontIcon from 'material-ui/FontIcon';
import SvgIcon from 'material-ui/SvgIcon';
import ActionEject from 'material-ui/svg-icons/action/eject';
import ContentAddBox from 'material-ui/svg-icons/content/add-box';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Star from 'material-ui/svg-icons/toggle/star';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
class PinButton extends Component{
    constructor(props){
        super(props);
        this.state={
            showMessage:false
        };
    }
    clickHandler=()=>{
        this.props.clickAction();
    }
    getIcon=value=>{
        switch (value) {
            case "dc":
                return <ActionEject/>;
                //break;
            case "addPin":
                return <ContentAddBox/>;
            case "back":
                return <NavigationArrowBack/>;
            case "star":
                return <Star/>;
            case "starborder":
                return <StarBorder/>;
            case "del":
                return <ActionDelete/>;
            default:
                break;
        }
    }
    renderInfo=()=>{
        const {buttonText,iconInfo,hasHref,hrefUrl,hasSvg,svgInfo}= this.props;
        
        if (hasHref){
            return (
                
                <RaisedButton label={buttonText} 
                    primary
                    href={hrefUrl}
                    labelPosition="before"
                    icon={hasSvg?<SvgIcon viewBox={svgInfo.viewBoxData}><path d={svgInfo.svgData}/></SvgIcon>:this.getIcon(iconInfo)}
                    />
            );
        }
        else{
            return (
                
                <RaisedButton label={buttonText} 
                    primary
                    labelPosition="before"
                    icon={hasSvg?<SvgIcon viewBox={svgInfo.viewBoxData}><path d={svgInfo.svgData}/></SvgIcon>:this.getIcon(iconInfo)}
                    onClick={this.clickHandler}/>
            );
        }
        /* return (
            
            <RaisedButton label={buttonText} 
                primary
                labelPosition="before"
                icon={this.getIcon(iconInfo)}
                onClick={this.clickHandler}/>
        ); */
    }
    renderNormal=()=>{
        const {iconInfo,hasHref,hasSvg,svgInfo,hrefUrl}= this.props;
        if (hasHref){
            return(
                <FloatingActionButton mini zDepth={1} href={hrefUrl}>
                    {
                        hasSvg?<SvgIcon viewBox={svgInfo.viewBoxData}><path d={svgInfo.svgData}/></SvgIcon>:this.getIcon(iconInfo)
                    }
                </FloatingActionButton>
            );
        }
        else{
            return(
                <FloatingActionButton mini zDepth={1} onClick={this.clickHandler}>
                    {
                        hasSvg?<SvgIcon viewBox={svgInfo.viewBoxData}><path d={svgInfo.svgData}/></SvgIcon>:this.getIcon(iconInfo)
                    }
                </FloatingActionButton>
            );
        }
        
    }
    onMouseEnter=()=>{
        
        this.setState({showMessage:true});
    }
    onMouseLeave=()=>{
        
        this.setState({showMessage:false});
    }
    render(){
       const {showMessage}= this.state;
        return (
            <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                {showMessage?this.renderInfo():this.renderNormal()}
            </div>
        );

    }
}

PinButton.propTypes={
    hasHref:PropTypes.bool.isRequired,
    hasSvg:PropTypes.bool.isRequired,
    hrefUrl:PropTypes.string,
    svgInfo:PropTypes.shape({
        viewBoxData:PropTypes.string,
        svgData:PropTypes.string
    }),
    buttonText:PropTypes.string.isRequired,
    iconInfo:PropTypes.string,
    clickAction:PropTypes.func,
};
export default PinButton;