import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Table,TableBody,TableHeader,TableHeaderColumn,TableRow,TableRowColumn} from 'material-ui/Table';

class VotesTable extends PureComponent{
    constructor(props){
        super(props);
    }
    onRowSelectedHandler=(selectedRows)=>{
        const {tableItems,selectionHandler}= this.props;
        let i=0;
        let selectedPoll={};
        for (const item in tableItems){
            if (i==selectedRows){
                selectedPoll=tableItems[item];
                selectionHandler(selectedPoll);
                return;
            }
            i++;
        }
        
    }
    populateTableBody=()=>{
        const {tableItems}= this.props;
        let results=[];
        for (const item in tableItems){
            results.push(
                <TableRow key={`trowkey_${tableItems[item].polltoken}`} >
                    <TableRowColumn>{tableItems[item].pollname}</TableRowColumn>
                    <TableRowColumn>{tableItems[item].pollcreator.username}</TableRowColumn>
                    <TableRowColumn>{tableItems[item].polloptions.length}</TableRowColumn>
                </TableRow>
            );
        }
        return results;
    }
    render(){
        return(
            <Table onRowSelection={this.onRowSelectedHandler}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableHeaderColumn>Poll Name</TableHeaderColumn>
                    <TableHeaderColumn>Poll Creator</TableHeaderColumn>
                    <TableHeaderColumn>Number of Options</TableHeaderColumn>
                </TableHeader>
                <TableBody displayRowCheckbox={false}
                    deselectOnClickaway
                    showRowHover>
                    {this.populateTableBody()}
                </TableBody>
        </Table>
        );
    }
}
VotesTable.propTypes={
    tableItems:PropTypes.object.isRequired,
    selectionHandler:PropTypes.func.isRequired
};
export default VotesTable;