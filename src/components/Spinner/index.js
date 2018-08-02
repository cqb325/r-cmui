/**
 * @author cqb 2016-04-05.
 * @module Spinner
 */

import React from 'react';
import BaseComponent from '../core/BaseComponent';
import classNames from 'classnames';
import Input from '../Input/index';
import FormControl from '../FormControl/index';
import './Spinner.less';

/**
 * Spinner
 * @class Spinner
 * @extends {BaseComponent}
 */
class Spinner extends BaseComponent {
    static displayName = 'Spinner';

    static defaultProps = {
        value: 0,
        step: 1,
        size: 'default',
        loop: false
    };

    constructor (props) {
        super(props);
        let defaultValue = props.value;
        if (props.min) {
            defaultValue = Math.max(defaultValue, props.min);
        }
        if (props.max) {
            defaultValue = Math.min(defaultValue, props.max);
        }
        this.addState({
            value: defaultValue
        });
    }

    /**
     * 增加
     * @memberof Spinner
     */
    plus = () => {
        let value = this.add(this.state.value, this.props.step);
        if (this.props.loop && this.props.max !== undefined && this.props.min !== undefined && value > this.props.max) {
            const off = value - this.props.max;
            value = this.props.min + off - 1;
        }

        if (this.props.max !== undefined) {
            value = Math.min(this.props.max, value);
        }
        
        this.setState({value});

        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.emit('change', value);

        if (this.props.onPlus) {
            this.props.onPlus(value, this.props.step);
        }
        this.emit('plus', this.props.step);
    }

    /**
     * 减少
     * @memberof Spinner
     */
    sub = () => {
        let value = this.add(this.state.value, -this.props.step);
        if (this.props.loop && this.props.max !== undefined && this.props.min !== undefined && value < this.props.min) {
            const off = value - this.props.min;
            value = this.props.max + off + 1;
        }
        if (this.props.min !== undefined) {
            value = Math.max(this.props.min, value);
        }
        
        this.setState({value});

        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.emit('change', value);

        if (this.props.onSub) {
            this.props.onSub(value, this.props.step);
        }
        this.emit('sub', this.props.step);
    }

    /**
     * 设置值
     * @param {any} v 
     * @memberof Spinner
     */
    setValue (v) {
        v = this.props.max !== undefined ? Math.min(v, this.props.max) : v;
        v = this.props.min !== undefined ? Math.max(v, this.props.min) : v;
        this.setState({value: v});
    }

    /**
     * 获取值
     * @returns 
     * @memberof Spinner
     */
    getValue () {
        return this.state.value;
    }

    inputChange = (value) => {
        value = this.props.max !== undefined ? Math.min(value, this.props.max) : value;
        value = this.props.min !== undefined ? Math.max(value, this.props.min) : value;
        this.setState({value});
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    /**
     * 解决数字浮点型双精度问题
     * @param {[type]} num1 [description]
     * @param {[type]} num2 [description]
     */
    add (num1, num2) {
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

    onKeyDown = (e) => {
        if (e.keyCode === 38) {
            this.plus();
        }
        if (e.keyCode === 40) {
            this.sub();
        }
    }

    componentWillReceiveProps (nextProps) {
        const value = nextProps.value;
        if (value !== this.props.value && value !== this.state.value) {
            this.setValue(value);
        }
    }

    render () {
        let {className} = this.props;
        className = classNames('cm-spinner', className, {
            [`cm-spinner-${this.props.size}`]: this.props.size
        });
        return (
            <div className={className} style={this.props.style}>
                <span className='cm-spinner-value'>
                    <Input name={this.props.name} value={`${this.state.value}`} onChange={this.inputChange} onKeyDown={this.onKeyDown}/>
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

FormControl.register(Spinner, 'spinner');

export default Spinner;
