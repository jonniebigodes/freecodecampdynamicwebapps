import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SvgIcon from 'material-ui/SvgIcon';
import ActionEject from 'material-ui/svg-icons/action/eject';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentAddBox from 'material-ui/svg-icons/content/add-box';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ContentBlock from 'material-ui/svg-icons/content/block';
import ContentSave from 'material-ui/svg-icons/content/save';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import EditorInsertLink from 'material-ui/svg-icons/editor/insert-link';
import ActionReorder from 'material-ui/svg-icons/action/reorder';
import SocialPerson from 'material-ui/svg-icons/social/person';
import SocialPersonAdd from 'material-ui/svg-icons/social/person-add';
import Cached from 'material-ui/svg-icons/action/cached';
import AllOut from 'material-ui/svg-icons/action/all-out';
class BookButton extends Component{
     /**
     * button class construtor
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.state={
            showButtonMessage:false
        };
    }
     /**
     * class property to handle the click on the button
     */
    handlerButtonClick=()=>{
        this.props.clickAction();
    }

    /**
     * class property to get the icon for the button
     */
    getIcon=value=>{
       
        switch (value) {
            case "dc":
                return <ActionEject/>;
            case "addbook":
                return <ContentAddBox/>;
            case "back":
                return <NavigationArrowBack/>;
            case "del":
                return <ActionDelete/>;
            case "local":
                return <ActionAccountBox/>;
            case "cancel":
                return <ContentBlock/>;
            case "save":
                return <ContentSave/>;
            case "vote":
                return <ActionDone/>;
            case "goback":
                return <NavigationCancel/>;
            case "share":
                return <EditorInsertLink/>;
            case "edit":
                return <ActionReorder/>;
            case "viewuser":
                return <SocialPerson/>;
            case "register":
                return <SocialPersonAdd/>;
            case "traded":
                return <AllOut/>;
            case "notrade":
                return <Cached/>;
            default:
                break;
        }
    }
     /**
     * render function for information
     */
    renderButtonInfo=()=>{

        const {buttonText,iconInfo,hasHref,hrefUrl,hasSvg,svgInfo,isDisabled}= this.props;
        
        if (hasHref){
            return (
                <RaisedButton label={buttonText} 
                    disabled={isDisabled}
                    href={hrefUrl}
                    labelPosition="before"
                    icon={hasSvg?<SvgIcon viewBox={svgInfo.viewBoxData}><path d={svgInfo.svgData}/></SvgIcon>:this.getIcon(iconInfo)}
                    onClick={this.handlerButtonClick}/>
            );
        }
        else{
            return (
                <RaisedButton label={buttonText} 
                    
                    disabled={isDisabled}
                    labelPosition="before"
                    icon={hasSvg?<SvgIcon viewBox={svgInfo.viewBoxData}><path d={svgInfo.svgData}/></SvgIcon>:this.getIcon(iconInfo)}
                    onClick={this.handlerButtonClick}/>
            );
        }
    }
     /**
     * render function normal
     */
    renderButtonNormal=()=>{
        const {iconInfo,hasHref,hasSvg,svgInfo,hrefUrl,isDisabled}= this.props;
        
        if (hasHref){
            return(
                <FloatingActionButton mini zDepth={1} href={hrefUrl} disabled={isDisabled} onClick={this.handlerButtonClick}>
                    {
                        hasSvg?<SvgIcon viewBox={svgInfo.viewBoxData}><path d={svgInfo.svgData}/></SvgIcon>:this.getIcon(iconInfo)
                    }
                </FloatingActionButton>
            );
        }
        else{
            return(
                <FloatingActionButton mini zDepth={1} onClick={this.handlerButtonClick} disabled={isDisabled}>
                    {
                        hasSvg?<SvgIcon viewBox={svgInfo.viewBoxData}><path d={svgInfo.svgData}/></SvgIcon>:this.getIcon(iconInfo)

                    }
                    
                </FloatingActionButton>
            );
        }
    }
    /**
     * mouse event handler
     */
    handleOnMouseEnter=()=>{
        this.setState({showButtonMessage:true});
    }
    /**
     * mouse event handler
     */
    handleOnMouseLeave=()=>{
        this.setState({showButtonMessage:false});
    }
    /**
     * render method
     */
    render(){
        const {showButtonMessage}= this.state;
        
        return(
            <div onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}>
                {showButtonMessage?this.renderButtonInfo():this.renderButtonNormal()}
            </div>
        );
    }
}
BookButton.propTypes={
    hasHref:PropTypes.bool.isRequired,
    hasSvg:PropTypes.bool.isRequired,
    isDisabled:PropTypes.bool.isRequired,
    hrefUrl:PropTypes.string,
    svgInfo:PropTypes.shape({
        viewBoxData:PropTypes.string,
        svgData:PropTypes.string
    }),
    buttonText:PropTypes.string.isRequired,
    iconInfo:PropTypes.string,
    clickAction:PropTypes.func,
};

export default BookButton;