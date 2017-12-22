/**
 * @author cqb 2016-04-27.
 * @module RadioGroup
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import Radio from '../Radio/index';
import Core from '../core/Core';
import fetch from '../utils/fetch';
import FormControl from '../FormControl/index';
import './RadioGroup.less';

/**
 * RadioGroup 类
 * @class RadioGroup
 * @constructor
 * @extend BaseComponent
 */
class RadioGroup extends BaseComponent {
    static displayName = 'RadioGroup';
    
    static defaultProps = {
        value: '',
        layout: 'inline',
        valueField: 'id',
        textField: 'text'
    };
    constructor (props) {
        super(props);

        let data = props.data ? Core.clone(props.data) : null;

        data = this._rebuildData(data);

        this.addState({
            data,
            value: props.value
        });

        this.items = [];
        this.itemMap = {};
    }

    /**
     * 重构数据格式
     * @param data
     * @private
     */
    _rebuildData (data) {
        if (!data) {
            return null;
        }
        if (Object.prototype.toString.apply(data) === '[object Array]') {
            const one = data[0];
            if (Object.prototype.toString.apply(one) === '[object String]') {
                return data.map((item, index) => {
                    const option = {id: `${index}`, text: item};
                    return option;
                });
            }
            if (Object.prototype.toString.apply(one) === '[object Object]') {
                return data;
            }
            return null;
        }

        if (Object.prototype.toString.apply(data) === '[object Object]') {
            const ret = [];
            for (const id in data) {
                const item = {id, text: data[id]};
                ret.push(item);
            }
            return ret;
        }

        return null;
    }

    /**
     * 记录当前的checkbox对象
     * @param {[type]} ref [description]
     */
    addCheckBox = (ref) => {
        if (ref) {
            this.items.push(ref);
            this.itemMap[ref.getValue()] = ref;
        }
    }

    /**
     * 子元素移除后回调， 删除记录的对象
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    unbind = (item) => {
        this.items = this.items.filter((aitem) => {
            return aitem != item;
        });

        delete this.itemMap[item.getValue()];
    }

    /**
     * 值变化回调
     * @method handleChange
     * @param value {String} 当前操作对象的值
     * @param checked   {Boolean} 知否选中
     * @param event     {Event} 事件对象
     * @param item  {Object} 当前操作对象
     */
    handleChange = (value) => {
        const {disabled} = this.props;

        if (disabled) {
            return;
        }

        this.items.forEach((theItem) => {
            if (theItem.getValue() == value) {
                theItem.setChecked(true);
            } else {
                theItem.setChecked(false);
            }
        });

        this.handleTrigger(value);
    }

    /**
     * 处理值变化
     * @method handleTrigger
     * @param value {String} 当前值
     */
    handleTrigger (value) {
        this.state.value = value;
        if (this.props.onChange) {
            this.props.onChange(value);
        }

        this.emit('change', value);
    }

    /**
     * 获取某个索引的checkbox项
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    getItem (index) {
        const item = this.items[index];
        return item;
    }

    /**
     * 根据value值获取其中的项
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    getItemByValue (value) {
        const item = this.itemMap[value];
        return item;
    }

    /**
     * 获取所有的checkbox项
     * @return {[type]} [description]
     */
    getItems () {
        return this.items;
    }

    /**
     * 设置某个索引项为禁用状态
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    disableItem (index) {
        const item = this.getItem(index);
        if (item) {
            item.disable();
        }
    }

    /**
     * 根据选项值禁用选项
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    disableItemByValue (value) {
        const item = this.getItemByValue(value);
        if (item) {
            item.disable();
        }
    }

    /**
     * 设置某个索引项为启用状态
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    enableItem (index) {
        const item = this.getItem(index);
        if (item) {
            item.enable();
        }
    }

    /**
     * 根据选项值激活选项
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    enableItemByValue (value) {
        const item = this.getItemByValue(value);
        if (item) {
            item.enable();
        }
    }

    /**
     * 设置值
     * @method setValue
     * @param value {String} 要设置的值
     */
    setValue (value) {
        this.setState({value});
    }

    /**
     * 获取值
     * @method getValue
     * @returns {*}
     */
    getValue () {
        return this.state.value;
    }

    /**
     * 渲染子节点
     * @method _renderItems
     * @returns {Array} 子对象
     * @private
     */
    _renderItems () {
        const data = this.state.data || [];
        const {valueField, textField} = this.props;
        const currentValue = `${this.state.value}`;
        const name = this.props.name || `radio_${new Date().getTime()}`;
        return data.map(function (item, index) {
            const value = `${item[valueField]}`;
            const text = item[textField];
            const checked = currentValue === value;

            return (
                <Radio
                    key={index}
                    disabled={this.props.disabled}
                    ref={this.addCheckBox}
                    type='radio'
                    value={value}
                    label={text}
                    checked={checked}
                    name={name}
                    onChange={this.handleChange}
                />);
        }, this);
    }

    renderChildrenItems () {
        const {name} = this.props;
        const currentValue = `${this.state.value}`;
        return React.Children.map(this.props.children, (child) => {
            const componentName = child && child.type && child.type.displayName ? child.type.displayName : '';
            if (componentName === 'Radio') {
                const checked = currentValue == child.props.value;
                const props = Object.assign({}, child.props, {
                    name,
                    ref: this.addCheckBox,
                    unbind: this.unbind,
                    checked,
                    onChange: this.handleChange,
                    type: 'radio',
                    disabled: this.state.disabled || child.props.disabled
                });
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    componentWillMount () {
        if (this.props.url) {
            this.loadRemoteData();
        }
    }

    /**
     * 加载远程数据
     * @return {Promise} [description]
     */
    async loadRemoteData () {
        let data = await fetch(this.props.url);
        data = this._rebuildData(data);
        this.setState({data});
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
            this.setValue(nextProps.value);
        }
    }

    render () {
        let {className, layout} = this.props;
        className = classNames(
            className,
            'cm-radio-group',
            {
                'cm-radio-group-stack': layout === 'stack',
                'cm-radio-group-stick': this.props.stick
            }
        );

        return (
            <span className={className}>
                {this.renderChildrenItems()}
                {this._renderItems()}
            </span>
        );
    }
}

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
