/**
 * @author cqb 2016-04-25.
 * @module Tree
 */
import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import fetch from '../utils/fetch';
import {List} from 'immutable';
import ContextMenu from '../ContextMenu';
import Dom from '../utils/Dom';
import TreeSubNodes from './TreeSubNodes';
import './Tree.less';


/**
 * Tree 类
 * @class Tree
 * @constructor
 * @extend BaseComponent
 */
class Tree extends BaseComponent {
    static childContextTypes = {
        enableDynamicTreeNode: PropTypes.bool
    }

    getChildContext () {
        return {
            enableDynamicTreeNode: this.props.enableDynamicTreeNode
        };
    }

    static defaultProps = {
        enableCheckbox: false,
        enableSmartCheckbox: false,
        enableSmartDisabled: false,
        enableDynamicTreeNode: false
    }
    constructor (props) {
        super(props);

        this.idData = {};
        const data = List(props.data).toJS();
        this._reBuildData(data);
        this.selectedItem = null;
        this.checkedItems = {};
        this.addState({
            data: data || [],
            url: props.url,
            enableCheckbox: props.enableCheckbox,
            enableSmartCheckbox: props.enableSmartCheckbox
        });
    }

    /**
     * 重新构建数据结构
     * @method _reBuildData
     * @param data {Object} 属性中的数据结构
     * @private
     */
    _reBuildData (data) {
        if (data) {
            data.forEach(function (item) {
                this.idData[item.id] = item;
                if (item.children && item.children.length) {
                    this._reBuildData(item.children);
                }
            }, this);
        }
    }

    /**
     * 选中的回调函数
     * @method _select
     * @param item {Object} 选中的节点数据
     * @private
     */
    _select (item) {
        const lastSelectItem = this.selectedItem;

        if (!lastSelectItem || lastSelectItem.id !== item.id) {
            if (lastSelectItem) {
                lastSelectItem._node.unSelect();
            }
            item._node.select();
            this.selectedItem = item;

            if (this.props.onSelect) {
                this.props.onSelect(item, this);
            }

            this.emit('select', item);
        }
    }

    /**
     * 展开收缩的回调函数
     * @method _openClose
     * @param item {Object} 操作的节点数据
     * @private
     */
    _openClose (item) {
        if (this.props.onOpen) {
            this.props.onOpen(item, this);
        }
        this.emit('open', item);
    }

    /**
     * 勾选的回调函数
     * @method _check
     * @param item {Object} 勾选的节点数据
     * @private
     */
    _check (item) {
        if (item._disabled) {
            return false;
        }
        const checkedItems = this.checkedItems;

        if (item._checked === 1) {
            checkedItems[item.id] = item;
        } else if (item._checked === 0) {
            delete checkedItems[item.id];
        }

        if (this.state.enableSmartCheckbox) {
            this.setSmartSubChecked(item);
            this.updateParentCheckStatus(item);
        }

        if (this.props.onCheck) {
            this.props.onCheck(item, this);
        }
        this.emit('check', item);
    }

    /**
     * 设置子节点的级联显示
     * @method setSmartSubChecked
     * @param item {Object} 当前节点
     */
    setSmartSubChecked (item) {
        this.setSubChecked(item);
        if (item.children && item.children.length) {
            item.children.forEach((child) => {
                this.setSmartSubChecked(child);
            });
        }
    }

    /**
     * 选中当前节点的子节点
     * @method setSubChecked
     * @param item {Object} 当前节点
     */
    setSubChecked (item) {
        if (item._disabled) {
            return false;
        }
        if (item.children && item.children.length) {
            const checkedItems = this.checkedItems;
            item.children.forEach((child) => {
                child._node.setChecked(item._checked);

                if (item._checked === 0) {
                    delete checkedItems[child.id];
                }
                if (child._checked === 1) {
                    checkedItems[child.id] = child;
                }
            });
        }
    }

    /**
     * 设置节点的勾选状态
     * @method setItemChecked
     * @param {Object} item 节点对象
     * @param {Number} checked 节点勾选状态
     */
    setItemChecked (item, checked) {
        if (item._disabled) {
            return false;
        }
        const checkedItems = this.checkedItems;

        item._node.setChecked(checked);
        if (item._checked === 0) {
            delete checkedItems[item.id];
        }
        if (item._checked === 1) {
            checkedItems[item.id] = item;
        }
        if (item._checked === 2) {
            delete checkedItems[item.id];
        }

        if (this.state.enableSmartCheckbox) {
            this.setSmartSubChecked(item);
            this.updateParentCheckStatus(item);
        }

        if (this.props.onCheck) {
            this.props.onCheck(item, this);
        }
        this.emit('check', item);
    }

    /**
     * 根据节点的Id或则节点对象获取子节点
     * @method getSubItems
     * @param {Object} item
     */
    getSubItems (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        return item.children;
    }

    /**
     * 根据节点的Id获取节点对象
     * @method getItem
     * @param {Object} itemId
     * @return {Object} item
     */
    getItem (itemId) {
        return this.idData[itemId];
    }

    /**
     * 根据节点id获取节点的文字
     * @method getItemText
     * @param {Object} item
     * @return {String}
     */
    getItemText (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            return item.text;
        } else {
            return null;
        }
    }

    /**
     * 根据节点id或节点对象设置节点文字
     * @method getItemText
     * @param {Object} item
     * @param {Object} text 要设置的文字
     */
    setItemText (item, text) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            item._node.setText(text);
        }
    }

    /**
     * 根据节点的Id或则节点对象获取节点的层级
     * @method getLevel
     * @param {Object} item 节点ID或则节点对象
     * @return {Number} 节点层级
     */
    getLevel (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            return item.level;
        } else {
            return null;
        }
    }

    /**
     * 根据节点的Id或则节点对象获取节点的打开状态
     * @method getOpenState
     * @param {Object} item 节点ID或则节点对象
     * @return {Boolean} 节点打开状态
     */
    getOpenState (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            return !!item.open;
        } else {
            return null;
        }
    }

    /**
     * 获取当前选中的节点
     * @method getSelectedItem
     * @return {Object} 节点
     */
    getSelectedItem () {
        return this.selectedItem;
    }

    /**
     * 根据节点的Id或则节点对象判断节点是否勾选
     * @method isItemChecked
     * @param {Object} item 节点ID或则节点对象
     * @return {Boolean} 节点打开状态
     */
    isItemChecked (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        return item._checked === 1;
    }

    /**
     * 根据节点的Id或则节点对象勾选节点
     * @method checkItem
     * @param {Object} item 节点ID或则节点对象
     */
    checkItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (!item) {
            return;
        }
        if (item._checked !== 1) {
            this.setItemChecked(item, 1);
        }
    }

    /**
     * 根据节点的Id或则节点对象取消勾选节点
     * @method unCheckItem
     * @param {Object} item 节点ID或则节点对象
     */
    unCheckItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (!item) {
            return;
        }
        if (item._checked !== 0) {
            this.setItemChecked(item, 0);
        }
    }

    /**
     * 禁用item
     * @param {*} item 
     */
    disableItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (!item) {
            return;
        }

        if (!item._disabled) {
            this.setItemDisabled(item, true);
            if (this.props.onDisableItem) {
                this.props.onDisableItem(item);
            }
        }
    }

    /**
     * 禁用item
     * @param {*} item 
     */
    enableItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (!item) {
            return;
        }

        if (item._disabled) {
            if (this.props.enableSmartDisabled && this.hasDisabledParent(item)) {
                return false;
            }
            this.setItemDisabled(item, false);
            if (this.props.onEnableItem) {
                this.props.onEnableItem(item);
            }
        }
    }

    setItemDisabled (item, disabled) {
        item._node.disabled(disabled);
        if (this.props.enableSmartDisabled && item.children) {
            item.children.forEach((child) => {
                this.setItemDisabled(child, disabled);
            });
        }
    }

    /**
     * 根据节点的Id或则节点对象打开节点
     * @method openItem
     * @param {Object} item 节点ID或则节点对象
     */
    openItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            item._node.open();
        }
    }

    /**
     * 打开所有的节点
     * @method openAllItem
     */
    openAllItem () {
        const items = this.getAllBranches() || [];
        items.forEach(function (item) {
            this.openItem(item);
        }, this);
    }

    /**
     * 根据节点的Id或则节点对象关闭节点
     * @method closeItem
     * @param {Object} item 节点ID或则节点对象
     */
    closeItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            item._node.close();
        }
    }

    /**
     * 关闭所有的节点
     * @method closeAllItem
     */
    closeAllItem () {
        const items = this.getAllBranches() || [];
        items.forEach(function (item) {
            this.closeItem(item);
        }, this);
    }

    /**
     * 根据节点的Id或则节点对象选中节点
     * @method selectItem
     * @param {Object} item 节点ID或则节点对象
     */
    selectItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            this._select(item);
        }
    }

    unSelectItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            item._node.unSelect();
            this.selectedItem = null;
        }
    }

    /**
     * 根据节点的Id或则节点对象获取勾选的子节点
     * @method getSubCheckedItems
     * @param {Object} item 节点ID或则节点对象
     * @return {Array} 节点数组
     */
    getSubCheckedItems (item) {
        return this.getSubChecks(item, 1);
    }

    /**
     * 根据节点的Id或则节点对象获取未勾选的子节点
     * @method getSubUncheckedItems
     * @param {Object} item 节点ID或则节点对象
     * @return {Array} 节点数组
     */
    getSubUncheckedItems (item) {
        return this.getSubChecks(item, 0);
    }

    /**
     * 获取所有勾选的节点
     * @method getAllChecked
     * @return {Array} 节点数组
     */
    getAllChecked () {
        return this.checkedItems;
    }

    /**
     * 获取所有勾选的节点
     * @method getAllCheckedIncludeSmart
     * @return {Array} 节点数组
     */
    getAllCheckedIncludeSmart () {
        const ret = [];
        for (const i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                const item = this.idData[i];
                if (item._checked === 1 || item._checked === 2) {
                    ret.push(item);
                }
            }
        }

        return ret;
    }

    /**
     * 根据节点的Id或则节点对象获取指定勾选状态的子节点
     * @method getSubChecks
     * @param {Object} item 节点ID或则节点对象
     * @param {Number} checked 节点的勾选状态
     * @return {Array} 节点数组
     */
    getSubChecks (item, checked) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        let subs = [];
        if (item.children) {
            subs = item.children.filter((child) => {
                return child._checked === checked;
            });
        }
        return subs;
    }

    /**
     * 获取所有勾选的非叶子节点
     * @method getAllCheckedBranches
     * @return {Array} 节点数组
     */
    getAllCheckedBranches () {
        const items = [];
        for (const i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                const item = this.idData[i];
                if (item._checked === 1 && item.children && item.children.length) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    /**
     * 获取所有勾选的叶子节点
     * @method getAllCheckedLeafs
     * @return {Array} 节点数组
     */
    getAllCheckedLeafs () {
        const items = [];
        for (const i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                const item = this.idData[i];
                if (!item.children && item._checked === 1) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    /**
     * 获取所有的禁用的节点
     */
    getAllDisabledItems () {
        const items = [];
        for (const i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                const item = this.idData[i];
                if (item._disabled) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    /**
     * 获取所有的禁用的节点
     */
    getAllEnabledItems () {
        const items = [];
        for (const i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                const item = this.idData[i];
                if (!item._disabled) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    /**
     * 是否禁用
     * @param {*} item 
     */
    isItemDisabled (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }

        if (!item) {
            return false;
        }

        return item._disabled;
    }

    /**
     * 存在禁用的父节点
     * @param {*} item 
     */
    hasDisabledParent (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }

        return this._hasDisabledParent(item);
    }

    _hasDisabledParent (item) {
        const parent = item._parent;
        if (parent) {
            if (parent._disabled) {
                return true;
            }
            return this._hasDisabledParent(parent);
        }
        return false;
    } 

    /**
     * 添加一个节点
     * @method addItem
     * @param {Object} parent
     * @param {Object} item
     */
    addItem (parent, item) {
        if (typeof (parent) === 'string') {
            parent = this.getItem(parent);
        }
        this.idData[item.id] = item;

        item.parent = parent;
        
        if (parent) {
            item.level = parent.level + 1;
            parent._node.addItem(item, () => {
                if (this.state.enableSmartCheckbox) {
                    this.updateParentCheckStatus(item);
                }
            });
        } else {
            // parent = {
            //     open: true,
            //     children: [item]
            // };
            // item.level = 1;
        }
    }

    /**
     * 删除所有的孩子结点
     * @method deleteChildItems
     * @param {Object} item
     */
    deleteChildItems (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            this.removeCheckedItems(item);
            item._node.clearChildren(() => {
                this.updateParentCheckStatus(item);
            });
        }
    }

    /**
     * 删除节点后从checkedItems中清除记录
     * @param {any} item
     * @memberof Tree
     */
    removeCheckedItems (item) {
        const checkedItems = this.checkedItems;
        if (item.children) {
            item.children.forEach((child) => {
                if (checkedItems[child.id]) {
                    delete checkedItems[child.id];
                }

                this.removeCheckedItems(child);
            });
        }
    }

    /**
     *
     * @param {any} item
     * @memberof Tree
     */
    removeCheckedItem (item) {
        const checkedItems = this.checkedItems;
        if (checkedItems[item.id]) {
            delete checkedItems[item.id];
            this.deleteItemFromIdData(item);
            this.removeCheckedItems(item);
        }
    }

    /**
     * 删除节点
     * @method removeItem
     * @param {Object} item
     */
    removeItem (item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            const parent = item._parent;
            if (parent) {
                this.removeCheckedItem(item);
                parent._node.removeItem(item, () => {
                    if (this.state.enableSmartCheckbox) {
                        this.updateItemCheckStatus(parent);
                    }
                });
                if (this.selectedItem == item) {
                    this.selectedItem = null;
                }
            }
            delete this.idData[item.id];
            this.deleteItemFromIdData(item);
        }
    }

    /**
     * 删除节点后从idData中删除
     * @param {*} item 
     */
    deleteItemFromIdData (item) {
        delete this.idData[item.id];
        if (item.children) {
            item.children.forEach((child) => {
                if (child) {
                    this.deleteItemFromIdData(child);
                }
            });
        }
    }

    /**
     * 获取所有的非叶子节点
     * @method getAllBranches
     * @return {Array} 非叶子节点数组
     */
    getAllBranches () {
        const ret = [];
        for (const i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                const item = this.idData[i];
                if (item.children && item.children.length) {
                    ret.push(item);
                }
            }
        }

        return ret;
    }

    /**
     * 获取所有的叶子节点
     * @method getAllLeafs
     * @return {Array} 叶子节点数组
     */
    getAllLeafs () {
        const ret = [];
        for (const i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                const item = this.idData[i];
                if (!item.children) {
                    ret.push(item);
                }
            }
        }

        return ret;
    }

    /**
     * 更新Item状态
     * @param {any} parent
     * @returns
     * @memberof Tree
     */
    updateItemCheckStatus (parent) {
        if (!parent) {
            return;
        }

        let checkNum = 0;
        let stageNum = 0;
        parent.children.forEach((child) => {
            checkNum = child._checked === 1 ? checkNum + 1 : checkNum;
            stageNum = child._checked === 2 ? stageNum + 1 : stageNum;
        });

        let checked = parent._checked;
        if (checkNum === parent.children.length) {
            checked = 1;
        } else if (checkNum === 0) {
            checked = 0;
            if (stageNum > 0) {
                checked = 2;
            }
        } else {
            checked = 2;
        }

        if (checked !== parent._checked) {
            parent._node.setChecked(checked);
            const checkedItems = this.checkedItems;
            if (parent._checked === 0) {
                delete checkedItems[parent.id];
            }
            if (parent._checked === 1) {
                checkedItems[parent.id] = parent;
            }
            if (parent._checked === 2) {
                delete checkedItems[parent.id];
            }
            this.updateParentCheckStatus(parent);
        }
    }

    /**
     * 级联更新父节点的状态
     * @method updateParentCheckStatus
     * @param item {Object} 当前节点
     */
    updateParentCheckStatus (item) {
        const parent = item._parent;

        this.updateItemCheckStatus(parent);
    }

    async loadRemoteData () {
        const data = await fetch(this.state.url, {}, 'get', () => {
            console.log('get remote tree data error');
        });

        if (this.props.afterRequest) {
            this.props.afterRequest(data);
        }
        const newData = List(data).toJS();
        if (this._isMounted) {
            this._reBuildData(newData);
            this.setState({
                data: newData
            });
        }
    }

    componentWillMount () {
        if (this.state.url) {
            this.loadRemoteData();
        }
    }
    /**
     * 当节点存在url则请求数据
     */
    componentDidMount () {
        this._isMounted = true;
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    /**
     * 接收到新的属性的时候更新节点
     * @method componentWillReceiveProps
     * @param nextProps
     * @override
     */
    componentWillReceiveProps (nextProps) {
        if (nextProps.data != this.props.data) {
            const data = List(nextProps.data).toJS();
            this._reBuildData(data);
            this.setState({ data });
        }
    }

    /**
     * 动态加载JSON数据
     * @method loadDynamicJSON
     * @param {Object} parent 父节点
     * @param {Object} json 节点数据
     * @param {Object} cback 回调
     */
    loadDynamicJSON (parent, json, cback) {
        if (!this.props.enableDynamicTreeNode) {
            console.warning('需要添加enableDynamicTreeNode属性');
            return;
        }
        if (typeof (parent) === 'string') {
            parent = this.getItem(parent);
        }
        if (parent) {
            const data = List(json).toJS();
            this._reBuildData(data);
            parent._node.addChildren(data, () => {
                cback ? cback(this, data) : false;
            });
        }
    }

    /**
     * 设置数据
     * @param {[type]} data [description]
     */
    setData (data) {
        this.idData = {};
        data = List(data).toJS();
        this._reBuildData(data);
        this.selectedItem = null;
        this.checkedItems = {};
        this.setState({
            data
        });
    }

    onMenuSelect = (item) => {
        const target = Dom.closest(this.contextmenu.getTrigger(), '.tree_cont');
        const id = target.getAttribute('data-id');
        const node = this.getItem(id);
        if (this.props.onMenuSelect) {
            this.props.onMenuSelect(item, node, this);
        }
    }

    render () {
        const className = classNames('cm-tree');
        
        return (
            <div className={className}>
                <TreeSubNodes
                    items={this.state.data}
                    isRoot
                    onSelect={this._select.bind(this)}
                    onOpenClose={this._openClose.bind(this)}
                    enableCheckbox={this.state.enableCheckbox}
                    enableSmartCheckbox={this.state.enableSmartCheckbox}
                    onCheck={this._check.bind(this)}
                />
                {this.props.contextmenu ? <ContextMenu ref={(f) => this.contextmenu = f} onSelect={this.onMenuSelect} overlay={this.props.contextmenu} target='.tree_cont'/> : null}
            </div>
        );
    }
}

Tree.propTypes = {
    /**
     * 数据源
     * @attribute data
     * @type {Array}
     */
    data: PropTypes.array,
    /**
     * 远程数据源
     * @attribute url
     * @type {String}
     */
    url: PropTypes.string,
    /**
     * 是否显示复选框
     * @attribute enableCheckbox
     * @type {Boolean}
     */
    enableCheckbox: PropTypes.bool,
    /**
     * 是否使用级联复选框
     * @attribute enableSmartCheckbox
     * @type {Boolean}
     */
    enableSmartCheckbox: PropTypes.bool,
    /**
     * 选中的回调
     * @attribute onSelect
     * @type {Function}
     */
    onSelect: PropTypes.func,
    /**
     * 节点展开收缩的回调
     * @attribute onOpen
     * @type {Function}
     */
    onOpen: PropTypes.func,
    /**
     * 节点勾选的回调
     * @attribute onCheck
     * @type {Function}
     */
    onCheck: PropTypes.func
};


export default Tree;
