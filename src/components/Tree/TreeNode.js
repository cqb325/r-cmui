import React from 'react';
import BaseComponent from '../core/BaseComponent';
import classNames from 'classnames';
import CheckBox from '../CheckBox';
import PropTypes from 'prop-types';
import {List, Map} from 'immutable';
import TreeSubNodes from './TreeSubNodes';

/**
 * TreeNode 类
 * @class TreeNode
 * @extend BaseComponent
 */
class TreeNode extends BaseComponent {
    static contextTypes = {
        enableDynamicTreeNode: PropTypes.bool
    }
    
    constructor (props) {
        super(props);

        this.item = this.props.item;

        this.addState({
            item: props.item
        });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.item !== this.props.item) {
            this.item = nextProps.item;
            this.setState({item: nextProps.item});
        }
    }

    /**
     * 节点选中事件回调
     * @method _select
     * @private
     */
    _select () {
        const item = this.item;
        this.props.onSelect ? this.props.onSelect(item) : false;
    }

    /**
     * 节点展开收缩事件回调
     * @method _openClose
     * @private
     */
    _openClose () {
        let item = this.item;
        item.open = !item.open;
        item = Map(item).toJS();
        this.setState({
            item
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
        let item = this.item;
        if (item._disabled) {
            return false;
        }

        if (item._checked === 0 || item._checked === 2) {
            item._checked = 1;
        } else if (item._checked === 1) {
            item._checked = 0;
        }
        item = Map(item).toJS();

        this.setState({
            item
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
        let item = this.item;
        if (item._disabled) {
            return false;
        }
        item._checked = checked;
        item = Map(item).toJS();
        this.setState({
            item
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
        this.item.text = text;
        const item = Map(this.item).toJS();
        this.setState({item});
    }

    /**
     * 展开节点
     * @method open
     */
    open () {
        let item = this.item;
        if (!item.open) {
            item.open = true;
            item = Map(item).toJS();

            this.setState({
                item
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
        let item = this.item;
        if (item.open) {
            item.open = false;
            item = Map(item).toJS();

            this.setState({
                item
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
        let item = this.item;
        if (!item._selected) {
            item._selected = true;
            item = Map(item).toJS();
            this.setState({
                item
            });
        }
    }

    /**
     * 取消选中节点
     * @method unSelect
     */
    unSelect () {
        let item = this.item;
        if (item._selected === true) {
            item._selected = false;
            item = Map(item).toJS();
            this.setState({
                item
            });
        }
    }

    addItem (newItem, callback) {
        let item = this.item;
        if (item.children) {
            item.children = List(item.children).push(newItem).toJS();
        } else {
            item.children = [newItem];
        }
        item = Map(item).toJS();

        this.setState({item}, callback);
    }

    /**
     * 清空孩子节点
     * @param {any} callback
     * @memberof TreeNode
     */
    clearChildren (callback) {
        let item = this.item;
        delete item.children;

        let checked = item.checked;
        if (checked === 2) {
            checked = 0;
        }
        item._checked = checked;
        item.open = false;
        item = Map(item).toJS();

        this.setState({item}, callback);
    }

    removeItem (theItem, callback) {
        let item = this.item;
        let children = item.children;

        const arr = List(children);
        const index = arr.indexOf(theItem);
        children = arr.delete(index).toJS();

        if (!children || !children.length) {
            children = null;
            delete item['children'];
            item.open = false;
        } else {
            item.children = children;
        }
        item = Map(item).toJS();
        this.setState({item, children}, callback);
    }

    /**
     * 添加子节点
     * @param {any} children
     * @param {any} callback
     * @memberof TreeNode
     */
    addChildren (children, callback) {
        let item = this.item;
        let childs = item.children;

        const arr = List(childs);
        if (childs && childs.length) {
            childs = arr.concat(children).toJS();
        } else {
            childs = children;
        }
        item.children = childs;
        item = Map(item).toJS();

        this.setState({item}, callback);
    }

    disabled (disabled) {
        let item = this.item;
        item._disabled = disabled;
        item = Map(item).toJS();
        this.setState({
            item
        });
    }

    getItem () {
        return this.state.item;
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
            // checkboxEle = (<span className={checkClassName} onClick={this._check.bind(this)} />);
            checkboxEle = <CheckBox className={checkClassName} disabled={item._disabled} checked={item._checked === 1 || item._checked === 2} onChange={this._check.bind(this)} />;
        }

        let subNodes = null;
        const children = item.children;

        if (children && children.length) {
            subNodes = (
                <TreeSubNodes
                    items={children}
                    parent={this.item}
                    visible={!!item.open}
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
            node_open: item.open,
            node_close: !item.open,
            node_isBranch: item.children && item.children.length,
            node_disabled: item._disabled,
            node_selected: item._selected
        });

        const contClassName = classNames('tree_cont');

        const arrowClassName = classNames('tree_arrow', {
            'tree-arrow-empty': !this.context.enableDynamicTreeNode && !(item.children && item.children.length)
        });
        const padding = item.level * 20;
        return (
            <div className='tree_node'>
                <span style={{paddingLeft: padding}} className={nodeClassName} onClick={this._select.bind(this)}>
                    <span className={arrowClassName} onClick={this._openClose.bind(this)} />
                    {checkboxEle}
                    <span data-id={item.id} className={contClassName}>
                        <span className={iconClassName} />
                        <span className='tree_text' title={item.text}>{item.text}</span>
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

export default TreeNode;
