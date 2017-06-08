import React, { Component } from 'react';
import Menu from 'Menu';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.MenuItemGroup;
import FontIcon from 'FontIcon';

class Page extends Component{
    render(){
        return(
            <Menu style={{width: 300}}>
                <Menu.Item>dashboard</Menu.Item>
                <SubMenu title={<span><FontIcon icon="th-large"></FontIcon>Navigation One</span>}>

                </SubMenu>
            </Menu>
        );
    }
}

export default Page;
