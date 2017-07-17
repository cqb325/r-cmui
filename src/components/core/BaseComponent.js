/**
 * @author cqb 2016-03-30.
 * @module BaseComponent
 */

import React, {Component} from 'react';
import Emitter from './Emitter';

/**
 * BaseComponent 类
 * @class BaseComponent
 * @constructor
 * @extend Component
 * @extend Emitter
 */
class BaseComponent extends Component{
    /**
     * className
     * @property className
     * @type String
     */
    className=undefined;
    /**
     * 自定义样式
     * @property style
     * @type Object
     */
    style=undefined;
    /**
     * 是否禁用
     * @property disabled
     * @type Boolean
     */
    disabled=false;
    /**
     * 是否只读
     * @property readOnly
     * @type Boolean
     */
    readOnly=false;
    /**
     * 组件的宽度
     * @property width
     * @type String
     * @default auto
     */
    width = 'auto';
    /**
     * 组件的高度
     * @property height
     * @type String
     * @default auto
     */
    height = 'auto';
    /**
     * 组件的id
     * @property id
     * @type String
     */
    id='';
    /**
     * 组件的子节点内容
     * @property children
     * @type Element
     */
    children=undefined;

    constructor (props) {
        super(props);

        let prop;

        for (prop in props) {
            if ({}.hasOwnProperty.call(this, prop)) {
                this[prop] = props[prop];
            }
        }

        this.state = {
            /**
             * 组件的主题
             * @property theme
             * @type {String}
             * @default default
             */
            theme: props.theme || 'default',
            /**
             * 组件的显示状态
             * @property visibility
             * @type Boolean
             * @default true
             */
            visibility: true
        };
    }

    /**
     * 添加state
     * @method addState
     * @param params
     */
    addState(params){
        if (!this.state){
            this.state = {};
        }
        for (var i in params) {
            if ({}.hasOwnProperty.call(params, i)) {
                this.state[i] = params[i];
            }
        }
    }

    /**
     * 显示组件,如果注册了beforeShow事件则根据
     * beforeShow的回调结果判断是否进行显示,返回值为
     * false则不往下执行，为true则继续执行，显示之前触发show
     * 事件，显示后触发shown事件
     * @method show
     * @chain
     * @return {Object}
     */
    show(){
        let ret = this.emit('beforeShow');
        ret = ret === undefined ? true : ret;
        if (ret && !this.state.visibility) {
            this.emit('show');
            this.setState({visibility: true});
            this.emit('shown');
        }
        return this;
    }

    /**
     * 隐藏组件,如果注册了 beforeHide 事件则根据
     * beforeHide 的回调结果判断是否进行隐藏,返回值为
     * false则不往下执行，为true则继续执行，隐藏之前触发 hide
     * 事件，显示后触发 hidden 事件
     * @method hide
     * @chain
     * @return {Object}
     */
    hide() {
        let ret = this.emit('beforeHide');
        ret = ret === undefined ? true : ret;
        if (ret && this.state.visibility) {
            this.emit('hide');
            this.setState({visibility: false});
            this.emit('hidden');
        }
        return this;
    }

    /**
     * 获取组件当前值，需要组件中重构该方法
     * @method getValue
     * @returns {null}
     */
    getValue() {
        return null;
    }

    /**
     * 设置当前组件的值，需要组件中重构该方法
     * @method setValue
     * @param args {*}
     */
    setValue() {

    }

    /**
     * 设置主题
     * @method setTheme
     * @param theme {String} 主题标示可取default primary dark
     */
    setTheme(theme) {
        this.setState({theme: theme});
    }

    /**
     * 获取主题
     * @method getTheme
     * @returns {String}
     */
    getTheme() {
        return this.state.theme;
    }

    /**
     * 销毁当前组件，需要组件中重构该方法
     * @method destroy
     */
    destroy() {

    }

    /**
     * 判断当前浏览器是否是IE9或以下版本
     * @method isLtIE9
     * @returns {boolean}
     */
    isLtIE9() {
        if (navigator.userAgent.indexOf('MSIE') > 0) {
            if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
                return true;
            } else if (navigator.userAgent.indexOf('MSIE 7.0') > 0) {
                return true;
            } else if (navigator.userAgent.indexOf('MSIE 8.0') > 0) {
                return true;
            } else if (navigator.userAgent.indexOf('MSIE 9.0') > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * 默认渲染元素
     * @method render
     * @returns {XML}
     */
    render() {
        return (<div />);
    }
}

BaseComponent.propTypes = {};

Emitter.inherits(BaseComponent);

export default BaseComponent;
