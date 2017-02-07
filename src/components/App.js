import '../Assets/stylesheets/base.scss';
import React,{Component} from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
/**
 * base component for the app
 */
class App extends Component {
 
  render() {
    
    return(
      <div className="App">
        <div className="projectTitle">
          FreecodeCamp Dynamic Challenges
        </div>
        <div className="textBase voffset4">
          Bellow is a list of endpoints and how to use them for the challenges implemented
          <Jumbotron>
            item 1
          </Jumbotron>
        </div>
        
        <hr/>
        <div className="footer voffset6">
           Made by <a href="https://www.freecodecamp.com/jonniebigodes" target="_blank">Jonniebigodes</a>
        </div>
        
      </div>
      
      
      
      
    )
  }
};
export default App;