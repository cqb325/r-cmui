/**
 * @author cqb 2017-01-05.
 * @module Switch
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import FormControl from '../FormControl/index';
import './Switch.less';

/**
 * Switch 类
 * @class Switch
 * @constructor
 * @extend BaseComponent
 */
class Switch extends BaseComponent {
    static displayName = 'Switch';

    static defaultProps = {
        value: false,
        checkedText: '',
        unCheckedText: ''
    };

    constructor (props) {
        super(props);

        this.addState({
            value: props.value
        });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    /**
     * switch change回调
     * @return {[type]} [description]
     */
    toggleSwitch = () => {
        if (this.state.disabled) {
            return;
        }
        this.setState({
            value: !this.state.value
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.value);
            }
            this.emit('change', this.state.value);
        });
    }

    /**
     * 获取值
     * @return {[type]} [description]
     */
    getValue () {
        return this.state.value;
    }

    /**
     * 设置值
     * @param {[type]} checked [description]
     */
    setValue (checked) {
        if (this.state.disabled) {
            return;
        }
        this.setState({
            value: checked
        });
    }

    render () {
        let {className, style, checkedText, unCheckedText, size, name} = this.props;
        className = classNames('cm-switch', className, {
            [`cm-switch-${size}`]: size,
            'cm-switch-checked': this.state.value,
            'cm-switch-disabled': this.state.disabled
        });

        const text = this.state.value ? checkedText : unCheckedText;

        return (
            <span className={className} style={style} tabIndex='0' onClick={this.toggleSwitch}>
                <span className='cm-switch-inner'>{text}</span>
                <input name={name} type='hidden' value={this.state.value ? 1 : 0} />
            </span>
        );
    }
}

FormControl.register(Switch, 'switch');

export default Switch;
