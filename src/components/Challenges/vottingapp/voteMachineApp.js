import React,{Component} from 'react';
import VoteAppHeader from './voteMachineHeader';
import VoteMachineList from './voteMachineList';

class votingApp extends Component{
    render(){
        return(
            <div id="votingAppContainer">
                <VoteAppHeader/>
                <hr/>
                <VoteMachineList id="listItemsVoting"/>
                {/*<h2>banananananaanananananananana</h2>*/}
                <hr/>
                
                <div className="footer voffset6">
                    Made by <a href="https://www.freecodecamp.com/jonniebigodes" target="_blank">Jonniebigodes</a>
                </div>
            </div>
            
        );
    }
};
export default votingApp;