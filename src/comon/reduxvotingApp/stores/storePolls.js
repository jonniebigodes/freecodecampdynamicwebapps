var createStore= require('redux').createStore;
var storePollTypes= require('../constants/VotingAppTypes');

var initialState = [{
  text: 'Use Redux',
  id: 0
}];

function polls(state,action){
    state=state||initialState;
    switch (action.type) {
        case storePollTypes.ADDPOLL:
            return[{
                id:(state.length===0)?0:state[0].id+1,
                text:action.text
            }].concat(state);
            break;
        case storePollTypes.LOGIN:
            return[{
                id:(state.length===0)?0:state[0].id+1,
                text:action.text
            }].concat(state);
            break;
        default:
            break;
    }
}
module.exports.createStore(polls,initialState)