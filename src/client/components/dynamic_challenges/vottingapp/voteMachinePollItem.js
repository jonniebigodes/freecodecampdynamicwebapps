import React, {Component} from 'react';
import { browserHistory } from 'react-router';

//import '../../../Assets/stylesheets/votingApp.scss';
import '../../../../Assets/stylesheets/votingApp.scss';

class PollItem extends Component{
    constructor(props){
        super(props);
        this.state={currentLayout:"line"};
    }
    PollItemClickHandler(e){
        e.stopPropagation();
        
        console.log("PollItemClickHandler: "+this.props.ItemPollInformation.idPoll);
        browserHistory.push('/voting/poll/'+this.props.ItemPollInformation.idPoll);
        //browserHistory.push('/voting/poll/'+e.currentTarge)
    }
    LayoutLine(){
        if (this.state.currentLayout=="line"){
            return;
        }
        this.setState({currentLayout:"line"});
    }
    LayoutGrid(){
        if (this.state.currentLayout=="grid"){
            return;
        }
        this.setState({currentLayout:"grid"});
    }
    render(){
        let item= this.props;
        //console.log("data props: "+item.ItemPollInformation.pollname);
            if (this.state.currentLayout=="grid"){

                return(
                    <div id="ItemContainer" className="row pollItem" onClick={this.PollItemClickHandler.bind(this)}>
                        <div className="col-xs-6 col-sm-4">
                            Poll created by: {item.ItemPollInformation.pollCreator}
                        </div>
                        <div className="col-xs-6 col-sm-4">
                            Poll name: {item.ItemPollInformation.pollname}
                        </div>
                        <div className="col-xs-6 col-sm-4">
                            Number of poll options: {item.ItemPollInformation.pollOptions.length}
                        </div>
                    </div>
                );
            }
            else{
                return(
                    <div id="ItemContainer" className="row pollItemLine" onClick={this.PollItemClickHandler.bind(this)}>
                        <div>
                            {item.ItemPollInformation.pollname}
                        </div>
                    </div>
                );
                
            }
            
        
    }
};
export default PollItem;