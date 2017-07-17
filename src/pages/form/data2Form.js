import React from 'react';
import classNames from 'classnames';
import {FormControl, Form, FontIcon, Button} from '../../components';

class Data2Form extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            data: props.data || {},
            initData: props.initData || {}
        };

        this.itemIndex = 0;
        this.selectedItem = null;
    }

    /**
     *
     * @param target
     * @param source
     * @param props
     */
    mergeProps(target, source, props){
        if (props){
            props.forEach(function(prop){
                if (source[prop] !== undefined){
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

        if (this.props.onChange){
            this.props.onChange(item, value, selectItem);
        }

        this.emit('change', item, value, selectItem);
    }

    onClick(item){
        if (this.selectedItem){
            this.selectedItem.unSelect();
        }
        this.selectedItem = item;

        if (this.props.onClick){
            this.props.onClick(item);
        }
    }

    onSelect(item){
        if (this.props.onSelect){
            this.props.onSelect(item);
        }
    }

    onRemove(formItem, item, items){
        if (this.props.onRemove){
            this.props.onRemove(formItem, item, items);
        }
        this.setState({
            data: this.state.data
        });
    }

    onSort(){
        if (this.props.onSort){
            this.props.onSort();
        }
        this.setState({
            data: this.state.data
        });
    }

    /**
     *
     * @param items
     */
    renderItems(items){
        if (items){
            return items.map((item)=>{
                return <FormItem
                    onClick={this.onClick.bind(this)}
                    onRemove={this.onRemove.bind(this)}
                    onSort={this.onSort.bind(this)}
                    items={items}
                    item={item}
                    key={item.identify}
                    form={this} />;
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

class FormItem extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            item: props.item,
            active: false
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

    select(){
        this.setState({active: true});
        this.props.form.onSelect(this.state.item);
    }

    unSelect(){
        this.setState({active: false});
    }

    onClick(e){
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onClick){
            this.props.onClick(this);
        }

        if (this.state.item.type === 'row'){
            this.select();
        }
    }

    removeItem(e){
        e.preventDefault();
        e.stopPropagation();
        if (this.props.items){
            let index = this.props.items.indexOf(this.state.item);
            this.props.items.splice(index, 1);

            if (this.props.onRemove){
                this.props.onRemove(this, this.state.item, this.props.items);
            }
        }
    }

    sortItem(e){
        e.preventDefault();
        e.stopPropagation();
        if (this.props.items){
            let index = this.props.items.indexOf(this.state.item);
            if (index === 0){
                return;
            }
            let temp = this.props.items[index];
            this.props.items[index] = this.props.items[index - 1];
            this.props.items[index - 1] = temp;

            if (this.props.onSort){
                this.props.onSort(this);
            }
        }
    }

    /**
     *
     * @param target
     * @param source
     * @param props
     */
    mergeProps(target, source, props){
        if (props){
            props.forEach(function(prop){
                if (source[prop] !== undefined){
                    target[prop] = source[prop];
                }
            });
        }
    }

    /**
     * 渲染组件
     * @param  {[type]} itemProps [description]
     * @return {[type]}           [description]
     */
    renderItem(itemProps){
        if (itemProps.type === 'button'){
            return <Button {...itemProps}>{itemProps.label}</Button>;
        } else if (itemProps.type === 'label'){
            return <span {...itemProps}>{itemProps.label}</span>;
        } else if (itemProps.type === 'promote'){
            return <div {...itemProps}>{itemProps.label}</div>;
        } else {
            return <FormControl {...itemProps} label={itemProps.label} />;
        }
    }

    render(){
        let item = this.state.item;
        if (item.type !== 'row'){
            let itemProps = Object.assign({}, item.props || {});
            itemProps = Object.assign(itemProps, item);
            // this.mergeProps(itemProps, item, ['name','type','rules','messages','placeholder','data']);
            for (let key in itemProps){
                if (itemProps[key] === ''){
                    delete itemProps[key];
                }
            }
            let className = classNames('form-item', {
                block: item.block
            });
            return <div onClick={this.onClick.bind(this)} className={className}>
                <div className='form-tools'>
                    <FontIcon icon='level-up' onClick={this.sortItem.bind(this)} className='mr-5' />
                    <FontIcon icon='trash' onClick={this.removeItem.bind(this)} />
                </div>
                {this.renderItem(itemProps)}
            </div>;
        } else {
            let items = this.props.form.renderItems(item.children);
            let itemProps = Object.assign({}, item.props || {});
            itemProps = Object.assign(itemProps, item);
            for (let key in itemProps){
                if (itemProps[key] === ''){
                    delete itemProps[key];
                }
            }
            let className = classNames('form-item-row', {
                active: this.state.active
            });
            return (
                <div onClick={this.onClick.bind(this)} className={className}>
                    <div className='form-tools'>
                        <FontIcon icon='level-up' onClick={this.sortItem.bind(this)} className='mr-5' />
                        <FontIcon icon='trash' onClick={this.removeItem.bind(this)} />
                    </div>
                    <Form.Row {...itemProps} key={item.name}>
                        {items}
                    </Form.Row>
                </div>
            );
        }
    }
}

export default Data2Form;
