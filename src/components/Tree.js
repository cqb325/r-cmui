/**
 * @author cqb 2016-04-25.
 * @module Tree
 */
import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import shallowEqual from './utils/shallowEqual';
import Ajax from './core/Ajax';

/**
 * TreeNode 类
 * @class TreeNode
 * @extend BaseComponent
 */
class TreeNode extends BaseComponent{
    constructor(props) {
        super(props);

        this.addState({
            item: props.item
        });
    }

    /**
     * 节点选中事件回调
     * @method _select
     * @private
     */
    _select() {
        let item = this.state.item;
        this.props.onSelect ? this.props.onSelect(item) : false;
    }

    /**
     * 节点展开收缩事件回调
     * @method _openClose
     * @private
     */
    _openClose() {
        let item = this.state.item;
        item.open = !item.open;
        this.updateState();
        this.props.onOpenClose ? this.props.onOpenClose(item) : false;
    }

    /**
     * 节点勾选事件回调
     * @method _check
     * @private
     */
    _check() {
        let item = this.state.item;
        this.props.onCheck ? this.props.onCheck(item) : false;

        this.updateState();
    }

    /**
     * 更新状态
     * @method updateState
     */
    updateState() {
        let item = this.state.item;
        this.setState({
            item: item
        });
    }

    /**
     * 展开节点
     * @method open
     */
    open() {
        let item = this.state.item;
        if (!item.open) {
            item.open = true;
            this.updateState();
        }
    }

    /**
     * 收缩节点
     * @method close
     */
    close() {
        let item = this.state.item;
        if (item.open) {
            item.open = false;
            this.updateState();
        }
    }

    /**
     * 选中节点
     * @method select
     */
    select() {
        let item = this.state.item;
        if (!item._selected) {
            item._selected = true;
            this.setState({
                item: item
            });
        }
    }

    /**
     * 取消选中节点
     * @method unSelect
     */
    unSelect() {
        let item = this.state.item;
        if (item._selected === true) {
            item._selected = false;
            this.setState({
                item: item
            });
        }
    }

    render() {
        let item = this.state.item;
        item._node = this;
        let iconStyle = item.icon ? {
            'backgroundImage': 'url(' + item.icon + ')'
        } : null;
        let textColor = item.color ? {
            color: item.color
        } : null;

        item._checked = item._checked === undefined ? 0 : item._checked;
        // if (this.props.enableCheckbox && this.props.enableSmartCheckbox && item._parent && item._parent._checked) {
        //    item._checked = 1;
        // }

        let checkboxEle;
        if (this.props.enableCheckbox) {
            let checkClassName = classNames('tree_checkbox', {
                checked: item._checked === 1,
                dischecked: item._checked === 2
            });
            checkboxEle = (<span className={checkClassName} onClick={this._check.bind(this)} />);
        }

        let subNodes = null;
        if (item.children && item.children.length) {
            subNodes = (
                <TreeSubNodes
                    items={item.children}
                    parent={item}
                    visible={item.open}
                    onSelect={this.props.onSelect}
                    onOpenClose={this.props.onOpenClose}
                    enableCheckbox={this.props.enableCheckbox}
                    enableSmartCheckbox={this.props.enableSmartCheckbox}
                    onCheck={this.props.onCheck}
                />
            );
        }

        let iconClassName = classNames('tree_icon', {
            icon_branch: (item.children && item.children.length),
            icon_leaf: !(item.children && item.children.length)
        });

        let nodeClassName = classNames('tree_node_wrap', {
            node_open: item.open,
            node_close: !item.open
        });

        let contClassName = classNames('tree_cont', {
            node_selected: item._selected
        });
        return (
            <div className='tree_node'>
                <span className={nodeClassName}>
                    <span className='tree_arrow' onClick={this._openClose.bind(this)} />
                    {checkboxEle}
                    <span className={contClassName} onClick={this._select.bind(this)}>
                        <span className={iconClassName} style={iconStyle} />
                        <span className='tree_text' title={item.text} style={textColor}>{item.text}</span>
                    </span>
                </span>
                {subNodes}
            </div>
        );
    }
}

TreeNode.propTypes = {
    /**
     * 节点数据
     * @attribute item
     * @type {Object}
     */
    item: PropTypes.object,
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
     * @attribute onOpenClose
     * @type {Function}
     */
    onOpenClose: PropTypes.func,
    /**
     * 节点勾选的回调
     * @attribute onCheck
     * @type {Function}
     */
    onCheck: PropTypes.func
};

/**
 * TreeSubNodes 类
 * @class TreeSubNodes
 * @extend BaseComponent
 */
class TreeSubNodes extends BaseComponent{
    constructor(props) {
        super(props);

        this.addState({
            items: props.items
        });
    }

    /**
     * 更新状态
     * @method updateState
     * @param newItems 新的数据
     */
    updateState(newItems) {
        let items = newItems || this.state.items;
        this.setState({
            items: items
        });
    }

    /**
     * 接收到新的属性的时候更新节点
     * @method componentWillReceiveProps
     * @param nextProps
     * @override
     */
    componentWillReceiveProps (nextProps) {
        if (!shallowEqual(nextProps.items, this.props.items)) {
            this.setState({ items: nextProps.items });
        }
    }

    render() {
        let items = this.state.items;
        let visible = this.props.visible;

        if (this.props.parent) {
            this.props.parent._subNodes = this;
        }

        let nodes = items.map(function(item, index) {
            item._parent = this.props.parent;
            return (
                <TreeNode
                    key={index}
                    item={item}
                    onSelect={this.props.onSelect}
                    onOpenClose={this.props.onOpenClose}
                    enableCheckbox={this.props.enableCheckbox}
                    enableSmartCheckbox={this.props.enableSmartCheckbox}
                    onCheck={this.props.onCheck}
                />
            );
        }, this);

        let classNames = this.props.isRoot ? 'tree_rootNode' : 'tree_subNode';
        let display = this.props.isRoot ? '' : visible ? '' : 'none';
        return (
            <div className={classNames} style={{display: display}}>
                {nodes}
            </div>
        );
    }
}

TreeSubNodes.propTypes = {
    /**
     * 节点数据
     * @attribute items
     * @type {Array}
     */
    items: PropTypes.array,
    /**
     * 是否为根节点
     * @attribute isRoot
     * @type {Boolean}
     */
    isRoot: PropTypes.bool,
    /**
     * 父节点数据
     * @attribute parent
     * @type {Object}
     */
    parent: PropTypes.object,
    /**
     * 是否显示
     * @attribute visible
     * @type {Boolean}
     */
    visible: PropTypes.bool,
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
     * @attribute onOpenClose
     * @type {Function}
     */
    onOpenClose: PropTypes.func,
    /**
     * 节点勾选的回调
     * @attribute onCheck
     * @type {Function}
     */
    onCheck: PropTypes.func
};

/**
 * Tree 类
 * @class Tree
 * @constructor
 * @extend BaseComponent
 */
class Tree extends BaseComponent {
    constructor(props) {
        super(props);

        this.idData = {};
        this._reBuildData(props.data);
        this.selectedItem = null;
        this.checkedItems = {};
        this.addState({
            data: props.data || [],
            url: props.url,
            enableCheckbox: props.enableCheckbox || false,
            enableSmartCheckbox: props.enableSmartCheckbox || false
        });
    }

    /**
     * 重新构建数据结构
     * @method _reBuildData
     * @param data {Object} 属性中的数据结构
     * @private
     */
    _reBuildData(data) {
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
    _select(item) {
        let lastSelectItem = this.selectedItem;

        if (!lastSelectItem || lastSelectItem.id !== item.id) {
            if (lastSelectItem) {
                lastSelectItem._node.unSelect();
            }
            item._node.select();
            this.selectedItem = item;

            if (this.props.onSelect) {
                this.props.onSelect(item);
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
    _openClose(item) {
        if (this.props.onOpen) {
            this.props.onOpen(item);
        }
        this.emit('open', item);
    }

    /**
     * 勾选的回调函数
     * @method _check
     * @param item {Object} 勾选的节点数据
     * @private
     */
    _check(item) {
        let checkedItems = this.checkedItems;

        if (item._checked === 0 || item._checked === 2) {
            item._checked = 1;
            checkedItems[item.id] = item;
        } else if (item._checked === 1) {
            item._checked = 0;
            delete checkedItems[item.id];
        }

        if (this.state.enableSmartCheckbox) {
            this.setSmartSubChecked(item);
            this.updateParentCheckStatus(item);
        }

        if (this.props.onCheck) {
            this.props.onCheck(item);
        }
        this.emit('check', item);
    }

    /**
     * 设置子节点的级联显示
     * @method setSmartSubChecked
     * @param item {Object} 当前节点
     */
    setSmartSubChecked(item) {
        this.setSubChecked(item);
        if (item.children && item.children.length) {
            item.children.forEach(function(child) {
                this.setSmartSubChecked(child);
            }, this);
        }
    }

    /**
     * 选中当前节点的子节点
     * @method setSubChecked
     * @param item {Object} 当前节点
     */
    setSubChecked(item) {
        if (item.children && item.children.length) {
            let checkedItems = this.checkedItems;
            item.children.forEach(function(child) {
                child._checked = item._checked;

                if (child._checked === 0) {
                    delete checkedItems[child.id];
                }
                if (child._checked === 1) {
                    checkedItems[child.id] = child;
                }
                if (child._checked === 2) {
                    delete checkedItems[child.id];
                }
                child._node.updateState();
            });
        }
    }

    /**
     * 设置节点的勾选状态
     * @method setItemChecked
     * @param {Object} item 节点对象
     * @param {Number} checked 节点勾选状态
     */
    setItemChecked(item, checked) {
        let checkedItems = this.checkedItems;

        item._checked = checked;
        if (item._checked === 0) {
            delete checkedItems[item.id];
        }
        if (item._checked === 1) {
            checkedItems[item.id] = item;
        }
        if (item._checked === 2) {
            delete checkedItems[item.id];
        }

        item._node.updateState();

        if (this.state.enableSmartCheckbox) {
            this.setSmartSubChecked(item);
            this.updateParentCheckStatus(item);
        }

        if (this.props.onCheck) {
            this.props.onCheck(item);
        }
        this.emit('check', item);
    }

    /**
     * 根据节点的Id或则节点对象获取子节点
     * @method getSubItems
     * @param {Object} item
     */
    getSubItems(item) {
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
    getItem(itemId) {
        return this.idData[itemId];
    }

    /**
     * 根据节点id获取节点的文字
     * @method getItemText
     * @param {Object} item
     * @return {String}
     */
    getItemText(item) {
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
    setItemText(item, text) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            item.text = text;
            item._node.updateState();
        }
    }

    /**
     * 根据节点id或节点对象设置节点颜色
     * @method setItemColor
     * @param {Object} item
     * @param {Object} color 要设置的颜色
     */
    setItemColor(item, color) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            item.color = color;
            item._node.updateState();
        }
    }

    /**
     * 根据节点id或节点对象设置节点图标
     * @method setItemImg
     * @param {Object} item
     * @param {Object} img 要设置的图标
     */
    setItemImg(item, img) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            item.icon = img;
            item._node.updateState();
        }
    }

    /**
     * 根据节点的Id或则节点对象获取节点的层级
     * @method getLevel
     * @param {Object} item 节点ID或则节点对象
     * @return {Number} 节点层级
     */
    getLevel(item) {
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
    getOpenState(item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            return item.open;
        } else {
            return null;
        }
    }

    /**
     * 获取当前选中的节点
     * @method getSelectedItem
     * @return {Object} 节点
     */
    getSelectedItem() {
        return this.selectedItem;
    }

    /**
     * 根据节点的Id或则节点对象判断节点是否勾选
     * @method isItemChecked
     * @param {Object} item 节点ID或则节点对象
     * @return {Boolean} 节点打开状态
     */
    isItemChecked(item) {
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
    checkItem(item) {
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
    unCheckItem(item) {
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
     * 根据节点的Id或则节点对象打开节点
     * @method openItem
     * @param {Object} item 节点ID或则节点对象
     */
    openItem(item) {
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
    openAllItem() {
        var items = this.getAllBranches() || [];
        items.forEach(function(item) {
            this.openItem(item);
        }, this);
    }

    /**
     * 根据节点的Id或则节点对象关闭节点
     * @method closeItem
     * @param {Object} item 节点ID或则节点对象
     */
    closeItem(item) {
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
    closeAllItem() {
        var items = this.getAllBranches() || [];
        items.forEach(function(item) {
            this.closeItem(item);
        }, this);
    }

    /**
     * 根据节点的Id或则节点对象选中节点
     * @method selectItem
     * @param {Object} item 节点ID或则节点对象
     */
    selectItem(item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            this._select(item);
        }
    }

    unSelectItem(item) {
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
    getSubCheckedItems(item) {
        return this.getSubChecks(item, 1);
    }

    /**
     * 根据节点的Id或则节点对象获取未勾选的子节点
     * @method getSubUncheckedItems
     * @param {Object} item 节点ID或则节点对象
     * @return {Array} 节点数组
     */
    getSubUncheckedItems(item) {
        return this.getSubChecks(item, 0);
    }

    /**
     * 获取所有勾选的节点
     * @method getAllChecked
     * @return {Array} 节点数组
     */
    getAllChecked() {
        return this.checkedItems;
    }

    /**
     * 获取所有勾选的节点
     * @method getAllCheckedIncludeSmart
     * @return {Array} 节点数组
     */
    getAllCheckedIncludeSmart() {
        let ret = [];
        for (let i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                let item = this.idData[i];
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
    getSubChecks(item, checked) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        var subs = [];
        if (item.children) {
            subs = item.children.filter(function(child) {
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
    getAllCheckedBranches() {
        var items = [];
        for (let i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                let item = this.idData[i];
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
    getAllCheckedLeafs() {
        var items = [];
        for (let i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                let item = this.idData[i];
                if (!item.children && item._checked === 1) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    /**
     * 添加一个节点
     * @method addItem
     * @param {Object} parent
     * @param {Object} item
     */
    addItem(parent, item) {
        if (typeof (parent) === 'string') {
            parent = this.getItem(parent);
        }
        this.idData[item.id] = item;

        item.parent = parent;
        if (parent) {
            item.level = parent.level + 1;
            parent.children ? parent.children.push(item) : parent.children = [item];
        } else {
            parent = {
                open: true,
                children: [item]
            };
            item.level = 1;
        }

        parent._node.updateState();
    }

    /**
     * 删除所有的孩子结点
     * @method deleteChildItems
     * @param {Object} item
     */
    deleteChildItems(item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            delete item.children;

            item._node.updateState();
        }
    }

    /**
     * 删除节点
     * @method removeItem
     * @param {Object} item
     */
    removeItem(item) {
        if (typeof (item) === 'string') {
            item = this.getItem(item);
        }
        if (item) {
            var parent = item._parent;
            if (parent) {
                for (let i = 0; i < parent.children.length; i++) {
                    if (shallowEqual(parent.children[i], item)) {
                        parent.children.splice(i, 1);
                        break;
                    }
                }
                if (parent.children.length === 0) {
                    delete parent['children'];
                }
                if (this.selectedItem == item) {
                    this.selectedItem = null;
                }
                parent._node.updateState();
            }
            delete this.idData[item.id];
        }
    }

    /**
     * 获取所有的非叶子节点
     * @method getAllBranches
     * @return {Array} 非叶子节点数组
     */
    getAllBranches() {
        let ret = [];
        for (let i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                let item = this.idData[i];
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
    getAllLeafs() {
        let ret = [];
        for (let i in this.idData) {
            if ({}.hasOwnProperty.call(this.idData, i)) {
                let item = this.idData[i];
                if (!item.children) {
                    ret.push(item);
                }
            }
        }

        return ret;
    }

    /**
     * 级联更新父节点的状态
     * @method updateParentCheckStatus
     * @param item {Object} 当前节点
     */
    updateParentCheckStatus(item) {
        var parent = item._parent;

        if (!parent) {
            return;
        }

        let checkNum = 0;
        let stageNum = 0;
        parent.children.forEach(function(child) {
            checkNum = child._checked === 1 ? checkNum + 1 : checkNum;
            stageNum = child._checked === 2 ? stageNum + 1 : stageNum;
        });

        var checked = parent._checked;
        if (checkNum === parent.children.length) {
            checked = 1;
        } else if (checkNum === 0) {
            checked = 0;
            if (stageNum > 0){
                checked = 2;
            }
        } else {
            checked = 2;
        }

        if (checked !== parent._checked) {
            parent._checked = checked;
            let checkedItems = this.checkedItems;
            if (parent._checked === 0) {
                delete checkedItems[parent.id];
            }
            if (parent._checked === 1) {
                checkedItems[parent.id] = parent;
            }
            if (parent._checked === 2) {
                delete checkedItems[parent.id];
            }
            parent._node.updateState();
            this.updateParentCheckStatus(parent);
        }
    }

    /**
     * 当节点存在url则请求数据
     */
    componentDidMount() {
        if (this.state.url) {
            let scope = this;
            this.req = Ajax.get(this.state.url, {}, function(data) {
                if (data) {
                    scope.setState({
                        data: data
                    });
                }
            });
        }
    }

    componentWillUnmount () {
        if (this.req) {
            this.req.abort();
        }
    }

    /**
     * 接收到新的属性的时候更新节点
     * @method componentWillReceiveProps
     * @param nextProps
     * @override
     */
    componentWillReceiveProps (nextProps) {
        if (!shallowEqual(nextProps.data, this.props.data)) {
            this.setState({ data: nextProps.data });
        }
    }

    /**
     * 动态加载JSON数据
     * @method loadDynamicJSON
     * @param {Object} parent 父节点
     * @param {Object} json 节点数据
     * @param {Object} cback 回调
     */
    loadDynamicJSON(parent, json, cback) {
        if (typeof (parent) === 'string') {
            parent = this.getItem(parent);
        }
        if (parent) {
            if (parent.children) {
                parent.children = parent.children.concat(json);
                parent._subNodes.updateState(parent.children);
            } else {
                parent.children = json;
                parent._node.updateState(parent);
            }
            cback ? cback(this) : false;
        }
    }

    render() {
        let className = classNames('cm-tree');
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
