import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import SubMenu from './SubMenu';
import Item from './Item';
import Group from './Group';
import Divider from './Divider';
import UUID from '../utils/UUID';
import BaseComponent from '../core/BaseComponent';

import '../Menu/Menu.less';
import './style.less';

class Menu extends BaseComponent {
    displayName = 'Menu';

    constructor (props) {
        super(props);
        this.init(props.data);
    }

    static defaultProps = {
        theme: 'light',
        layout: 'inline',
        startIndex: 1,
        multi: false,
        tip: false,
        min: false
    }

    static childContextTypes = {
        layout: PropTypes.string,
        onSelectItem: PropTypes.func,
        onSelectSubMenu: PropTypes.func,
        tip: PropTypes.bool,
        min: PropTypes.bool,
        bindKey: PropTypes.func
    }

    getChildContext () {
        return {
            layout: this.props.layout,
            onSelectItem: this.onSelectItem.bind(this),
            onSelectSubMenu: this.onSelectSubMenu.bind(this),
            tip: this.props.tip,
            min: this.props.min,
            bindKey: this.bindKey.bind(this)
        };
    }

    state = {
        currentKey: null,
        submenuClick: 0
    }

    map = {};

    items = {};
    submenus = {};
    
    /**
     * 初始化数据
     * @param {*} data 
     */
    init (data, parent) {
        data.forEach(element => {
            element.id = element.identify || element.id || UUID.v4();
            element.parent = parent;
            if (!parent) {
                element.level = this.props.startIndex;
            } else {
                element.level = parent.level + 1;
            }
            this.map[element.id] = element;

            if (element.children) {
                this.init(element.children, element);
            }
        });
    }

    /**
     * 记住item和subMenu
     * @param {*} key 
     * @param {*} item 
     * @param {*} type 
     */
    bindKey (key, item, type) {
        if (type === 'item') {
            this.items[key] = item;
        }
        if (type === 'submenu') {
            this.submenus[key] = item;
        }
    }

    /**
     * 选择菜单项
     * @param {*} key 
     */
    onSelectItem (key) {
        this.selectItem(key, true);
    }

    /**
     * 点击submenu
     * @param {*} key 
     */
    onSelectSubMenu (key) {
        const open = !this.map[key].open;
        const item = this.map[key];
        item.open = open;
        if (open && !this.props.multi) {
            const sib = this.getSibblingAndOpen(item);
            if (sib) {
                sib.open = false;
            }
        }
        this.setState({submenuClick: this.state.submenuClick + 1}, () => {
            if (open) {
                if (this.props.onOpen) {
                    this.props.onOpen(item);
                }
            } else {
                if (this.props.onClose) {
                    this.props.onClose(item);
                }
            }
        });
    }

    getSibblingAndOpen (item) {
        let parent = item.parent;
        if (!item.parent) {
            parent = this.props.data;
        } else {
            parent = parent.children;
        }
        const opens = parent.filter(ele => {
            return ele.id !== item.id && ele.open;
        });
        if (opens && opens.length) {
            return opens[0];
        }
        return null;
    }

    /**
     * 更新父级的状态
     * @param {*} item 
     */
    updateParentState (item, flag) {
        const parent = item.parent;
        if (parent) {
            // 是submenu
            if (!parent.group) {
                parent.open = flag;
            }
            
            this.updateParentState(parent, flag);
        }
    }

    renderChildren () {
        const data = this.props.data;
        if (data) {
            return data.map((item) => {
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
        return null;
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

    /**
     * 获取菜单项对象
     * @param {*} key 
     */
    getItem (key) {
        return this.items[key];
    }

    getAllItem () {
        return this.items;
    }

    /**
     * 获取菜单项数据
     * @param {*} key 
     */
    getItemData (key) {
        return this.map[key];
    }

    /**
     * 禁用某个菜单项
     * @param {*} key 
     */
    disableItem (key) {
        this.getItemData(key).disabled = true;
        this.setState({submenuClick: this.state.submenuClick + 1});
    }

    /**
     * 激活菜单项
     * @param {*} key 
     */
    enableItem (key) {
        this.getItemData(key).disabled = false;
        this.setState({submenuClick: this.state.submenuClick + 1});
    }

    /**
     * 选中菜单项
     * @param {*} key 
     */
    selectItem (key, custom) {
        this.activeItem(key, this.props.onSelect, this.props.onUnSelect, custom);
    }

    /**
     * 取消选中
     * @param {*} key 
     */
    unSelectItem (key) {
        this.unActiveItem(key, this.props.onUnSelect);
    }

    /**
     * 设置菜单项选中状态
     * @param {*} key 
     * @param {*} onSelect 
     * @param {*} onUnSelect 
     * @param {*} custom 
     */
    activeItem (key, onSelect, onUnSelect, custom) {
        this.getItemData(key).active = true;
        const lastKey = this.state.currentKey;
        if (lastKey && this.map[lastKey]) {
            this.map[lastKey].active = false;
            if (!this.props.multi) {
                this.updateParentState(this.map[lastKey], false);
            }
        }
        this.map[key].active = true;
        if (!this.props.multi) {
            if (custom) {
                this.updateParentState(this.map[key], true);
            } else {
                if (this.props.layout === 'inline') {
                    this.updateParentState(this.map[key], true);
                }
            }
        }
        this.setState({currentKey: key, lastClickKey: key}, () => {
            if (onSelect) {
                onSelect(this.map[key]);
            }
            if (onUnSelect) {
                onUnSelect(this.map[lastKey]);
            }
        });
    }

    /**
     * 取消选中状态
     * @param {*} key 
     * @param {*} onUnSelect 
     */
    unActiveItem (key, onUnSelect) {
        if (this.map[key]) {
            this.map[key].active = false;
            this.setState({currentKey: null, lastClickKey: key}, () => {
                if (onUnSelect) {
                    onUnSelect(this.map[key]);
                }
            });
        }
    }

    /**
     * 获取当前激活的key
     */
    getActiveKey () {
        return this.state.currentKey;
    }

    /**
     * 获取激活的菜单项
     */
    getActive () {
        return this.state.currentKey ? this.map[this.state.currentKey] : null;
    }

    render () {
        let {className, style, min, layout} = this.props;
        if (min) {
            layout = 'vertical';
        }
        className = classNames(className, 'cm-menu', this.props.theme, {
            [`cm-menu-${layout}`]: layout !== undefined,
            'cm-menu-min': min
        });
        return (
            <ul className={className} style={style} onContextMenu={this.onContextMenu}>
                {this.renderChildren()}
            </ul>
        );
    }
}


export default Menu;
