/**
 * @author cqb 2016-04-27.
 * @module RadioGroup
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import CheckBox from './CheckBox';
import Ajax from './core/Ajax';
import Core from './Core';
import FormControl from './FormControl';

/**
 * RadioGroup 类
 * @class RadioGroup
 * @constructor
 * @extend BaseComponent
 */
class RadioGroup extends BaseComponent {
    constructor(props) {
        super(props);

        let data = props.data ? Core.clone(props.data) : null;

        data = this._rebuildData(data);
        this.items = {};

        this.addState({
            data: data,
            value: props.value == undefined ? '' : props.value
        });

        this._lastChecked = null;
    }

    /**
     * 重构数据格式
     * @param data
     * @private
     */
    _rebuildData(data){
        if (!data) {
            return null;
        }
        if (Object.prototype.toString.apply(data) === '[object Array]') {
            let one = data[0];
            if (Object.prototype.toString.apply(one) === '[object String]') {
                return data.map(function(item, index){
                    let option = {id: index + '', text: item};
                    return option;
                });
            }
            if (Object.prototype.toString.apply(one) === '[object Object]') {
                return data;
            }
            return null;
        }

        if (Object.prototype.toString.apply(data) === '[object Object]') {
            let ret = [];
            for (var id in data) {
                let item = {id: id, text: data[id]};
                ret.push(item);
            }
            return ret;
        }

        return null;
    }

    /**
     * 值变化回调
     * @method handleChange
     * @param value {String} 当前操作对象的值
     * @param checked   {Boolean} 知否选中
     * @param event     {Event} 事件对象
     * @param item  {Object} 当前操作对象
     */
    handleChange(value, checked, event, item){
        const {readOnly, disabled} = this.props;

        if (readOnly || disabled) {
            return;
        }

        if (this._lastChecked) {
            this._lastChecked._node.updateState({
                checked: false
            });
        }

        this._lastChecked = item;

        this.handleTrigger(value);
    }

    /**
     * 处理值变化
     * @method handleTrigger
     * @param value {String} 当前值
     */
    handleTrigger(value){
        this.state.value = value;
        if (this.props.onChange) {
            this.props.onChange(value);
        }

        this.emit('change', value);
    }

    getItem(value){
        return this.items[value];
    }

    /**
     * 启用
     * @param value
     */
    enableItem(value){
        this.getItem(value).enable();
    }

    /**
     * 禁用
     * @param value
     */
    disableItem(value){
        this.getItem(value).disable();
    }

    /**
     * 设置值
     * @method setValue
     * @param value {String} 要设置的值
     */
    setValue(value){
        this.setState({value: value});
    }

    /**
     * 获取值
     * @method getValue
     * @returns {*}
     */
    getValue(){
        return this.state.value;
    }

    /**
     * 渲染子节点
     * @method _renderItems
     * @returns {Array} 子对象
     * @private
     */
    _renderItems(){
        let data = this.state.data || [];
        let {valueField, textField} = this.props;
        let currentValue = this.state.value;
        let name = this.props.name || 'radio_' + new Date().getTime();
        return data.map(function(item, index){
            let valueKey = valueField || 'id';
            let textKey = textField || 'text';
            let value = item[valueKey];
            let text = item[textKey];
            let checked = currentValue === value;
            if (checked) {
                this._lastChecked = item;
            }

            return (
                <CheckBox
                    key={index}
                    disabled={this.props.disabled}
                    readOnly={this.props.readOnly}
                    ref={(ref)=>{ this.items[value] = ref; }}
                    type='radio'
                    value={value}
                    label={text}
                    checked={checked}
                    item={item}
                    name={name}
                    onChange={this.handleChange.bind(this)}
                />);
        }, this);
    }

    componentWillMount(){
        if (this.props.url) {
            let scope = this;
            Ajax.get(this.props.url, {}, function(data){
                scope.setState({
                    data: data
                });
            });
        }
    }

    render () {
        let {className, layout} = this.props;
        className = classNames(
            className,
            'cm-radio-group',
            {
                stack: layout === 'stack',
                stick: this.props.stick
            }
        );

        return (
            <span className={className}>
                {this._renderItems()}
            </span>
        );
    }
}

RadioGroup.defaultProps = {
    layout: 'inline'
};

RadioGroup.propTypes = {
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
     * 默认值
     * @attribute value
     * @type {String}
     */
    value: PropTypes.any,
    /**
     * 只读属性
     * @attribute readOnly
     * @type {Boolean}
     */
    readOnly: PropTypes.bool,
    /**
     * 禁用属性
     * @attribute disabled
     * @type {Boolean}
     */
    disabled: PropTypes.bool,
    /**
     * 组名
     * @attribute name
     * @type {String}
     */
    name: PropTypes.string,
    /**
     * class样式名称
     * @attribute className
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * 行式inline、堆积stack布局
     * @attribute layout
     * @type {String}
     */
    layout: PropTypes.oneOf(['inline', 'stack']),
    /**
     * value字段
     * @attribute valueField
     * @type {String}
     */
    valueField: PropTypes.string,
    /**
     * 显示字段
     * @attribute textField
     * @type {String}
     */
    textField: PropTypes.string,
    /**
     * 值变化回调
     * @attribute onChange
     * @type {Function}
     */
    onChange: PropTypes.func
};

FormControl.register(RadioGroup, 'radio', 'array');

export default RadioGroup;
