/**
 * @author cqb 2016-04-27.
 * @module CheckBoxGroup
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';
import FormControl from '../FormControl/index';
import CheckBox from '../CheckBox/index';
import fetch from '../utils/fetch';


/**
 * CheckBoxGroup 类
 * @class CheckBoxGroup
 * @constructor
 * @extend BaseComponent
 */
class CheckBoxGroup extends BaseComponent {
    static displayName = 'CheckBoxGroup';

    static propTypes = {
        /**
         * 数据源
         * @attribute data
         * @type {Array}
         */
        data: PropTypes.array,
        /**
         * 默认值
         * @attribute value
         * @type {String}
         */
        value: PropTypes.string,
        /**
         * 数据源地址
         * @attribute url
         * @type {String}
         */
        url: PropTypes.string,
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

    static defaultProps = {
        value: '',
        layout: 'inline',
        valueField: 'id',
        textField: 'text'
    };

    constructor(props) {
        super(props);

        this.addState({
            data: props.data,
            value: props.value + '',
            disabled: false,
        });

        this.items = [];
        this.itemMap = {};
    }

    /**
     * 记录当前的checkbox对象
     * @param {[type]} ref [description]
     */
    addCheckBox = (ref)=>{
        if(ref){
            this.items.push(ref);
            this.itemMap[ref.getValue()] = ref;
        }
    }

    /**
     * 子元素移除后回调， 删除记录的对象
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    unbind = (item)=>{
        this.items = this.items.filter((aitem)=>{
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
    handleChange = ()=>{
        const {disabled} = this.state;

        if (disabled) {
            return;
        }

        let ret = [];

        this.items.forEach((theItem)=>{
            if (theItem.isChecked()) {
                ret.push(theItem.getValue());
            }
        });

        this.handleTrigger(ret.join(','));
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

    /**
     * 设置新数据
     * @param {[type]} newData [description]
     */
    setData(newData){
        this.setState({data: newData});
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

    disable(){
        super.disable();
        this.items.forEach((item)=>{
            item.disable();
        });
    }

    enable(){
        super.enable();
        this.items.forEach((item)=>{
            item.enable();
        });
    }

    /**
     * 设置某个索引项为禁用状态
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    disableItem(index){
        let item = this.getItem(index);
        if (item) {
            item.disable();
        }
    }

    /**
     * 根据选项值禁用选项
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    disableItemByValue(value){
        let item = this.getItemByValue(value);
        if (item) {
            item.disable();
        }
    }

    /**
     * 设置某个索引项为启用状态
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    enableItem(index){
        let item = this.getItem(index);
        if (item) {
            item.enable();
        }
    }

    /**
     * 根据选项值激活选项
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    enableItemByValue(value){
        let item = this.getItemByValue(value);
        if (item) {
            item.enable();
        }
    }

    /**
     * 获取某个索引的checkbox项
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    getItem(index){
        let item = this.items[index];
        return item;
    }

    /**
     * 根据value值获取其中的项
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    getItemByValue(value){
        let item = this.itemMap[value];
        return item;
    }

    /**
     * 获取所有的checkbox项
     * @return {[type]} [description]
     */
    getItems(){
        return this.items;
    }

    /**
     * 渲染显式的子组件
     * @return {Array} 子元素
     */
    renderChildrenItems(){
        let {name} = this.props;

        return React.Children.map(this.props.children, (child)=>{
            let componentName = child.type && child.type.displayName ? child.type.displayName : '';
            if (componentName === 'CheckBox') {
                let props = Object.assign({}, child.props, {
                    name: name,
                    ref: this.addCheckBox,
                    unbind: this.unbind,
                    onChange: this.handleChange,
                    disabled: this.state.disabled
                });
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    /**
     * 渲染子节点
     * @method renderItems
     * @returns {Array} 子对象
     * @private
     */
    renderItems(){
        let {valueField, textField, name} = this.props;

        let data = this.state.data || [];
        let values = this.state.value === undefined ? [] : this.state.value.split(',');
        return data.map((item)=>{
            let itemData = JSON.parse(JSON.stringify(item));
            let value = itemData[valueField] + '';
            let text = itemData[textField];
            let checked = values.indexOf(value) != -1;
            itemData._checked = checked;

            return (<CheckBox key={value}
                name={name}
                ref={this.addCheckBox}
                disabled={this.state.disabled}
                value={value}
                label={text}
                checked={checked}
                item={itemData}
                unbind={this.unbind}
                onChange={this.handleChange}
            />);
        }, this);
    }

    componentWillMount(){
        if (this.props.url) {
            this.loadRemoteData();
        }
    }

    /**
     * 加载远程数据
     * @return {Promise} [description]
     */
    async loadRemoteData(){
        let data = await fetch(this.props.url);
        this.setState({data});
    }

    render () {
        let {className, layout, style} = this.props;
        className = classNames(
            className,
            'cm-checkbox-group',
            {
                stack: layout === 'stack'
            }
        );

        return (
            <span className={className} style={style}>
                {this.renderChildrenItems()}
                {this.renderItems()}
            </span>
        );
    }
}

FormControl.register(CheckBoxGroup, 'checkbox', 'array');

export default CheckBoxGroup;
