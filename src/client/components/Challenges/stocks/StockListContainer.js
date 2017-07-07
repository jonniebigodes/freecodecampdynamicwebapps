import React,{Component} from 'react';
import {Grid,Row,Col} from 'react-bootstrap';

class StockListContainer extends Component{
    constructor(props){
        super(props);
        this.state={childrenItems:[]};
    }

    componentDidMount(){

    }
    shouldComponentUpdate(nextProps,nextState){
        return this.state.children.length!=nextState.children.length;
    }
    getItemsLayout(){
        let result= [];
        for (var i=0;i<this.state.childrenItems.length;i++){
            
        }
        return result;
    }
    render(){
        return(
            <div className="ContainerSearch">
                <Grid fluid={true}>
                    {this.getItemsLayout()}
                </Grid>
            </div>
        );
    }


}
export default StockListContainer;