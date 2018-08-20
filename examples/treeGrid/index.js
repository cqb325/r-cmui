import React from 'react';
import TreeGrid from '../../src/components/TreeGrid';
import GridTree from '../../src/components/GridTree';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        const data = [
            {id: '1', text: '中国', desc: '中国中国中国中国中国中国中国中国中国中国', time: '2018-07-30', open: false, children: [
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
                {/* <TreeGrid columns={columns} data={data} valueField='id' textField='text'/> */}

                <div style={{height: 200}}>
                    <GridTree columns={columns} data={data} enableSmartDisabled enableCheckbox enableSmartCheckbox/>
                </div>
            </div>
        );
    }
}
export default Comp;
