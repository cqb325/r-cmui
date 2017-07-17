/**
 * @author cqb 2017-05-18.
 * @module InputNumber
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import Button from './Button';
import FormControl from './FormControl';


/**
 * InputNumber 类
 * @class InputNumber
 * @constructor
 * @extend BaseComponent
 */
class InputNumber extends BaseComponent {
    constructor(props){
        super(props);

        let value = parseFloat(props.value || 0);
        if (props.min !== undefined) {
            value = Math.max(props.min, value);
        }
        if (props.max !== undefined) {
            value = Math.min(props.max, value);
        }
        this.addState({
            value: value || 0,
            min: props.min,
            max: props.max,
            step: parseFloat(props.step) || 1,
            disabled: props.disabled || false
        });
    }


    handleChange(event){
        const {disabled} = this.props;

        if (disabled) {
            return;
        }

        let value = this.parser(event.target.value);
        if (this.state.min !== undefined) {
            value = Math.max(this.state.min, value);
        }
        if (this.state.max !== undefined) {
            value = Math.min(this.state.max, value);
        }

        this.setState({ value });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.emit('change', value);
    }

    /**
     * 减少
     * @return {[type]} [description]
     */
    subtract(){
        let value = this.add(this.parser(this.state.value + ''), -this.state.step);
        if (this.state.min !== undefined) {
            value = Math.max(this.state.min, value);
        }
        this.setState({value});
    }

    /**
     * 增加
     * @return {[type]} [description]
     */
    plus(){
        let value = this.add(this.parser(this.state.value + ''), this.state.step);
        if (this.state.max !== undefined) {
            value = Math.min(this.state.max, value);
        }
        this.setState({value});
    }

    /**
     * 格式化
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    formatter(value){
        if (this.props.formatter) {
            return this.props.formatter(value + '');
        }
        return value;
    }

    /**
     * 格式化反义
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    parser(value){
        if (this.props.parser) {
            return this.props.parser(value);
        }
        return value;
    }

    /**
     * 解决数字浮点型双精度问题
     * @param {[type]} num1 [description]
     * @param {[type]} num2 [description]
     */
    add(num1, num2){
        let r1;
        let r2;
        let m;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (num1 * m + num2 * m) / m;
    }

    /**
     * 禁用
     * @return {[type]} [description]
     */
    disable(){
        this.setState({disabled: true});
    }

    /**
     * 激活
     * @return {[type]} [description]
     */
    enable(){
        this.setState({disabled: false});
    }

    /**
     * 获取值
     * @return {[type]} [description]
     */
    getValue(){
        return this.state.value;
    }

    /**
     * 获取格式化值
     * @return {[type]} [description]
     */
    getFormatedValue(){
        return this.formatter(this.state.value);
    }

    /**
     * 设置值
     * @param {[type]} value [description]
     */
    setValue(value){
        if (this.state.min != undefined) {
            value = Math.max(this.state.min, value);
        }
        if (this.state.max != undefined) {
            value = Math.min(this.state.max, value);
        }
        this.setState(value);
    }

    /**
     * 设置最大值
     * @param {[type]} max [description]
     */
    setMax(max){
        max = parseFloat(max);
        if (this.state.min !== undefined) {
            if (this.state.min > max) {
                console.warn(`max ${max} is < min ${this.state.min}`);
                return;
            }
        }
        let params = {
            max: max
        };
        if (this.state.value > max) {
            params.value = max;
        }
        this.setState(params);
    }

    /**
     * 设置步长
     * @param {[type]} step [description]
     */
    setStep(step){
        this.setState({step});
    }

    /**
     * 设置最小值
     * @param {[type]} min [description]
     */
    setMin(min){
        min = parseFloat(min);
        if (this.state.max !== undefined) {
            if (this.state.max < min) {
                console.warn(`max ${this.state.max} is < min ${min}`);
                return;
            }
        }
        let params = {
            min: min
        };
        if (this.state.value < min) {
            params.value = min;
        }
        this.setState(params);
    }

    render(){
        let {className, style, itemClassName} = this.props;
        className = classNames('cm-input-number', className, this.state.theme, {
            'cm-input-number-disabled': this.state.disabled,
            [`cm-input-number-${this.props.size}`]: this.props.size
        });
        itemClassName = classNames('cm-input-number-field', itemClassName, {
            'cm-input-number-readonly': this.state.readOnly
        });
        return (
            <span className={className} style={style}>
                <Button onClick={this.subtract.bind(this)}>-</Button>
                <input className={itemClassName} name={this.props.name} value={this.formatter(this.state.value)}
                    type='text' onChange={this.handleChange.bind(this)} />
                <Button onClick={this.plus.bind(this)}>+</Button>
            </span>
        );
    }
}

FormControl.register(InputNumber, 'inputnumber');

export default InputNumber;
