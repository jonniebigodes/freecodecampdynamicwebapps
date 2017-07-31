import React, {Component} from 'react';
import '../../Assets/stylesheets/base.scss';
class AppFooter extends Component{
    render(){
        return(
             <div className="footer voffset3">
                Made by <a href="https://www.freecodecamp.com/jonniebigodes" target="_blank">Jonniebigodes</a><br/>
            Github repository: <a href="https://github.com/jonniebigodes/freecodecampdynamicwebapps" target="_blank">Dynamic Challenges</a>
          </div>
        );
    }
}
export default AppFooter;