import React from 'react';
import Dropdown from '../../src/components/Dropdown';
import Menu from '../../src/components/Menu';

class Comp extends React.Component {
    displayName = 'Comp';

    renderMenu () {
        return <Menu>
            <Menu.Item>asd</Menu.Item>
            <Menu.Item>asd</Menu.Item>
            <Menu.Item>asd</Menu.Item>
            <Menu.Item>asd</Menu.Item>
            <Menu.Item>asd</Menu.Item>
        </Menu>;
    }

    render () {
        return <div style={{padding: 50, height: 1500}}>
            <Dropdown action='click' overlay={this.renderMenu()}>
                <a>asdasdsadasda</a>
            </Dropdown>
        </div>;
    }
}

export default Comp;
