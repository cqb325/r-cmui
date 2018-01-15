import React from 'react';
import ContextMenu from '../../src/components/ContextMenu';
import Menu from '../../src/components/Menu';
import FontIcon from '../../src/components/FontIcon';
import Grid from '../../src/components/Grid';
import Progress from '../../src/components/Progress';
const {SubMenu, MenuItemGroup} = Menu;

class Comp extends React.Component {
    displayName = 'Comp';

    renderMenu () {
        return <Menu theme='dark' layout='vertical' ref={(f) => this.menu = f}>
            <Menu.Item disabled><FontIcon icon='asterisk'/>Asterisk</Menu.Item>
            <SubMenu title={<span><FontIcon icon='bug'></FontIcon>Bug</span>}>
                <MenuItemGroup title='Group1'>
                    <Menu.Item>阿萨德</Menu.Item>
                    <Menu.Item>阿萨德</Menu.Item>
                    <Menu.Item>阿萨德</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title='Group2'>
                    <Menu.Item>阿萨德</Menu.Item>
                </MenuItemGroup>
            </SubMenu>
            <SubMenu title={<span><FontIcon icon='recycle'></FontIcon>Recycle</span>}>
                <Menu.Item>阿萨德1</Menu.Item>
                <Menu.Item>阿萨德1</Menu.Item>
                <SubMenu title='阿萨德11'>
                    <Menu.Item>阿萨德111</Menu.Item>
                    <Menu.Item>阿萨德111</Menu.Item>
                    <Menu.Item>阿萨德111</Menu.Item>
                    <Menu.Item>阿萨德111</Menu.Item>
                </SubMenu>
                <Menu.Divider/>
                <Menu.Item>阿萨德1</Menu.Item>
            </SubMenu>
        </Menu>;
    }

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

    onMenuSelect = (item, row, cell, rowData, cellData) => {
        
    }

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
            <div style={{height: '100%'}} >
                <div className='box' style={{width: 500, height: 500, overflow: 'auto', border: '1px solid #ccc'}}>
                    <ContextMenu overlay={this.renderMenu()} target='.cm-grid-cell'>
                        <div style={{height: 1000}}></div>
                    </ContextMenu>
                </div>

                <div style={{height: 500}}>
                    <Grid columns={this.columns} onMenuSelect={this.onMenuSelect} contextmenu={this.renderMenu()} selectMode='row' border data={data} total={data.length} pageSize={50} pageNum={1} smart/>
                </div>
            </div>
        );
    }
}
export default Comp;
