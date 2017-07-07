import React from 'react';
import {TableForm, FontIcon} from '../../components';

class Render extends React.Component{
    constructor(props){
        super(props);
    }

    addRow(){
        this.refs.tableForm.addRow();
    }

    deleteRow(id){
        this.refs.tableForm.removeRowById(id);
    }

    render(){
        let columns = [
            {name: 'value', type: 'text', text: 'value'},
            {name: 'text', type: 'text', text: 'text'},
            {name: "op", text: "操作", format: function(value, col, row){
                return <a href="javascript:void(0)" onClick={()=>{
                    this.deleteRow(row.id);
                }} className="text-blue delete-btn" data-id="'+row.id+'"><i className="fa fa-trash"></i></a>;
            }}
        ];
        return (
            <div>
                <FontIcon icon='plus' onClick={()=>{
                    this.addRow();
                }}></FontIcon>
                <TableForm columns={columns} ref="tableForm" className="form-table text-center"/>
            </div>
        );
    }
}

export default Render;
