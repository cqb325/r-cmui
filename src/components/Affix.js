/**
 * @author cqb 2016-04-05.
 * @module Affix
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';

import Events from './utils/Events';
import Dom from './utils/Dom';

/**
 * Affix 类
 * @class Affix
 * @constructor
 * @extend BaseComponent
 */
class Affix extends BaseComponent {
    static propTypes = {
        /**
         * 离上边沿的相对距离
         * @type {Number}
         */
        offsetTop: PropTypes.number,
        /**
         * 相对容器
         * @type {String}
         */
        target: PropTypes.string,
        /**
         * 自定义class
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 自定义样式
         * @type {Object}
         */
        style: PropTypes.object
    }

    constructor(props){
        super(props);

        this.addState({
            offsetTop: props.offsetTop || 0,
            offsetBottom: props.offsetBottom || 0,
            target: props.target,
            offset: null
        });

        this.orignOffset = {};
        this.target = null;
    }

    componentWillUnmount(){
        this._isMounted = false;

        Events.off(this.target, 'scroll', this.onScroll);
    }


    onScroll(){
        if (!this._isMounted) {
            return false;
        }
        let container = Dom.dom(this.target);
        let scrollTop = container[0].scrollTop;
        let parentOffset = container.offset();
        let ele = Dom.dom(ReactDOM.findDOMNode(this));

        let offsetParent = this.getOffsetParent(ele[0]);
        let offsetParentPostion = {
            top: 0,
            left: 0
        };
        if (offsetParent && offsetParent != this.target) {
            offsetParentPostion = Dom.dom(offsetParent).offset();
        }

        let distance = this.orignOffset.top - parentOffset.top - scrollTop;
        let left = this.orignOffset.left - parentOffset.left;
        if (distance > this.state.offsetTop) {
            if (this._isMounted) {
                this.setState({
                    offset: null
                });
            }
        } else {
            if (this._isMounted) {
                this.setState({
                    offset: {
                        top: scrollTop + parseFloat(this.state.offsetTop) - offsetParentPostion.top,
                        left: container[0].scrollLeft + Math.max(left, 0) - offsetParentPostion.left
                    }
                });
            }
        }
    }

    /**
     * 获取相对父节点
     * @param {Element} ele 当前节点
     */
    getOffsetParent(ele){
        let parent = ele.parentNode;

        while (parent !== null && parent.tagName !== 'HTML') {
            if (Dom.dom(parent).css('position') !== 'static') {
                return parent;
            }
            parent = parent.parentNode;
        }

        return null;
    }

    componentDidMount(){
        this._isMounted = true;
        let ele = Dom.dom(ReactDOM.findDOMNode(this));

        let target = null;
        if (this.state.target) {
            target = Dom.query(this.state.target);
        } else {
            target = document.body;
        }
        this.target = target;
        let container = Dom.dom(target);
        if (container.css('position') === 'static' && container[0].tagName !== 'BODY') {
            container.css('position', 'relative');
        }
        this.orignOffset = ele.offset();

        var scrollEle = target;
        if (container[0].tagName === 'BODY') {
            scrollEle = window;
        }
        Events.on(scrollEle, 'scroll', this.onScroll.bind(this));
    }

    render(){
        var style = this.props.style || {};
        if (this.state.offset) {
            style = Object.assign({
                'top': this.state.offset.top + 'px',
                left: this.state.offset.left + 'px',
                position: 'absolute',
                zIndex: 1000
            }, style);
        }

        let className = classNames('cm-affix', this.props.className);

        return (
            <div ref='affix' style={style} className={className}>
                {this.props.children}
            </div>
        );
    }
}

export default Affix;
