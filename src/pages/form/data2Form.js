import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {FormControl,Form} from '../../components';
import PropTypes from 'prop-types';

class Data2Form extends React.Component{

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
        if(props){
            props.forEach(function(prop){
                if(source[prop] != undefined){
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

        if(this.props.onChange){
            this.props.onChange(item, value, selectItem);
        }

        this.emit("change", item, value, selectItem);
    }

    onClick(item){
        if(this.props.onClick){
            this.props.onClick(item);
        }
    }

    /**
     *
     * @param items
     */
    renderItems(items){
        if(items){
            return items.map((item)=>{
                return <FormItem onClick={this.onClick.bind(this)} item={item} key={this.itemIndex++} form={this}></FormItem>;
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
        </Form.Row>
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
        let formProps = Object.assign({}, formData.props||{});
        this.mergeProps(formProps, formData, ["action","method","encType"]);
        return <Form ref="form" {...formProps}>
            {this.renderItems(formData.items)}
        </Form>
    }
}

class FormItem extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            item: props.item
        };
    }

    getType() {
        return this.state.item.type;
    }

    update(item){
        this.setState({item});
    }

    getName(){
        return this.state.item.name;
    }

    getIdentify(){
        return this.state.item.identify;
    }

    onClick(){
        if(this.props.onClick){
            this.props.onClick(this);
        }
    }

    /**
     *
     * @param target
     * @param source
     * @param props
     */
    mergeProps(target, source, props){
        if(props){
            props.forEach(function(prop){
                if(source[prop] != undefined){
                    target[prop] = source[prop];
                }
            });
        }
    }

    render(){
        let item = this.state.item;
        if(item.type === "label"){
            return <span style={item.style} {...item.props}>{item.label}</span>
        }
        if(item.type !== "row"){
            let itemProps = Object.assign({}, item.props||{});
            this.mergeProps(itemProps, item, ["name","type","rules","messages","placeholder"]);
            console.log(itemProps);
            return <div onClick={this.onClick.bind(this)}><FormControl {...itemProps} label={item.label}/></div>
        }
        return <span></span>;
    }
}

export default Data2Form;
