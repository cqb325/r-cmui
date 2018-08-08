import React from 'react';
import TreeGrid from '../../src/components/TreeGrid';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        const data = [
            {id: '1', text: '中国', desc: '中国', time: '2018-07-30', open: false, children: [
                {id: '2', text: '北京', desc: '北京', time: '2018-07-30', open: false, children: [
                    {id: '211', text: '北京2', desc: '北京2', time: '2018-07-30'},
                    {id: '212', text: '北京2', desc: '北京2', time: '2018-07-30'}
                ]},
                {id: '3', text: '上海', desc: '上海', time: '2018-07-30'}
            ]},
            {id: '11', text: '中国1', desc: '中国1', time: '2018-07-30', open: true, children: [
                {id: '21', text: '北京1', desc: '北京1', time: '2018-07-30'},
                {id: '31', text: '上海1', desc: '上海1', time: '2018-07-30'}
            ]}
        ];

        const columns = [
            {type: 'tree', text: '区域', width: '200px'},
            {name: 'desc', text: '描述'},
            {name: 'time', text: '时间'},
            {name: 'op', text: '操作', format: () => {
                return <span>
                    <i className='fa fa-edit mr-10'></i>
                    <i className='fa fa-trash mr-10'></i>
                </span>;
            }}
        ];
        return (
            <div style={{width: 800, height: 600}}>
                <table style={{width: '100%', height: 0, borderSpacing: 0}} height='0px'>
                    <tbody style={{height: '0'}}>
                        <tr style={{height: 'auto'}}>
                            <th style={{height: 0, fontSize: 0}}>区域区域区域区域区域区域区域区域区域区域</th>
                            <th style={{height: 0, fontSize: 0}}>描述</th>
                            <th style={{height: 0, fontSize: 0}}>时间</th>
                        </tr>
                    </tbody>
                </table>
                <TreeGrid columns={columns} data={data} valueField='id' textField='text'/>
            </div>
        );
    }
}
export default Comp;
