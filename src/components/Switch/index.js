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
    static displayName = "Switch";

    static defaultProps = {
        checked: false,
        checkedText: '',
        unCheckedText: ''
    };

    constructor(props) {
        super(props);

        this.addState({
            checked: props.checked
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.checked !== this.props.checked && nextProps.checked !== this.state.checked) {
            this.setState({
                checked: nextProps.checked
            });
        }
    }

    /**
     * switch change回调
     * @return {[type]} [description]
     */
    toggleSwitch = ()=>{
        if (this.state.disabled) {
            return;
        }
        this.setState({
            checked: !this.state.checked
        }, ()=>{
            let value = this.state.checked ? 1 : 0;
            if (this.props.onChange) {
                this.props.onChange(value);
            }
            this.emit('change', value);
        });
    }

    /**
     * 获取值
     * @return {[type]} [description]
     */
    getValue(){
        let value = this.state.checked ? 1 : 0;
        return value;
    }

    /**
     * 设置值
     * @param {[type]} checked [description]
     */
    setValue(checked){
        if (this.state.disabled) {
            return;
        }
        this.setState({
            checked: checked
        });
    }

    render(){
        let {className, style, checkedText, unCheckedText, size, name} = this.props;
        className = classNames('cm-switch', className, {
            [`cm-switch-${size}`]: size,
            'cm-switch-checked': this.state.checked,
            'cm-switch-disabled': this.state.disabled
        });

        let text = this.state.checked ? checkedText : unCheckedText;

        return (
            <span className={className} style={style} tabIndex='0' onClick={this.toggleSwitch}>
                <span className='cm-switch-inner'>{text}</span>
                <input name={name} type='hidden' value={this.state.checked ? 1 : 0} />
            </span>
        );
    }
}

FormControl.register(Switch, 'switch');

export default Switch;
