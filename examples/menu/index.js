import React from 'react';
import Menu from '../../src/components/Menu';
import Button from '../../src/components/Button';
import Switch from '../../src/components/Switch';
import FontIcon from '../../src/components/FontIcon';
const {SubMenu, MenuItemGroup} = Menu;

class Comp extends React.Component {
    displayName = 'Comp';

    switchTheme = (value) => {
        this.menu.setTheme(value ? 'light' : 'dark');
    }

    switchLayout = () => {
        this.menu.setLayout('horizontal');
    }

    render () {
        return (
            <div>
                <div style={{padding: 50, width: 300}}>
                    <Menu theme='dark' layout='vertical' ref={(f) => this.menu = f}>
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
                    </Menu>
                    <Button onClick={this.switchLayout}>设置模式</Button>
                    <Switch onChange={this.switchTheme} />
                </div>

                <div style={{padding: 50}}>
                    <Menu layout='horizontal'>
                        <Menu.Item disabled>阿萨德</Menu.Item>
                        <SubMenu title='阿萨德'>
                            <MenuItemGroup title='Group1'>
                                <Menu.Item>阿萨德阿萨德阿萨德</Menu.Item>
                                <Menu.Item>阿萨德</Menu.Item>
                                <Menu.Item>阿萨德</Menu.Item>
                            </MenuItemGroup>
                            <MenuItemGroup title='Group2'>
                                <Menu.Item>阿萨德</Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                        <SubMenu title='阿萨德1'>
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
                    </Menu>
                </div>
            </div>
        );
    }
}
export default Comp;
