/**
 * @author cqb 2016-04-05.
 * @module Spinner
 */

import React from 'react';
import BaseComponent from '../core/BaseComponent';
import moment from 'moment';
import classNames from 'classnames';
import Input from '../Input/index';
import './Spinner.less';

/**
 * Spinner
 * @class Spinner
 * @extends {BaseComponent}
 */
class Spinner extends BaseComponent{
    static displayName = 'Spinner';

    static defaultProps = {
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        size: 'default',
        loop: false
    };

    constructor(props){
        super(props);
        this.addState({
            value: props.value
        });
    }

    /**
     * 增加
     * @memberof Spinner
     */
    plus = ()=>{
        let value = this.add(this.state.value, this.props.step);
        if(this.props.loop && value > this.props.max){
            let off = value - this.props.max;
            value = this.props.min + off - 1;
        }
        value = Math.min(this.props.max, value);
        this.setState({value});

        if(this.props.onChange){
            this.props.onChange(value);
        }
    }

    /**
     * 减少
     * @memberof Spinner
     */
    sub = ()=>{
        let value = this.add(this.state.value, -this.props.step);
        if(this.props.loop && value < this.props.min){
            let off = value - this.props.min;
            value = this.props.max + off + 1;
        }
        value = Math.max(this.props.min, value);
        this.setState({value});

        if(this.props.onChange){
            this.props.onChange(value);
        }
    }

    /**
     * 设置值
     * @param {any} v 
     * @memberof Spinner
     */
    setValue(v){
        v = Math.min(v, this.props.max);
        v = Math.max(v, this.props.min);
        this.setState({value: v});
    }

    /**
     * 获取值
     * @returns 
     * @memberof Spinner
     */
    getValue(){
        return this.state.value;
    }

    inputChange = (value)=>{
        value = Math.min(value, this.props.max);
        value = Math.max(value, this.props.min);
        this.setState({value});
        if(this.props.onChange){
            this.props.onChange(value);
        }
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

    render(){
        let {className} = this.props;
        className = classNames('cm-spinner', {
            [`cm-spinner-${this.props.size}`]: this.props.size
        });
        return (
            <div className={className}>
                <span className='cm-spinner-value'>
                    <Input name={this.props.name} value={this.state.value + ''} onChange={this.inputChange} />
                </span>
                <span className='cm-spinner-plus' onClick={this.plus}>
                    <i className='fa fa-angle-up' />
                </span>
                <span className='cm-spinner-subs' onClick={this.sub}>
                    <i className='fa fa-angle-down' />
                </span>
            </div>
        );
    }
}

export default Spinner;