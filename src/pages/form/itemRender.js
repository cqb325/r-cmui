import React from 'react';
import {TableForm, FontIcon} from '../../components';

class Render extends React.Component{
    addRow(){
        this.refs.tableForm.addRow();
    }

    deleteRow(id){
        this.refs.tableForm.removeRowById(id);
        this.updateItem();
    }

    updateItem(){
        if (this.props.onChange){
            let ret = this.refs.tableForm.getData();
            ret = ret.map((item)=>{
                return {
                    id: item.value,
                    text: item.text
                };
            });
            this.props.onChange(ret);
        }
    }

    componentDidMount(){
        if (this.props.value){
            let value = this.props.value;
            value.forEach((item)=>{
                this.refs.tableForm.addRow({
                    value: item.id,
                    text: item.text
                });
            });
        }
    }

    render(){
        let scope = this;
        let columns = [
            {
                name: 'value',
                type: 'text',
                text: 'value'
            },
            {
                name: 'text',
                type: 'text',
                text: 'text'
            },
            {
                name: 'op',
                text: '操作',
                format: function(value, col, row){
                    return <a
                        href='javascript:void(0)'
                        onClick={scope.deleteRow.bind(scope, row.id)}
                        className='text-blue delete-btn'
                        data-id='+row.id+'
                    >
                        <i className='fa fa-trash' />
                    </a>;
                }
            }
        ];
        return (
            <div>
                <FontIcon
                    icon='plus'
                    onClick={() =>{
                        this.addRow();
                    }}
                />
                <TableForm columns={columns} ref='tableForm' className='form-table text-center' onChange={()=>{
                    this.updateItem();
                }} />
            </div>
        );
    }
}

export default Render;
