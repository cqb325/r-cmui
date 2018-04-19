import React from 'react';
import Table from '../src/components/Table';
import Button from '../src/components/Button';
import DateTime from '../src/components/DateTime';
import './App.css';

class Comp extends React.Component {
    displayName = 'Comp';

    columns = [
        {name: 'name', text: '名称'},
        {name: 'state', text: '状态'}
    ];

    changeData = () => {
        this.table.setData([
            {id: 'ccc', name: 'ccc', state: '空闲'},
            {id: 'ddd', name: 'dddd', state: '空闲2'}
        ]);
    }

    render () {
        const data = [
            {id: 'ccc', name: 'ccc', state: '空闲'},
            {id: 'ddd', name: 'dddd', state: '空闲1'}
        ];
        return (
            <div>
                <Table ref={(f) => this.table = f} columns={this.columns} data={data}></Table>
                <DateTime />
                <Button onClick={this.changeData}>变更</Button>
            </div>
        );
    }
}
export default Comp;
