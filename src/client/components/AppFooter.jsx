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
            case "stocks":
                return "linksStocks";
                break;
            case "nights":
                return "linksNights";
                break;
            default:
                return "footer";
                break;
        }
    }
    /**
     * function to inject the appropriate class on the component
     * could do a ternary but as this will be going all around so yeah...nothing beats a select case
     */
    setFooter=(value)=>{
        switch (value) {
            case "stocks":
                return "footer-stocks";
                break;
            case "nights":
                return "footer-night";
                break;
            default:
                return "footer";
                break;
                
        }
    }
    /**
     * render function for the component
     */
    render(){
        const linkstock=this.setfooterLink(this.props.appName);
        //console.log("class Name: "+ linkstock);
        const footertext=this.setFooter(this.props.appName);
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
    appName:PropTypes.string.isRequired
};
export default AppFooter;