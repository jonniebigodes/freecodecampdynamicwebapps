import React, {Component} from 'react';
import '../../Assets/stylesheets/base.scss';
import { PropTypes } from 'prop-types';
class AppFooter extends Component{
    /**
     * function to inject the appropriate class on the component
     * could do a ternary but as this will be going all around so yeah...nothing beats a select case
     */
    setfooterLink=(value)=>{
        switch (value) {
            case "stocks":{
                return "linksStocks";
            }
                
            case "nights":{
                return "linksNights";
            }
            case "pins":{
                return "linkPins";
            } 
            default:{
                return "footer";
            }
                
        }
    }
    /**
     * function to inject the appropriate class on the component
     * could do a ternary but as this will be going all around so yeah...nothing beats a select case
     */
    setFooter=(value)=>{
        switch (value) {
            case "stocks":{
                return "footer-stocks";
            }
            case "nights":{
                return "footer-night";
            }
            case "pins":{
                return "footer-pins";
            }
            default:{
                return "footer";
            }
                
                
        }
    }
    /**
     * render function for the component
     */
    render(){
        const linkstock=this.setfooterLink(this.props.appName);
        const footertext=this.setFooter(this.props.appName);
        //console.log(`link stock value:${linkstock} footer text:${footertext}`);
        return(
             <div className={footertext+" voffset3"}>
                Made by <a className={linkstock} href="https://www.freecodecamp.com/jonniebigodes" 
                target="_blank">Jonniebigodes</a><br/>
            Github repository: <a className={linkstock} href="https://github.com/jonniebigodes/freecodecampdynamicwebapps" 
                target="_blank">Dynamic Challenges</a>
          </div>
        );
    }
}
AppFooter.propTypes={
    appName:PropTypes.string.isRequired,
    lightordark:PropTypes.bool
};
export default AppFooter;