//import '../Assets/stylesheets/base.scss';
import '../../Assets/stylesheets/base.scss';
import React,{Component} from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Panel from 'react-bootstrap/lib/Panel';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppFooter from './AppFooter';
/**
 * base component for the app
 */
class App extends Component {

  componentDidMount(){
        injectTapEventPlugin();
  }
 clickHandler(e){
   e.stopPropagation();
   
   switch (e.currentTarget.id) {
     case "pVoting":
       
       browserHistory.push('/voting');
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
        browserHistory.push('/pinclone');
        break;
     default:
       break;
   }  
 }
  render() {
    return(
      <div className="App">
            <div className="projectTitle">
              FreecodeCamp Dynamic Challenges
            </div>
            <div className="textBase voffset4">
              <Jumbotron>
                <div className="voffset4 row">
                  <Panel className="col-xs-6 col-sm-4" header={<h3>Voting app</h3>} bsStyle="primary" id="pVoting" onClick={this.clickHandler.bind(this)}>
                    <div className="panel-body">
                      <span>click this to go to the voting app<br/> application challenge</span>
                    </div>
                  </Panel>
                  <Panel className="col-xs-6 col-sm-4" header={<h3>Nightlife App</h3>} bsStyle="primary" id="pNight" onClick={this.clickHandler.bind(this)}>
                    <div className="panel-body">
                      <span>click this to go to the Nightlife<br/>Coordination challenge app</span>
                    </div>
                  </Panel>
                  <Panel className="col-xs-6 col-sm-4" header={<h3>StockChart App</h3>} bsStyle="primary" id="pStock" onClick={this.clickHandler.bind(this)}>
                    <div className="panel-body">
                      <span>click this to go to the chart the stock <br/>market challenge app</span>
                    </div>
                  </Panel>
                </div>
                <div className="voffset2 row">
                  <Panel className="col-xs-6 col-sm-4" header={<h3>Book trade App</h3>} bsStyle="primary" id="pBookTrade" onClick={this.clickHandler.bind(this)}>
                    <div className="panel-body">
                      <span>click this to go to the book trading<br/>Club challenge app</span>
                    </div>
                  </Panel>
                  <Panel className="col-xs-6 col-sm-4" header={<h3>Pinrest Clone App</h3>} bsStyle="primary" id="pPin" onClick={this.clickHandler.bind(this)}>
                    <div className="panel-body">
                      <span>click this to go to the Pinrest clone<br/>challenge app</span>
                    </div>
                  </Panel>
                </div>
              </Jumbotron>
            </div>
          
          <hr/>
          <AppFooter appName="none"/>
          
        </div>
        
    );
  }
}


export default App;