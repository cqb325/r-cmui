import React from 'react';

import Grid from '../../src/components/Grid';
import Progress from '../../src/components/Progress';
import Button from '../../src/components/Button';
import FormControl from '../../src/components/FormControl';
import moment from 'moment';
import '../../src/components/Input';
import '../../src/components/TextArea';
import '../../src/components/DateTime';
import '../../src/components/Slider';

class Comp extends React.Component {
    displayName = 'Comp';

    cities = [
        {id: '1', text: '北京'},
        {id: '2', text: '上海'},
        {id: '3', text: '天津'}
    ];
    columns = [
        {type: 'checkbox', text: '序号'},
        {name: 'name', text: '名称', sort: true, sortType: 'string', tip: true, editor: <FormControl type='text'/>},
        {name: 'domain', text: '域名', sort: true, width: 200, resize: true, format: (value) => {
            return <span>
                {value}{value}{value}{value}{value}{value}{value}{value}
            </span>;
        }, editor: <FormControl type='textarea' height={80}/>},
        {name: 'ip', text: 'IP'},
        {name: 'city', text: '城市', width: 150, filters: [
            { text: 'London', id: '1' },
            { text: 'New York', id: '2' }
        ], onFilter: (vals, record) => {
            if (!vals) {
                return true;
            }
            if (!record.city) {
                return false;
            }
            vals = vals.split(',');
            let ret = true;
            vals.forEach((val) => {
                ret = ret && record.city.includes(val);
            });
            return ret;
        }, editor: <FormControl type='select' data={this.cities} />},
        {name: 'time', text: '时间', width: 130, editor: <FormControl type='datetime' format='YYYY-MM-DD' dateOnly/>},
        {name: 'percent', text: '进度', editor: <FormControl type='slider' step={0.1}/>, format: (v, column, row) => {
            return <Progress key={row.id} value={v} strokeWidth={4} showPercent={false} />;
        }}
    ];

    addRow = () => {
        this.grid.addRow({
            id: `row_${Math.random()}`,
            name: `name${Math.random() * 1000}`
        });
    }

    removeRow = () => {
        const data = this.grid.getCheckedRows();
        console.log(data.length);
        this.grid.removeRows(data);
    }

    render () {
        const data = [];
        const now = moment();
        for (let i = 0; i < 100000; i++) {
            data.push({
                id: `id_${i}`,
                name: `name_${i}`,
                domain: `domain_${i}`,
                ip: `ip_${i}`,
                city: `city_${i}`,
                time: now.add(1, 'day').format('YYYY-MM-DD'),
                percent: Math.random() * 100,
                _selected: Math.random() < 0.3 ? true : false
            });
        }

        return (
            <div style={{padding: 50, height: 800}}>
                <Grid ref={(f) => this.grid = f} columns={this.columns} editable
                    border total={data.length} pageSize={20} pageNum={1} muiltiSort={false} data={data} />
                {/* {source='dynamic' action='http://localhost:8415/mock/cdn-ops/dc/list'} */}
                <Button onClick={this.addRow}>添加数据</Button>
                <Button onClick={this.removeRow}>删除数据</Button>
            </div>
        );
    }
}
export default Comp;
