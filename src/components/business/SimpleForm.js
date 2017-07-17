import React from 'react';
import BaseComponent from '../core/BaseComponent';
import FormControl from '../FormControl';
import Form from '../Form';
import Button from '../Button';

class SimpleForm extends BaseComponent{
    constructor(props) {
        super(props);

        this.state = {
            data: props.data || {},
            initData: props.initData || {}
        };

        this.itemIndex = 0;
    }

    /**
     *
     * @param target
     * @param source
     * @param props
     */
    mergeProps(target, source, props){
        if (props) {
            props.forEach(function(prop){
                if (source[prop] !== undefined) {
                    target[prop] = source[prop];
                }
            });
        }
    }

    /**
     * change事件
     * @param item
     * @param value
     * @param selectItem
     */
    onChange(item, value, selectItem){
        item.value = value;

        if (this.props.onChange) {
            this.props.onChange(item, value, selectItem);
        }

        this.emit('change', item, value, selectItem);
    }

    /**
     *
     * @param items
     */
    renderItems(items){
        if (items) {
            return items.map((item)=>{
                if (item.type === 'button') {
                    return <Button {...item} key={this.itemIndex++}>{item.label}</Button>;
                }
                if (item.type === 'label') {
                    return <span key={this.itemIndex++} style={item.style} {...item.props}>{item.label}</span>;
                }
                if (item.type === 'promote') {
                    let style = item.style || {};
                    if (this.state.data) {
                        if (this.state.data.labelWidth || (this.state.data.props && this.state.data.props.labelWidth)) {
                            style['paddingLeft'] = parseInt(this.state.data.labelWidth, 10) + 8;
                            if (this.state.data.props && this.state.data.props.labelWidth) {
                                style['paddingLeft'] = parseInt(this.state.data.props.labelWidth, 10) + 8;
                            }
                        }
                    }
                    delete item.style;
                    return <div key={this.itemIndex++} style={style} {...item}>{item.label}</div>;
                }
                if (item.type !== 'row') {
                    let itemProps = Object.assign({}, item.props || {});
                    this.mergeProps(itemProps, item, ['name', 'type', 'rules', 'messages']);
                    itemProps.key = this.itemIndex++;
                    let initData = this.state.initData;
                    let val = initData[item.name];
                    if (typeof itemProps.value === 'function') {
                        val = itemProps.value(initData);
                    }
                    itemProps.value = val === undefined ? itemProps.value : val;
                    itemProps.value = (itemProps.value === undefined || itemProps.value === null)
                        ? undefined
                        : itemProps.value + '';
                    return <FormControl {...itemProps} label={item.label} onChange={this.onChange.bind(this, item)} />;
                } else {
                    return this.renderFormRow(item);
                }
            });
        }
        return null;
    }

    /**
     *
     * @param item
     */
    renderFormRow(item){
        let items = this.renderItems(item.children);
        return <Form.Row {...item.props} key={this.itemIndex++}>
            {items}
        </Form.Row>;
    }

    /**
     * 获取表单
     */
    getForm(){
        return this.refs.form;
    }

    /**
     * 获取表单的元素
     */
    getFormItems(){
        this.refs.form.getItems();
    }

    /**
     * 是否验证通过
     * @returns {*|boolean}
     */
    isValid(){
        return this.refs.form.isValid();
    }

    /**
     * 获取表单数据
     * @returns {{}}
     */
    getFormData(){
        return this.refs.form.getFormParams();
    }

    /**
     * 设置表单的初始值
     * @param data
     */
    setFormData(data){
        this.setState({initData: data});
    }

    /**
     * 根据name获取FormControl
     * @param name
     * @returns {*}
     */
    getFormControl(name){
        return this.refs.form.getFormControl(name);
    }

    /**
     * formControl中的元素
     * @param name
     * @returns {*|Object}
     */
    getItem(name){
        return this.refs.form.getItem(name);
    }

    render(){
        let formData = this.state.data;
        let formProps = Object.assign({}, formData.props || {});
        this.mergeProps(formProps, formData, ['action', 'method', 'encType']);
        return <Form ref='form' {...formProps}>
            {this.renderItems(formData.items)}
        </Form>;
    }
}

export default SimpleForm;
