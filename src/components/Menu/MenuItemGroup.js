import React from 'react';
import BaseComponent from '../core/BaseComponent';

class MenuItemGroup extends BaseComponent {
    constructor (props) {
        super(props);

        this.prefix = props.prefix;

        this.children = [];
        this.name = 'MenuItemGroup';
        this.identify = `ItemGroup_${props.parent.identify}_${props.index}`;
    }

    renderChildren () {
        const cildren = this.props.children;
        return React.Children.map(cildren, (child, index) => {
            if (child) {
                let props = child.props;
                props = Object.assign({}, props, {
                    onSelect: this.props.onSelect,
                    onClick: this.props.onClick,
                    index,
                    parent: this,
                    prefix: this.prefix,
                    root: this.props.root,
                    level: this.props.level,
                    layout: this.props.layout
                });
                return React.cloneElement(child, props);
            } else {
                return null;
            }
        });
    }

    appendChild (item) {
        this.children.push(item);
    }

    componentDidMount () {
        this.props.parent.appendChild(this);
    }

    render () {
        return (
            <li className={`${this.prefix}-item-group`}>
                <div className={`${this.prefix}-item-group-title`}>
                    {this.props.title}
                </div>
                <ul className={`${this.prefix}-item-group-list`}>
                    {this.renderChildren()}
                </ul>
            </li>
        );
    }
}

export default MenuItemGroup;
