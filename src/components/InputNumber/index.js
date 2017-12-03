/**
 * @author cqb 2017-05-18.
 * @module InputNumber
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';
import Button from '../Button/index';
import FormControl from '../FormControl/index';
import './InputNumber.less';


/**
 * InputNumber 类
 * @class InputNumber
 * @constructor
 * @extend BaseComponent
 */
class InputNumber extends BaseComponent {
    static displayName = 'InputNumber';

    static defaultProps = {
        value: 0,
        min: undefined,
        max: undefined,
        step: 1
    };

    static propTypes = {
        /**
         * 值
         * @attribute value
         * @type {String}
         */
        value: PropTypes.any,
        /**
         * 自定义class
         * @attribute className
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 自定义样式
         * @attribute style
         * @type {Object}
         */
        style: PropTypes.object,
        /**
         * 值改变回调
         * @attribute onChange
         * @type {Function}
         */
        onChange: PropTypes.func,
        /**
         * 最小值
         * @attribute min
         * @type {String}
         */
        min: PropTypes.string,
        /**
         * 最大值
         * @attribute max
         * @type {String}
         */
        max: PropTypes.string,
        /**
         * 格式化
         * @attribute formatter
         * @type {Function}
         */
        formatter: PropTypes.func,
        /**
         * 解析
         * @attribute parser
         * @type {Function}
         */
        parser: PropTypes.func,
        /**
         * 尺寸
         * @attribute size
         * @type {String}
         */
        size: PropTypes.string,
        /**
         * 表单名称
         * @attribute name
         * @type {String}
         */
        name: PropTypes.string
    };

    constructor (props) {
        super(props);

        let value = parseFloat(props.value || 0);
        if (props.min !== undefined) {
            value = Math.max(props.min, value);
        }
        if (props.max !== undefined) {
            value = Math.min(props.max, value);
        }
        this.addState({
            value,
            min: props.min,
            max: props.max,
            step: parseFloat(props.step),
            focused: false
        });
    }

    handleChange = (event) => {
        const {disabled} = this.state;

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
    subtract = () => {
        let value = this.add(this.parser(`${this.state.value}`), -this.state.step);
        if (this.state.min !== undefined) {
            value = Math.max(this.state.min, value);
        }
        this.setState({value});
    }

    /**
     * 增加
     * @return {[type]} [description]
     */
    plus = () => {
        let value = this.add(this.parser(`${this.state.value}`), this.state.step);
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
    formatter (value) {
        if (this.props.formatter) {
            return this.props.formatter(`${value}`);
        }
        return value;
    }

    /**
     * 格式化反义
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    parser (value) {
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

    /**
     * 获取值
     * @return {[type]} [description]
     */
    getValue () {
        return this.state.value;
    }

    /**
     * 获取格式化值
     * @return {[type]} [description]
     */
    getFormatedValue () {
        return this.formatter(this.state.value);
    }

    /**
     * 设置值
     * @param {[type]} value [description]
     */
    setValue (value) {
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
    setMax (max) {
        max = parseFloat(max);
        if (this.state.min !== undefined) {
            if (this.state.min > max) {
                console.warn(`max ${max} is < min ${this.state.min}`);
                return;
            }
        }
        const params = {
            max
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
    setStep (step) {
        this.setState({step});
    }

    /**
     * 设置最小值
     * @param {[type]} min [description]
     */
    setMin (min) {
        min = parseFloat(min);
        if (this.state.max !== undefined) {
            if (this.state.max < min) {
                console.warn(`max ${this.state.max} is < min ${min}`);
                return;
            }
        }
        const params = {
            min
        };
        if (this.state.value < min) {
            params.value = min;
        }
        this.setState(params);
    }

    componentWillReceiveProps (nextProps) {
        const value = nextProps.value;
        const params = {};
        if (value !== this.props.value && value !== this.state.value) {
            params.value = value;
        }
        if (nextProps.disabled !== this.props.disabled && nextProps.disabled !== this.state.disabled) {
            params.disabled = nextProps.disabled;
        }

        this.setState(params);
    }

    onFocus = () => {
        this.setState({focused: true});
    }

    onBlur = () => {
        this.setState({focused: false});
    }

    onKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            this.plus();
        }
        if (e.key === 'ArrowDown') {
            this.subtract();
        }
    }
    
    render () {
        let {className, style, itemClassName} = this.props;
        className = classNames('cm-input-number', className, this.state.theme, {
            'cm-input-number-disabled': this.state.disabled,
            [`cm-input-number-${this.props.size}`]: this.props.size,
            'cm-input-number-focus': this.state.focused
        });
        itemClassName = classNames('cm-input-number-field', itemClassName, {
            'cm-input-number-readonly': this.state.readOnly
        });
        return (
            <span className={className} style={style}>
                <Button onClick={this.subtract}>-</Button>
                <input onFocus={this.onFocus} onBlur={this.onBlur} onKeyDown={this.onKeyDown}
                    className={itemClassName} name={this.props.name} value={this.formatter(this.state.value)}
                    type='text' onChange={this.handleChange} />
                <Button onClick={this.plus}>+</Button>
            </span>
        );
    }
}

FormControl.register(InputNumber, 'inputnumber');

export default InputNumber;
