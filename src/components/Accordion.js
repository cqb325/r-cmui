/**
 * @author cqb 2016-04-05.
 * @module Accordion
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from './core/BaseComponent';
import FontIcon from './FontIcon';
import velocity from 'velocity';
import UUID from './utils/UUID';

/**
 * Item Component
 */
class Item extends BaseComponent{
    static propTypes = {
        /**
         * 展开回调
         * @type {Function}
         */
        onOpen: PropTypes.func,
        /**
         * 打开完成回调
         * @type {Function}
         */
        onOpened: PropTypes.func,
        /**
         * 是否默认展开
         * @type {Boolean}
         */
        open: PropTypes.bool,
        /**
         * item的唯一标识
         * @type {String}
         */
        identify: PropTypes.string,
        /**
         * 折叠回调函数
         * @type {Function}
         */
        onCollapse: PropTypes.func,
        /**
         * 折叠完成回调
         * @type {Function}
         */
        onCollapsed: PropTypes.func,
        /**
         * 自定义class
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 自定义样式
         * @type {Object}
         */
        style: PropTypes.object,
        /**
         * 图标
         * @type {String}
         */
        icon: PropTypes.string,
        /**
         * 标题
         * @type {String}
         */
        title: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.active = props.open || false;
        this.key = props.identify || UUID.v4();
        this._animating = false;
        this.addState({
            active: props.open || false
        });
    }

    onClick(){
        if (this._animating) {
            return false;
        }
        if (!this.active) {
            this.open();
        } else {
            this.collapse();
        }
    }

    /**
     * 打开
     */
    open(){
        this._animating = true;
        let body = ReactDOM.findDOMNode(this.refs.body);
        if (this.props.onOpen) {
            this.props.onOpen(this);
        }
        velocity(body, 'slideDown', {
            duration: 300,
            complete: ()=>{
                this.active = true;
                if (this._isMounted) {
                    this.setState({
                        active: true
                    });
                }
                this._animating = false;
                if (this.props.onOpened) {
                    this.props.onOpened(this);
                }
            }
        });
    }

    /**
     * 折叠
     */
    collapse(){
        this._animating = true;
        let body = ReactDOM.findDOMNode(this.refs.body);
        if (this.props.onCollapse) {
            this.props.onCollapse(this);
        }
        velocity(body, 'slideUp', {
            duration: 300,
            complete: ()=>{
                this.active = false;
                if (this._isMounted) {
                    this.setState({
                        active: false
                    });
                }
                this._animating = false;
                if (this.props.onCollapsed) {
                    this.props.onCollapsed(this);
                }
            }
        });
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
        this.props.parent.items.push(this);
        if (this.props.open) {
            this.open();
        }
    }

    render() {
        let {className, style, icon, title, children} = this.props;

        className = classNames('cm-accordion-item', className, {
            'cm-accordion-item-active': this.state.active
        });
        icon = icon ? <FontIcon className='cm-accordion-item-icon' icon={icon} /> : null;
        return (
            <li className={className} style={style}>
                <div className='cm-accordion-item-head' onClick={this.onClick.bind(this)}>{icon}{title}</div>
                <div className='cm-accordion-item-body' ref='body'>
                    {children}
                </div>
            </li>
        );
    }
}

/**
 * Accordion 类
 * @class Accordion
 * @constructor
 * @extend BaseComponent
 */
class Accordion extends BaseComponent {
    propTypes: {
        /**
         * 展开回调函数
         * @type {Function}
         */
        onOpen: PropTypes.func,
        /**
         * 折叠回调函数
         * @type {Function}
         */
        onCollapse: PropTypes.func,
        /**
         * 自定义class
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 自定义样式
         * @type {Object}
         */
        style: PropTypes.object,
        /**
         * 容器边框
         * @type {Boolean}
         */
        bordered: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.items = [];
        this.lastOpenItem = null;
    }

    /**
     * 根据index索引展开
     * @param index
     */
    activeByIndex(index){
        if (this.items[index]) {
            this.items[index].open();
        }
    }

    /**
     * 根据item对象或item的key值打开面板
     * @param  {String/Object} item item对象或item的key值
     * @return {void}
     */
    activeItem(item){
        if (typeof item == 'string') {
            item = this.getItem(item);
        }

        if (item) {
            item.open();
        }
    }

    /**
     * 获取Item对象
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    getItem(key){
        for (let i in this.items) {
            if (this.items[i].key === key) {
                return this.items[i];
            }
        }
        return null;
    }

    /**
     * 展开回调
     * @param item
     */
    onOpen(item){
        if (this.lastOpenItem) {
            this.lastOpenItem.collapse();
        }
        this.lastOpenItem = item;

        if (this.props.onOpen) {
            this.props.onOpen(item);
        }

        this.emit('open', item);
    }

    /**
     * 折叠回调
     * @param item
     */
    onCollapse(item){
        this.lastOpenItem = null;
        if (this.props.onCollapse) {
            this.props.onCollapse(item);
        }
        this.emit('collapse', item);
    }

    renderItems(){
        let children = this.props.children;
        return React.Children.map(children, (child)=>{
            let props = child.props;
            props = Object.assign({}, props, {
                onCollapse: this.onCollapse.bind(this),
                onOpen: this.onOpen.bind(this),
                onCollapsed: this.props.onCollapsed,
                onOpened: this.props.onOpened,
                parent: this
            });

            return React.cloneElement(child, props);
        });
    }

    render(){
        let className = classNames('cm-accordion', this.state.theme, this.props.className, {
            'cm-accordion-bordered': this.props.bordered
        });

        let items = this.renderItems();

        return (
            <div className={className} style={this.props.style}>
                <ul className='cm-accordion-wrap'>
                    {items}
                </ul>
            </div>
        );
    }
}

Accordion.Item = Item;

export default Accordion;
