/**
 * @author cqb 2016-04-26.
 * @module Input
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';
import filterProps from 'react-valid-props';
import Regs from '../utils/regs';
import FormControl from '../FormControl/index';
import './Input.less';

/**
 * Input 类
 * @class Input
 * @constructor
 * @extend BaseComponent
 */
class Input extends BaseComponent {
    static displayName = 'Input';

    state = {
        _value: this.props.value || ''
    };

    static defaultProps = {
        trigger: 'blur',
        value: '',
        type: 'text'
    };

    static propTypes = {
        /**
         * 值
         * @attribute value
         * @type {String}
         */
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
         * 类型
         * @attribute type
         * @type {String}
         */
        type: PropTypes.string,
        /**
         * 触发类型
         * @attribute trigger
         * @type {String}
         */
        trigger: PropTypes.string,
        /**
         * 值改变回调
         * @attribute onChange
         * @type {Function}
         */
        onChange: PropTypes.func
    };

    onChange = (event) => {
        const { readOnly, type, trigger } = this.props;

        if (readOnly) {
            return;
        }

        let value = event.target.value;

        if (value && (type === 'integer' || type === 'number')) {
            if (!Regs[type].test(value)) {
                value = this.state.value || '';
            }
        }

        if (trigger === event.type) {
            if (this.props.onChange) {
                this.props.onChange(value, event);
            }
            if (trigger === 'blur') {
                if (this.props.onBlur) {
                    this.props.onBlur(value, event);
                    this.emit('blur', value, event);
                }
            }
            this.emit('change', value, event);
        }

        this.setState({
            _value: value
        });
    }

    onKeyPress = (e) => {
        const {onPressEnter} = this.props;
        if (e.key === 'Enter' && onPressEnter) {
            onPressEnter(e);
        }
    }

    /**
     * 获取值
     * @return {[type]} [description]
     */
    getValue () {
        return this.input.value;
    }

    setValue (value) {
        this.setState({_value: value});
    }

    focus () {
        this.input.focus();
    }

    blur () {
        this.input.blur();
    }

    /**
     * 获取名称
     * @return {[type]} [description]
     */
    getName () {
        return this.props.name;
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.value && nextProps.value !== this.state._value) {
            this.setState({_value: nextProps.value});
        }
    }

    render () {
        const {className, type} = this.props;

        const props = {
            className: classNames(
                className,
                'cm-form-control',
                {
                    'cm-form-control-disabled': this.props.disabled
                }
            ),
            onChange: this.onChange,
            type: (type === 'password' || type === 'hidden') ? type : 'text',
            value: this.state._value,
            onKeyPress: this.onKeyPress
        };

        props.onBlur = this.onChange;

        const others = filterProps(this.props);
        delete others['data-valueType'];

        return (<input ref={(f) => this.input = f} {...others} {...props} />);
    }
}

FormControl.register(Input, ['text']);

export default Input;
