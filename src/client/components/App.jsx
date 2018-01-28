import React,{PureComponent} from 'react';
import '../../Assets/stylesheets/base.scss';
import { browserHistory } from 'react-router';
import AppFooter from './AppFooter';
/**
 * base component for the app
 */
class App extends PureComponent {

 
 clickHandler(e){
   e.stopPropagation();
  
   switch (e.currentTarget.id) {
     case "pVoting":
       browserHistory.push('/voting/');
       break;
     case "pNight":
        browserHistory.push('/nightlife');
        break;
     case "pStock":
        browserHistory.push('/stocks');
        break;
     case "pBookTrade":
        browserHistory.push('/books');
        break; 
     case "pPin":
        browserHistory.push('/pinclone/');
        break;
     default:
       break;
   }  
 }
  render() {
    return(
      <div className="container-fluid">
        <div className="row">
          <div className="projectTitle">
              FreecodeCamp Dynamic Challenges
            </div>
        </div>  
        <div className="containerFccApp">
            <div className="panel panel-primary" id="pVoting" onClick={this.clickHandler}>
              <div className="panel-heading">
                <h3>Voting app</h3>
              </div>
              <div className="panel-body">
                <span>click this to go to the voting app<br/> application challenge</span>
              </div>
            </div>
            <div className="panel panel-primary" id="pNight" onClick={this.clickHandler}>
              <div className="panel-heading">
                <h3>Nightlife App</h3>
              </div>
              <div className="panel-body">
                <span>click this to go to the nightlife app<br/> application challenge</span>
              </div>
            </div>
            <div className="panel panel-primary" id="pStock" onClick={this.clickHandler}>
              <div className="panel-heading">
                <h3>Stocks App</h3>
              </div>
              <div className="panel-body">
                <span>click this to go to the chart the stock <br/> application challenge</span>
              </div>
            </div>
            <div className="panel panel-primary" id="pBookTrade" onClick={this.clickHandler}>
              <div className="panel-heading">
                <h3>Book trade App</h3>
              </div>
              <div className="panel-body">
                <span>click this to go to the book trading <br/> application challenge</span>
              </div>
            </div>
            <div className="panel panel-primary" id="pPin" onClick={this.clickHandler}>
              <div className="panel-heading">
                <h3>Pinclone App</h3>
              </div>
              <div className="panel-body">
                <span>click this to go to the Pinrest clone<br/> application challenge</span>
              </div>
            </div>
          </div>
          <div className="row">
            <hr/>
            <AppFooter appName="none"/>
          </div>
      </div>
        
    );
  }
}

export default App;