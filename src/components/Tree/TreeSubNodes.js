import React from 'react';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import {List} from 'immutable';
import velocity from '../../lib/velocity';
import TreeNode from './TreeNode';

/**
 * TreeSubNodes 类
 * @class TreeSubNodes
 * @extend BaseComponent
 */
class TreeSubNodes extends BaseComponent {
    constructor (props) {
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
    updateState (newItems) {
        const items = newItems || this.state.items;
        this.setState({
            items: List(items).toJS()
        });
    }

    /**
     * 接收到新的属性的时候更新节点
     * @method componentWillReceiveProps
     * @param nextProps
     * @override
     */
    componentWillReceiveProps (nextProps) {
        if (nextProps.items != this.props.items) {
            this.setState({ items: nextProps.items });
        }
    }

    display () {
        if (this._isMounted) {
            const visible = this.props.visible;
            const display = this.props.isRoot ? true : visible ? true : false;
            const ele = this.ele;
            if (display) {
                velocity(ele, 'slideDown', {duration: 300});
            } else {
                velocity(ele, 'slideUp', {duration: 300});
            }
        }
    }

    componentDidMount () {
        this._isMounted = true;
        this.display();
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    render () {
        const items = this.state.items;

        if (this.props.parent) {
            this.props.parent._subNodes = this;
        }

        const nodes = items.map(function (item) {
            item._parent = this.props.parent;
            item.level = item._parent ? item._parent.level + 1 : 0;
            return (
                <TreeNode
                    key={item.id}
                    item={item}
                    onSelect={this.props.onSelect}
                    onOpenClose={this.props.onOpenClose}
                    enableCheckbox={this.props.enableCheckbox}
                    enableSmartCheckbox={this.props.enableSmartCheckbox}
                    onCheck={this.props.onCheck}
                />
            );
        }, this);

        const classNames = this.props.isRoot ? 'tree_rootNode' : 'tree_subNode';
        return (
            <div className={classNames} style={{display: 'none'}} ref={(f) => this.ele = f}>
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


export default TreeSubNodes;
