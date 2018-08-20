import React from 'react';
import BaseComponent from '../core/BaseComponent';
import classNames from 'classnames';
import CheckBox from '../CheckBox';
import PropTypes from 'prop-types';
import {List} from 'immutable';
import TreeSubNodes from './TreeSubNodes';

/**
 * TreeNode 类
 * @class TreeNode
 * @extend BaseComponent
 */
class TreeNode extends BaseComponent {
    static contextTypes = {
        enableDynamicTreeNode: PropTypes.bool,
        columns: PropTypes.array
    }
    
    constructor (props) {
        super(props);

        this.addState({
            item: props.item,
            open: props.item.open,
            checked: props.item._checked,
            selected: props.item._selected,
            disabled: props.item._disabled,
            text: props.item.text,
            children: props.item.children
        });
    }

    /**
     * 节点选中事件回调
     * @method _select
     * @private
     */
    _select () {
        const item = this.state.item;
        this.props.onSelect ? this.props.onSelect(item) : false;
    }

    /**
     * 节点展开收缩事件回调
     * @method _openClose
     * @private
     */
    _openClose () {
        const open = this.state.open;
        const item = this.state.item;
        item.open = !item.open;
        this.setState({
            open: !open
        }, () => {
            if (this.refs.subNodes) {
                this.refs.subNodes.display();
            }
            this.props.onOpenClose ? this.props.onOpenClose(item) : false;
        });
    }

    /**
     * 节点勾选事件回调
     * @method _check
     * @private
     */
    _check () {
        if (this.state.disabled) {
            return false;
        }
        const item = this.state.item;

        if (item._checked === 0 || item._checked === 2) {
            item._checked = 1;
        } else if (item._checked === 1) {
            item._checked = 0;
        }

        this.setState({
            checked: item._checked
        }, () => {
            this.props.onCheck ? this.props.onCheck(item) : false;
        });
    }

    /**
     * 勾选状态
     * @param {any} checked
     * @memberof TreeNode
     */
    setChecked (checked) {
        if (this.state.disabled) {
            return false;
        }
        const item = this.state.item;
        item._checked = checked;
        this.setState({
            checked
        });
    }

    /**
     * 更新状态
     * @method updateState
     */
    updateState (item, callback) {
        const newItem = item || this.state.item;
        this.setState({
            item: newItem
        }, callback);
    }

    setText (text) {
        this.state.item.text = text;
        this.setState({text});
    }

    /**
     * 展开节点
     * @method open
     */
    open () {
        const item = this.state.item;
        if (!item.open) {
            item.open = true;

            this.setState({
                open: true
            }, () => {
                if (this.refs.subNodes) {
                    this.refs.subNodes.display();
                }
            });
        }
    }

    /**
     * 收缩节点
     * @method close
     */
    close () {
        const item = this.state.item;
        if (item.open) {
            item.open = false;

            this.setState({
                open: false
            }, () => {
                if (this.refs.subNodes) {
                    this.refs.subNodes.display();
                }
            });
        }
    }

    /**
     * 选中节点
     * @method select
     */
    select () {
        const item = this.state.item;
        if (!item._selected) {
            // item = Map(item).set('_selected', true).toJS();
            // console.log(item);
            item._selected = true;
            this.setState({
                selected: true
            });
        }
    }

    /**
     * 取消选中节点
     * @method unSelect
     */
    unSelect () {
        const item = this.state.item;
        if (item._selected === true) {
            item._selected = false;
            this.setState({
                selected: false
            });
        }
    }

    addItem (newItem, callback) {
        const item = this.state.item;
        if (item.children) {
            item.children = List(item.children).push(newItem).toJS();
        } else {
            item.children = [newItem];
        }

        this.setState({children: item.children}, callback);
    }

    /**
     * 清空孩子节点
     * @param {any} callback
     * @memberof TreeNode
     */
    clearChildren (callback) {
        const item = this.state.item;
        delete item.children;

        let checked = this.state.checked;
        if (checked === 2) {
            checked = 0;
        }
        item._checked = checked;
        item.open = false;

        this.setState({children: null, checked, open: false}, callback);
    }

    removeItem (theItem, callback) {
        const item = this.state.item;
        let children = this.state.children;

        const arr = List(children);
        const index = arr.indexOf(theItem);
        children = arr.delete(index).toJS();

        let opened = this.state.open;
        if (!children || !children.length) {
            children = null;
            delete item['children'];
            opened = false;
            item.open = false;
        } else {
            item.children = children;
        }
        this.setState({children, open: opened}, callback);
    }

    /**
     * 添加子节点
     * @param {any} children
     * @param {any} callback
     * @memberof TreeNode
     */
    addChildren (children, callback) {
        const item = this.state.item;
        let childs = this.state.children;

        const arr = List(childs);
        if (childs && childs.length) {
            childs = arr.concat(children).toJS();
        } else {
            childs = children;
        }
        item.children = childs;

        this.setState({children: childs}, callback);
    }

    disabled (disabled) {
        const item = this.state.item;
        item._disabled = disabled;
        this.setState({
            disabled
        });
    }

    renderCells () {
        const item = this.state.item;
        const cells = [];
        this.context.columns.forEach((column) => {
            if (column.type !== 'tree') {
                let text = item[column.name];
                text = this.formatData(text, column, item);
                const style = {};
                Object.assign(style, column.style, {
                    width: column.width,
                    display: column.hide ? 'none' : ''
                });
                cells.push(<span style={style} key={column.name || column.type} className='cm-grid-tree-cell'>{text}</span>);
            }
        });
        return cells;
    }

    /**
     * 格式化
     * @param {*} text 
     * @param {*} col 
     * @param {*} data 
     */
    formatData (text, col, data) {
        if (col.format) {
            let formatFun;
            if (typeof col.format === 'function') {
                formatFun = col.format;
                text = formatFun(text, col, data);
            }
        }

        return text;
    }

    render () {
        const item = this.state.item;
        item._node = this;

        item._checked = item._checked === undefined ? 0 : item._checked;

        let checkboxEle;
        if (this.props.enableCheckbox) {
            const checkClassName = classNames('tree_checkbox', {
                checked: item._checked === 1,
                dischecked: item._checked === 2
            });
            checkboxEle = <CheckBox className={checkClassName} disabled={this.state.disabled} checked={item._checked === 1 || item._checked === 2} onChange={this._check.bind(this)} />;
        }

        let subNodes = null;
        const children = this.state.children;

        if (children && children.length) {
            subNodes = (
                <TreeSubNodes
                    items={children}
                    parent={item}
                    visible={!!this.state.open}
                    onSelect={this.props.onSelect}
                    ref='subNodes'
                    onOpenClose={this.props.onOpenClose}
                    enableCheckbox={this.props.enableCheckbox}
                    enableSmartCheckbox={this.props.enableSmartCheckbox}
                    onCheck={this.props.onCheck}
                />
            );
        }

        const iconClassName = classNames('tree_icon', {
            icon_branch: (item.children && item.children.length),
            icon_leaf: !(item.children && item.children.length)
        });

        const nodeClassName = classNames('tree_node_wrap', {
            node_open: this.state.open,
            node_close: !this.state.open,
            node_isBranch: item.children && item.children.length,
            node_disabled: this.state.disabled,
            node_selected: this.state.selected
        });

        const contClassName = classNames('tree_cont', {
            node_selected: this.state.selected
        });

        const arrowClassName = classNames('tree_arrow', {
            'tree-arrow-empty': !this.context.enableDynamicTreeNode && !(item.children && item.children.length)
        });

        const left = item.level * 20;
        const style = {};
        const column = this.context.columns.filter((col) => {
            return col.type === 'tree';
        })[0];
        if (column) {
            Object.assign(style, column.style, {
                width: column.width,
                paddingLeft: left
            });
        }
        return (
            <div className='tree_node'>
                <span className={nodeClassName}>
                    <span className='cm-grid-tree-cell' style={style}>
                        <span className={arrowClassName} onClick={this._openClose.bind(this)} />
                        {checkboxEle}
                        <span data-id={item.id} className={contClassName} onClick={this._select.bind(this)}>
                            <span className={iconClassName} />
                            <span className='tree_text' title={this.state.text}>{this.state.text}</span>
                        </span>
                    </span>
                    {this.renderCells()}
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

export default TreeNode;
