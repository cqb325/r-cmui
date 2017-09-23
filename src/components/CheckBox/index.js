/**
 * @author cqb 2016-04-26.
 * @module CheckBox
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';
import './CheckBox.less';

/**
 * CheckBox 类
 * @class CheckBox
 * @constructor
 * @extend BaseComponent
 */
class CheckBox extends BaseComponent {
    static displayName = "CheckBox";

    static propTypes = {
        /**
         * 默认值
         * @attribute value
         * @type {String}
         */
        value: PropTypes.any,
        /**
         * 组件类型
         * @attribute type
         * @type {String}
         * @default checkbox
         */
        type: PropTypes.string,
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
         * 显示的label
         * @attribute label
         * @type {String}
         */
        label: PropTypes.any,
        /**
         * 值变化回调
         * @attribute onChange
         * @type {Function}
         */
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: null,
        checked: false,
        type: 'checkbox'
    };

    constructor(props) {
        super(props);

        this.addState({
            value: props.value,
            checked: props.checked
        });
    }

    /**
     * 值变化回调
     * @method handleChange
     * @param event {Event} 事件对象
     */
    handleChange = (event)=>{
        let disabled = this.state.disabled;

        if (disabled) {
            return;
        }

        if (this.props.type == 'radio' && this.state.checked) {
            return;
        }

        let checked = !this.state.checked;
        this.setState({ checked: checked }, ()=>{
            this.handleTrigger(checked, event);
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.checked != this.state.checked && nextProps.checked != this.props.checked) {
            this.setState({
                checked: nextProps.checked
            });
        }
    }

    componentWillUnmount(){
        if(this.props.unbind){
            this.props.unbind(this);
        }
    }

    /**
     * 处理值变化
     * @method handleTrigger
     * @param checked {Boolean} 是否选中
     * @param event {Event} 事件对象
     */
    handleTrigger(checked, event){
        let value = this.state.value;
        if (this.props.onChange) {
            this.props.onChange(value, checked, event, this.props.item);
        }

        this.emit('change');
    }

    /**
     * 更新状态
     * @method updateState
     * @param state {Object} state对象
     */
    updateState(state){
        if (this.state.disabled) {
            return;
        }
        this.setState(state);
    }

    /**
     * 获取当前的值
     * @return {[type]} [description]
     */
    getValue(){
        return this.state.value;
    }

    /**
     * 是否选中
     * @return {Boolean} [description]
     */
    isChecked(){
        return this.state.checked;
    }

    /**
     * 设置选中状态
     * @param {[type]} checked [description]
     */
    setChecked(checked, cb){
        this.setState({checked}, cb);
    }

    /**
     * 是否禁用
     * @returns 
     * @memberof CheckBox
     */
    isDisabled(){
        return this.state.disabled;
    }

    render () {
        let {className, name, type, item, itemClass} = this.props;
        className = classNames(
            className,
            'cm-checkbox',
            {
                active: this.state.checked,
                disabled: this.state.disabled
            }
        );

        if (item) {
            item._node = this;
        }

        return (
            <span className={className} onClick={this.handleChange}>
                <input ref='input'
                    checked={this.props.checked}
                    type={type}
                    name={name}
                    className={itemClass}
                    defaultValue={this.state.value}
                    style={{display: 'none'}}
                    onChange={()=>{}}
                />
                <span style={{position: 'relative'}}>
                    <span className='cm-checkbox-icon' />
                </span>
                <label>{this.props.label}</label>
            </span>
        );
    }
}

export default CheckBox;
