import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';
import {
    getPollDetailsLocal,
    getPollDetailsExternal
} from '../../../../common/constants/ApiEndPoints';
class PollInfoDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            isloading:true,
            isError:false,
            pollData:{}
        };
    }
    componentDidMount(){
        fetch(process.env.NODE_ENV !== 'production'?`${getPollDetailsLocal}${this.props.params.idPoll}`:`${getPollDetailsExternal}${this.props.params.idPoll}`)
        .then(response=>{
            return response.json();
        })
        .then(result=>{
            result.code==='fccda001'?this.setState({isError:true}):this.setState({isloading:false,pollData:result.data});
        })
        .catch(()=>{
            this.setState({isError:true});
        });
    }
    renderError=()=>{
        return(
            <h3>Well looks like something went wrong with getting the data from the server</h3>
        );
    }
    generateChartData=()=>{
        const {pollData}=this.state;
        let result={
            labels:[],
            datasets:[
                {
                    data:[],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ]
                }
            ]
        };
        pollData.polloptions.map(item=>{
            result.labels.push(item.optionname);
            result.datasets[0].data.push(item.votes);
        });
        return result;
    }
    renderData=()=>{
        const {isloading,pollData}=this.state;
        if (isloading){
            return(<h4>still loading the data and setting all up, might take a minute or two, so smoke if you got them</h4>);
        }
        else{
            return(
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-6 col-md-4">
                            <div className="panel panel-success">
                                <div className="panel-heading">
                                    {pollData.pollname}
                                </div>
                                <div className="panel-body">
                                   {pollData.polloptions.map(item=>{
                                       return (
                                            <div key="containeroptions">
                                                <div className="label label-success" key={`option_${item.idoption}`}>Poll option: {item.optionname}</div>
                                                <hr/>
                                            </div>
                                        );
                                   })}
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-8">
                            <Doughnut data={this.generateChartData()}/>
                        </div>
                    </div>
                </div>
            
            );
        }
        
    }
    render(){
        const {isError}= this.state;
        return(
            <div>
                {/* <h3>got to the detail with param:{this.props.params.idPoll}</h3> */}
                {isError?this.renderError():this.renderData()}
            </div>
            
            
        );
    }
}
export default PollInfoDetail;