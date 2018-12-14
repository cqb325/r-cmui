/**
 * @author cqb 2016-03-30.
 * @module BaseComponent
 */
import React, {PureComponent} from 'react';
import Emitter from './Emitter';
import '../../lang/zh_cn';
import '../../lang/us_en';
const i18n = window.RCMUI_LANG || 'zh_cn';

if (!window.RCMUI_I18N) {
    window.RCMUI_I18N = window.RCMUI_LANGS[i18n] || {};
}

/**
 * BaseComponent 类
 * @class BaseComponent
 * @constructor
 * @extend Component
 * @extend Emitter
 */
class BaseComponent extends PureComponent {
    displayName = 'BaseComponent';
    
    static defaultProps = {
        theme: 'default',

        disabled: false,

        visibility: true
    }

    constructor (props, context) {
        super(props, context);

        this.state = {
            theme: props.theme,
            disabled: props.disabled,
            visibility: props.visibility
        };
    }

    /**
     * 添加state
     * @method addState
     * @param params
     */
    addState (params) {
        if (!this.state) {
            this.state = {};
        }
        for (const i in params) {
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
    show () {
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
    hide () {
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
    getValue () {
        return null;
    }

    /**
     * 设置当前组件的值，需要组件中重构该方法
     * @method setValue
     * @param args {*}
     */
    setValue () {

    }

    /**
     * 设置主题
     * @method setTheme
     * @param theme {String} 主题标示可取default primary dark
     */
    setTheme (theme) {
        this.setState({theme});
    }

    /**
     * 获取主题
     * @method getTheme
     * @returns {String}
     */
    getTheme () {
        return this.state.theme;
    }

    /**
     * 禁用
     * @method disable
     * @return {Boolean} 禁用状态
     */
    disable () {
        this.setState({disabled: true});
    }

    /**
     * 启用
     * @method disable
     * @return {Boolean} 禁用状态
     */
    enable () {
        this.setState({disabled: false});
    }

    /**
     * 销毁当前组件，需要组件中重构该方法
     * @method destroy
     */
    destroy () {

    }

    /**
     * 判断当前浏览器是否是IE9或以下版本
     * @method isLtIE9
     * @returns {boolean}
     */
    isLtIE9 () {
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
    render () {
        return (<div />);
    }
}

BaseComponent.propTypes = {};

Emitter.inherits(BaseComponent);

export default BaseComponent;
