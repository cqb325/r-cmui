import React from 'react';
import SubMenu from './SubMenu';
import Item from './Item';
import Divider from './Divider';

class Group extends React.Component {
    displayName = 'Group';

    renderChildren (data) {
        if (!data.children) {
            return null;
        }
        return data.children.map(item => {
            if (item.children && item.children.length && item.group) {
                return <Group data={item} key={item.id}/>;
            }
            if (item.children && item.children.length && !item.link) {
                return <SubMenu data={item} key={item.id}/>;
            }
            if (item.divider) {
                return <Divider data={item} key={item.id}/>;
            }
            if (!item.children) {
                return <Item data={item} key={item.id}/>;
            }
            return null;
        });
    }

    render () {
        const {data} = this.props;
        return <li className={'cm-menu-item-group'}>
            <div className={'cm-menu-item-group-title'}>
                {data.text}
            </div>
            <ul className={'cm-menu-item-group-list'}>
                {this.renderChildren(data)}
            </ul>
        </li>;
    }
}

export default Group;
