import React from 'react';

import Grid from '../../src/components/Grid';
import Progress from '../../src/components/Progress';

class Comp extends React.Component {
    displayName = 'Comp';

    columns = [
        {type: 'index', text: '序号'},
        {name: 'name', text: '名称', sort: true, sortType: 'string', tip: true},
        {name: 'domain', text: '域名', width: 200, resize: true, format: (value) => {
            return <span>
                {value}{value}{value}{value}{value}{value}{value}{value}
            </span>;
        }},
        {name: 'ip', text: 'IP'},
        {name: 'city', text: '城市'},
        {name: 'time', text: '时间', format: (v, column, row) => {
            return <Progress key={row.id} value={row.percent} strokeWidth={4} showPercent={false}/>;
        }}
    ];

    render () {
        const data = [];
        for (let i = 0; i < 1000; i++) {
            data.push({
                id: `id_${i}`,
                name: `name_${i}`,
                domain: `domain_${i}`,
                ip: `ip_${i}`,
                city: `city_${i}`,
                time: `time_${i}`,
                percent: Math.random() * 100,
                _selected: Math.random() < 0.3 ? true : false
            });
        }

        return (
            <div style={{padding: 50, height: 800}}>
                <Grid columns={this.columns} selectMode='row' border data={data} total={data.length} pageSize={50} pageNum={1} smart/>
            </div>
        );
    }
}
export default Comp;
