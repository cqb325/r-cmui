/**
 * @author cqb 2017-01-17.
 * @module Menu
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import Dom from './utils/Dom';
import velocity from 'velocity';
import Events from './utils/Events';
const isDescendant = Dom.isDescendant;

/**
 * Menu 类
 * @class Menu
 * @constructor
 * @extend BaseComponent
 */
class Menu extends BaseComponent{
    constructor(props){
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.modal = props.modal;

        this.openKeys = {};
        this.lastOpenKey = null;
        this.items = {};
        this.children = [];

        this.addState({
            layout: props.layout
        });
        this.name = 'Menu';
        this.prefix = props.prefix || 'cm-menu';
        this.startIndex = props.startIndex == undefined ? 1 : 0;
    }

    getOpenKeys(){
        return this.openKeys;
    }

    /**
     * 获取模式 single、multi
     * @returns {string}
     */
    getModal(){
        return this.modal;
    }

    /**
     * 选中回调
     * @param item
     */
    onSelect(item){
        if (this.props.onSelect) {
            this.props.onSelect(item);
        }
        this.emit('select', item);
    }

    /**
     * 取消选中回调
     * @param item
     */
    unSelect(item){
        if (this.props.unSelect) {
            this.props.unSelect(item);
        }
        this.emit('unSelect', item);
    }

    /**
     * 点击回调
     * @param item
     */
    onClick(item){
        if (this.props.onClick) {
            this.props.onClick(item);
        }
        this.emit('click', item);
    }

    /**
     * 折叠回调
     * @param item
     */
    onCollapse(item){
        if (this.props.onCollapse) {
            this.props.onCollapse(item);
        }
        this.emit('collapse', item);
    }

    /**
     * 设置主题
     * @param theme
     */
    setTheme(theme){
        this.setState({theme});
    }

    /**
     * 打开回调
     * @param item
     */
    onOpen(item){
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
    collapse(key, collapsed){
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

    selectItem(key){
        let item = this.items[key];
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
    bindKey(key, item){
        this.items[key] = item;
        if (item.name === 'SubMenu' && item.isOpen()) {
            this.openKeys[key] = true;
            if (this.modal === 'single') {
                this.lastOpenKey = key;
            }
        }
    }

    appendChild(item){
        this.children.push(item);
    }

    renderChildren(){
        let cildren = this.props.children;
        return React.Children.map(cildren, (child, index)=>{
            let props = child.props;
            props = Object.assign({}, props, {
                onSelect: this.onSelect,
                onClick: this.onClick,
                onCollapse: this.onCollapse,
                onOpen: this.onOpen,
                parent: this,
                root: this,
                index: index,
                level: this.startIndex,
                prefix: this.prefix,
                layout: this.props.layout
            });
            return React.cloneElement(child, props);
        });
    }

    componentWillUnmount(){
        this._isMounted = false;
        Events.off(document, 'click', this.onDocumentClick);
    }

    componentDidMount(){
        this._isMounted = true;
        if (this.props.layout !== 'inline') {
            Events.on(document, 'click', this.onDocumentClick.bind(this));
        }
    }

    onDocumentClick(event){
        if (this._isMounted) {
            let target = event.target || event.srcElement;
            let ele = ReactDOM.findDOMNode(this);
            if (ele != target && !isDescendant(ele, target)) {
                for (let key in this.openKeys) {
                    this.collapse(key, true);
                }
            }
        }
    }

    render(){
        let {className, style} = this.props;
        className = classNames(className, this.prefix, this.state.theme, {
            [`${this.prefix}-${this.state.layout}`]: this.props.layout !== undefined
        });
        return (
            <ul className={className} style={style}>
                {this.renderChildren()}
            </ul>
        );
    }
}

Menu.defaultProps = {
    theme: 'light',
    modal: 'single',
    layout: 'inline'
};

/**
 * Divider
 */
class Divider extends BaseComponent{
    render(){
        return <li className={this.props.prefix + '-item-divider'} />;
    }
}

Menu.Divider = Divider;


class SubMenu extends BaseComponent{
    constructor(props){
        super(props);

        this.prefix = props.prefix;
        this.addState({
            hover: false,
            collapsed: !props.open || false
        });

        this.identify = props.identify || 'SubMenu_level_' +
        (props.parent.identify ? props.parent.identify : '') + '_' + props.index;
        this.children = [];
        this.name = 'SubMenu';

        this.isAnimating = false;
    }

    appendChild(item){
        this.children.push(item);
    }

    renderChildren(){
        let cildren = this.props.children;
        return React.Children.map(cildren, (child, index)=>{
            let props = child.props;
            props = Object.assign({}, props, {
                onSelect: this.props.onSelect,
                onClick: this.props.onClick,
                parent: this,
                root: this.props.root,
                index: index,
                prefix: this.prefix,
                level: this.props.level + 1,
                layout: this.props.layout
            });
            return React.cloneElement(child, props);
        });
    }

    onMouseOver(){
        if (this.props.disabled) {
            return false;
        }
        this.setState({hover: true});
    }

    onMouseOut(){
        if (this.props.disabled) {
            return false;
        }
        this.setState({hover: false});
    }

    onMouseLeave(){
        if (this.props.disabled) {
            return false;
        }
        if (this.props.layout === 'horizontal') {
            if (this.leaveTimer) {
                window.clearTimeout(this.leaveTimer);
                this.leaveTimer = null;
            }
            this.leaveTimer = window.setTimeout(()=>{
                this.onClick(null, true, false);
            }, 300);
        }
    }

    onMouseEnter(){
        if (this.props.disabled) {
            return false;
        }
        if (this.props.layout === 'horizontal') {
            if (this.enterTimer) {
                window.clearTimeout(this.enterTimer);
                this.enterTimer = null;
            }
            this.enterTimer = window.setTimeout(()=>{
                this.onClick(null, true, true);
            }, 100);
        }
    }

    onClick(event, called, collapse){
        if (this.props.disabled) {
            return false;
        }

        if (!called && (this.props.layout === 'horizontal')) {
            return false;
        }
        let parent = this.props.root;
        let openKeys = parent.getOpenKeys();
        if (parent.getModal() === 'single') {
            if (!openKeys[this.identify]) {
                if (!this.lastOpenIsOffsetParent()) {
                    parent.collapse(parent.lastOpenKey, true);
                }
            }
        }

        if (!called && this.props.onClick) {
            this.props.onClick(this);
        }

        if (this.props.layout === 'horizontal') {
            if (collapse && this.state.collapsed) {
                this.collapse(false);
            }
            if (!collapse && !this.state.collapsed) {
                this.collapse(true);
            }
        } else {
            if (this.state.collapsed) {
                this.collapse(false);
            } else {
                this.collapse(true);
            }
        }
    }

    lastOpenIsOffsetParent(){
        let parent = this.props.parent;
        let root = this.props.root;
        while (parent) {
            if (parent.identify === root.lastOpenKey) {
                return true;
            }

            parent = parent.props.parent;
        }

        return false;
    }

    /**
     * 是否打开的状态
     * @returns {boolean}
     */
    isOpen(){
        return !this.state.collapsed;
    }

    /**
     * 折叠打开
     * @param collapsed
     */
    collapse(collapsed){
        if (this.isAnimating) {
            return false;
        }
        let subMenu = Dom.dom(ReactDOM.findDOMNode(this.refs.subMenu));
        let parent = this.props.root;
        let openKeys = parent.getOpenKeys();
        this.isAnimating = true;
        if (collapsed) {
            velocity(subMenu[0], 'slideUp', {
                duration: 300,
                complete: ()=>{
                    this.isAnimating = false;
                }
            });

            if (this.props.onCollapse) {
                this.props.onCollapse(this);
            }

            if (parent.getModal() === 'single') {
                // 当前打开的是自身
                if (openKeys[this.identify]) {
                    if (this.props.parent.name !== 'Menu') {
                        let p = this.props.parent;
                        if (p.name === 'MenuItemGroup') {
                            p = p.props.parent;
                        }
                        parent.lastOpenKey = p.identify;
                    } else {
                        parent.lastOpenKey = null;
                    }
                }
                delete openKeys[this.identify];
            } else {
                delete openKeys[this.identify];
            }
        } else {
            velocity(subMenu[0], 'slideDown', {
                duration: 300,
                complete: ()=>{
                    this.isAnimating = false;
                }
            });

            if (this.props.onOpen) {
                this.props.onOpen(this);
            }

            if (parent.getModal() === 'single') {
                parent.lastOpenKey = this.identify;
                openKeys[this.identify] = true;
            } else {
                openKeys[this.identify] = true;
            }
        }
        window.setTimeout(()=>{
            if (this._isMounted) {
                this.setState({
                    collapsed: collapsed
                });
            }
        }, 0);
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
        let root = this.props.root;
        root.bindKey(this.identify, this);

        this.props.parent.appendChild(this);
    }

    render(){
        let className = classNames(`${this.prefix}-submenu-title`, {
            [`${this.prefix}-submenu-title-hover`]: this.state.hover,
            [`${this.prefix}-disabled`]: this.props.disabled
        });

        let className2 = classNames(`${this.prefix}-submenu`, {
            [`${this.prefix}-submenu-active`]: !this.state.collapsed
        });

        let paddingLeft = this.props.layout === 'inline' ? 24 * this.props.level : 0;
        let style = paddingLeft ? {paddingLeft: paddingLeft} : null;
        return (
            <li className={className2}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
            >
                <div className={className}
                    onMouseOver={this.onMouseOver.bind(this)}
                    onMouseOut={this.onMouseOut.bind(this)}
                    onClick={this.onClick.bind(this)}
                    style={style}
                >
                    <span>
                        {this.props.title}
                    </span>
                </div>
                <ul ref='subMenu' className={`${this.prefix}-sub ${this.prefix}`}
                    style={{display: this.props.open ? 'block' : 'none'}}>
                    {this.renderChildren()}
                </ul>
            </li>
        );
    }
}

class MenuItemGroup extends BaseComponent{
    constructor(props){
        super(props);

        this.prefix = props.prefix;

        this.children = [];
        this.name = 'MenuItemGroup';
        this.identify = 'ItemGroup_' + props.parent.identify + '_' + props.index;
    }

    renderChildren(){
        let cildren = this.props.children;
        return React.Children.map(cildren, (child, index)=>{
            let props = child.props;
            props = Object.assign({}, props, {
                onSelect: this.props.onSelect,
                onClick: this.props.onClick,
                index: index,
                parent: this,
                prefix: this.prefix,
                root: this.props.root,
                level: this.props.level,
                layout: this.props.layout
            });
            return React.cloneElement(child, props);
        });
    }

    appendChild(item){
        this.children.push(item);
    }

    componentDidMount(){
        this.props.parent.appendChild(this);
    }

    render(){
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

class Item extends BaseComponent{
    constructor(props){
        super(props);

        this.identify = props.identify || 'Item_level_' +
        (props.parent.identify ? props.parent.identify : '') + '_' + props.index;
        this.prefix = props.prefix;

        this.addState({
            active: props.select || false
        });
        this.name = 'Item';
    }

    /**
     * 点击
     * @returns {boolean}
     */
    onClick(){
        if (this.props.disabled) {
            return false;
        }

        if (this.props.onClick) {
            this.props.onClick(this);
        }
        this.emit('click', this);

        let parent = this.props.root;
        if (parent.lastSelect && parent.lastSelect != this) {
            parent.lastSelect.unSelect();
        }
        this.select();
    }

    /**
     * 选择
     */
    select(){
        if (this._isMounted) {
            this.setState({active: true});
        }
        let parent = this.props.root;
        parent.lastSelect = this;

        if (this.props.layout !== 'inline') {
            let parent = this.props.parent;
            while (parent.name !== 'Menu') {
                if (parent.name === 'SubMenu') {
                    parent.collapse(true);
                }
                parent = parent.props.parent;
            }
        }

        if (this.props.onSelect) {
            this.props.onSelect(this);
        }

        this.emit('select', this);
    }

    unSelect(){
        if (this._isMounted) {
            this.setState({active: false});
        }
        let parent = this.props.root;
        parent.lastSelect = null;
        if (parent.unSelect) {
            parent.unSelect(this);
        }
    }

    getKey(){
        return this.identify;
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
        let root = this.props.root;
        root.bindKey(this.identify, this);
        this.props.parent.appendChild(this);
    }

    render(){
        let className = classNames(this.props.className, `${this.prefix}-item`, {
            [`${this.prefix}-item-active`]: this.state.active,
            [`${this.prefix}-disabled`]: this.props.disabled
        });

        let paddingLeft = this.props.layout === 'inline' ? 24 * this.props.level : 0;
        let style = paddingLeft ? {paddingLeft: paddingLeft} : null;
        return (
            <li className={className}
                onClick={this.onClick.bind(this)}
                style={style}
            >
                <a href={this.props.link || 'javascript:void(0)'}>{this.props.children}</a>
            </li>
        );
    }
}

Menu.SubMenu = SubMenu;
Menu.MenuItemGroup = MenuItemGroup;
Menu.Item = Item;

export default Menu;
