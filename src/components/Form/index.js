/**
 * @author cqb 2016-05-19.
 * @module Form
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import grids from '../utils/grids';
import Button from '../Button/index';
import PropTypes from 'prop-types';
import './Form.less';
import fetch from '../utils/fetch';
import Row from './Row';
import Promote from './Promote';
const getGrid = grids.getGrid;


/**
 * Form 类
 * @class Form
 * @constructor
 * @extend BaseComponent
 */
class Form extends BaseComponent {
    static displayName = 'Form';

    static defaultProps = {
        useDefaultSubmitBtn: true,
        submitTheme: 'primary'
    };

    constructor(props) {
        super(props);

        this.action = props.action;
        this.method = props.method;
        this.target = props.target;
        // 是否使用默认提交按钮
        this.useDefaultSubmitBtn = props.useDefaultSubmitBtn;

        this.items = {};

        if (props.component && props.component != 'form') {
            this.method = 'ajax';
        }
    }

    /**
     * 是否验证通过
     * @method isValid
     * @returns {boolean} 是否验证通过
     */
    isValid(){
        for (let name in this.items) {
            let control = this.items[name];

            if (!control.ref.check()) {
                return false;
            }
        }

        return true;
    }

    /**
     * 获取formControl
     * @method getFormControl
     * @param name {String} 字段名称
     * @returns {*}
     */
    getFormControl(name){
        return this.items[name].ref;
    }

    /**
     * 获取Form表单元素
     * @method getItem
     * @param name {String} 字段名称
     * @returns {*}
     */
    getItem(name){
        if (this.items[name]) {
            return this.items[name].ref.getReference();
        }

        return null;
    }

    /**
     * 将子元素绑定到表单
     * @method itemBind
     * @param data 子元素数据
     */
    itemBind = (data)=>{
        if (data.name) {
            this.items[data.name] = data;
        } else {
            console.log(data.ref, 'need a name property');
        }
    }

    /**
     * 将子元素从表单中解绑
     * @method itemUnBind
     * @param name
     */
    itemUnBind = (name)=>{
        delete this.items[name];
    }

    /**
     * 渲染子元素
     * @method renderChildren
     * @returns {*}
     */
    renderChildren(){
        return React.Children.map(this.props.children, (child)=>{
            let componentName = (child && child.type && child.type.displayName) ? child.type.displayName : '';
            if (componentName === 'FormControl' || componentName === 'Row') {
                let props = Object.assign({
                    'itemBind': this.itemBind,
                    'itemUnBind': this.itemUnBind
                }, child.props);
                props.layout = this.props.layout ? this.props.layout : props.layout;
                props.tipTheme = this.props.tipTheme ? this.props.tipTheme : props.tipTheme;
                props.tipAlign = this.props.tipAlign ? this.props.tipAlign : props.tipAlign;
                props.tipAuto = this.props.tipAuto ? this.props.tipAuto : props.tipAuto;
                props.labelWidth = this.props.labelWidth ? this.props.labelWidth : props.labelWidth;
                return React.cloneElement(child, props);
            } else if (componentName === 'Promote') {
                let props = Object.assign({
                    labelWidth: this.props.labelWidth ? this.props.labelWidth : child.props.labelWidth
                }, child.props);
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    /**
     * 提交表单
     * @method submit
     */
    submit = ()=>{
        let {customParams, ajax} = this.props;
        let method = this.method;
        if (this.isValid()) {
            if (ajax) {
                let params = customParams ? customParams() : this.getFormParams();
                this.submitData(params);
            } else if (method === 'custom') {
                if (this.props.submit) {
                    this.props.submit();
                }
            } else {
                this.refs.form.submit();
            }
        }
    }

    /**
     * ajax 提交数据
     * @param {any} params
     * @memberof Form
     */
    async submitData(params){
        let res = await fetch(this.action, params, this.props.method, this.props.onError);
        if(this.props.onSuccess){
            this.props.onSuccess(res);
        }
        this.emit('success', res);
    }

    /**
     * 获取表单的Items
     * method getItems
     * @returns {{}|*}
     */
    getItems(){
        return this.items;
    }

    /**
     * 获取表单元素的值
     * @method getFormParams
     * @returns {{}}
     */
    getFormParams(){
        let params = {};
        for (let name in this.items) {
            let control = this.items[name];
            if(control.ref.getValue){
                let value = control.ref.getValue();
                params[name] = value;
            }
        }

        return params;
    }

    /**
     * 渲染提交按钮
     * @method renderSubmit
     * @returns {XML}
     */
    renderSubmit(){
        if (this.useDefaultSubmitBtn) {
            return (
                <Button theme={this.props.submitTheme} onClick={this.submit}>{this.props.submitText || '保 存'}</Button>
            );
        } else {
            return null;
        }
    }

    render () {
        let {className, grid, style, layout, encType} = this.props;

        className = classNames('cm-form', className, getGrid(grid), {
            [`cm-form-${layout}`]: layout
        });

        if (this.props.component && this.props.component === 'div') {
            return (
                <div ref="form" className={className} style={style}>
                    {this.renderChildren()}
                    <div style={{'textAlign': 'center'}}>
                        {this.renderSubmit()}
                    </div>
                </div>
            );
        } else {
            return (
                <form ref="form" className={className} style={style} encType={encType} action={this.action}
                    method={this.method || 'post'} target={this.target}>
                    {this.renderChildren()}
                    <div style={{'textAlign': 'center'}}>
                        {this.renderSubmit()}
                    </div>
                </form>
            );
        }
    }
}

Form.propTypes = {
    /**
     * 自定义class
     * @attribute className
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * 自定义样式
     * @attribute style
     * @type {Object}
     */
    style: PropTypes.object,
    /**
     * 宽度
     * @attribute grid
     * @type {Object/Number}
     */
    grid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * 提交服务
     * @attribute action
     * @type {String}
     */
    action: PropTypes.string,
    /**
     * 提交方式
     * @attribute method
     * @type {String}
     */
    method: PropTypes.oneOf(['post', 'get', 'ajax', 'custom']),
    /**
     * 提交目标
     * @attribute target
     * @type {String}
     */
    target: PropTypes.string,
    /**
     * 提交按钮文字
     * @attribute submitText
     * @type {String}
     */
    submitText: PropTypes.string,
    /**
     * 布局
     * @attribute layout
     * @type {String}
     */
    layout: PropTypes.string,
    /**
     * 是否使用默认的提交按钮
     * @attribute useDefaultSubmitBtn
     * @type {String/Boolean}
     */
    useDefaultSubmitBtn: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

Form.Row = Row;
Form.Promote = Promote;

export default Form;
