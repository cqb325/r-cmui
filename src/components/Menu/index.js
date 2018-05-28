/**
 * @author cqb 2017-01-17.
 * @module Menu
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import Item from './Item';
import SubMenu from './SubMenu';
import MenuItemGroup from './MenuItemGroup';

import './Menu.less';

/**
 * Menu 类
 * @class Menu
 * @constructor
 * @extend BaseComponent
 */
class Menu extends BaseComponent {
    static displayName = 'Menu';

    static defaultProps = {
        prefix: 'cm-menu',
        startIndex: 1,
        theme: 'light',
        modal: 'single',
        layout: 'inline',
        storeClickState: true
    };

    constructor (props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.modal = (props.layout === 'vertical' || props.layout === 'horizontal') ? 'single' : props.modal;

        this.openKeys = {};
        this.lastOpenKey = null;
        this.selectedSubMenus = [];
        this.items = {};
        this.children = [];

        this.addState({
            layout: props.layout
        });
        this.name = 'Menu';
    }

    getOpenKeys () {
        return this.openKeys;
    }

    /**
     * 获取模式 single、multi
     * @returns {string}
     */
    getModal () {
        return this.modal;
    }

    /**
     * 设置layout
     * @param {*} layout 
     */
    setLayout (layout) {
        this.setState({layout});
        for (const i in this.items) {
            if (this.items[i].setLayout) {
                this.items[i].setLayout(layout);
            }
        }
    }

    /**
     * 选中回调
     * @param item
     */
    onSelect (item) {
        if (this.props.onSelect) {
            this.props.onSelect(item);
        }
        this.emit('select', item);
    }

    /**
     * 取消选中回调
     * @param item
     */
    unSelect (item) {
        if (this.props.unSelect) {
            this.props.unSelect(item);
        }
        this.emit('unSelect', item);
    }

    unSelectSubMenus () {
        this.selectedSubMenus.forEach((key) => {
            const subMenu = this.items[key];
            if (subMenu && subMenu.setSelectStatus) {
                subMenu.setSelectStatus(false);
            }
        });
    }

    /**
     * 点击回调
     * @param item
     */
    onClick (item) {
        if (this.props.onClick) {
            this.props.onClick(item);
        }
        this.emit('click', item);
    }

    /**
     * 折叠回调
     * @param item
     */
    onCollapse (item) {
        if (this.props.onCollapse) {
            this.props.onCollapse(item);
        }
        this.emit('collapse', item);
    }

    /**
     * 打开回调
     * @param item
     */
    onOpen (item) {
        if (this.props.onOpen) {
            this.props.onOpen(item);
        }
        this.emit('open', item);
    }

    /**
     * 折叠或展开
     * @param key
     * @param collapsed
     */
    collapse (key, collapsed) {
        let item = this.items[key];
        if (item) {
            while (item) {
                if (item.props.parent.name === 'Menu') {
                    item.collapse(collapsed);
                    break;
                } else {
                    item = item.props.parent;
                }
            }
        }
    }

    selectItem (key) {
        const item = this.items[key];
        if (item && item.select) {
            item.select();
            let parent = item.props.parent;
            while (parent) {
                if (parent.name === 'SubMenu') {
                    parent.collapse(false);
                }
                parent = parent.props.parent;
            }
        }
    }

    /**
     * 绑定Item
     * @param key
     * @param item
     */
    bindKey (key, item) {
        this.items[key] = item;
        if (item.name === 'SubMenu' && item.isOpen()) {
            this.openKeys[key] = true;
            if (this.modal === 'single') {
                this.lastOpenKey = key;
            }
        }
    }

    appendChild (item) {
        this.children.push(item);
    }

    renderChildren () {
        const cildren = this.props.children;
        return React.Children.map(cildren, (child, index) => {
            if (child) {
                let props = child.props;
                props = Object.assign({}, props, {
                    onSelect: this.onSelect,
                    onClick: this.onClick,
                    onCollapse: this.onCollapse,
                    onOpen: this.onOpen,
                    parent: this,
                    root: this,
                    index,
                    level: this.props.startIndex,
                    prefix: this.props.prefix,
                    layout: this.props.layout
                });
                return React.cloneElement(child, props);
            } else {
                return null;
            }
        });
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    componentDidMount () {
        this._isMounted = true;
    }

    onContextMenu = (event) => {
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        return false;
    }

    render () {
        let {className, style, prefix} = this.props;
        className = classNames(className, prefix, this.state.theme, {
            [`${prefix}-${this.state.layout}`]: this.props.layout !== undefined
        });
        return (
            <ul className={className} style={style} onContextMenu={this.onContextMenu}>
                {this.renderChildren()}
            </ul>
        );
    }
}

/**
 * Divider
 */
class Divider extends BaseComponent {
    render () {
        return <li className={`${this.props.prefix}-item-divider`} />;
    }
}


Menu.SubMenu = SubMenu;
Menu.MenuItemGroup = MenuItemGroup;
Menu.Item = Item;
Menu.Divider = Divider;

export default Menu;
