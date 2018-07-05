import React from 'react';
import Tree from '../../src/components/Tree';
import data from './data';
import Button from '../../src/components/Button';
import Menu from '../../src/components/Menu';
import FontIcon from '../../src/components/FontIcon';
const {SubMenu, MenuItemGroup} = Menu;

class Comp extends React.Component {
    displayName = 'Comp';

    onSelect = (item, tree) => {
        console.log(item);
    }

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

    onMenuSelect = (menuItem, treeNode, tree) => {
        console.log(treeNode);
    }

    render () {
        return (
            <div style={{padding: 50}}>
                <div className='mb-20'>
                    <Button onClick={() => {
                        const item = this.tree.getSelectedItem();
                        this.tree.disableItem(item);
                    }}>禁用</Button>

                    <Button onClick={() => {
                        const item = this.tree.getSelectedItem();
                        this.tree.enableItem(item);
                    }}>激活</Button>

                    <Button onClick={() => {
                        const item = this.tree.getSelectedItem();
                        this.tree.enableItem(item);
                    }}>激活</Button>
                </div>

                <Tree ref={(f) => this.tree = f} onMenuSelect={this.onMenuSelect} contextmenu={this.renderMenu()} onSelect={this.onSelect} data={data} enableSmartDisabled enableCheckbox enableSmartCheckbox/>
            </div>
        );
    }
}
export default Comp;
