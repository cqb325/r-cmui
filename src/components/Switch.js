/**
 * @author cqb 2017-01-05.
 * @module Switch
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import Dom from './utils/Dom';
import FontIcon from './FontIcon';
import FormControl from './FormControl';

/**
 * Switch 类
 * @class Switch
 * @constructor
 * @extend BaseComponent
 */
class Switch extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            checked: props.checked,
            disabled: props.disabled || false
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.checked !== this.state.checked){
            this.setState({
                checked: nextProps.checked
            })
        }
    }

    componentDidMount(){

    }

    toggleSwitch(){
        if(this.state.disabled){
            return;
        }
        this.setState({
            checked: !this.state.checked
        });

        let value = this.state.checked ? 1 : 0;
        if(this.props.onChange){
            this.props.onChange(value);
        }
        this.emit("change", value);
    }

    render(){
        let {className, style} = this.props;
        className = classNames("cm-switch", className, this.props.size, {
            checked: this.state.checked,
            disabled: this.state.disabled
        });

        let text = this.state.checked ? this.props.checkedText : this.props.unCheckedText;

        return (
            <span className={className} style={style} tabIndex="0" onClick={this.toggleSwitch.bind(this)}>
                <span className="cm-switch-inner">{text}</span>
                <input name={this.props.name} type="hidden" value={this.state.checked ? 1 : 0}/>
            </span>
        );
    }
}

FormControl.register(Switch, "switch");

export default Switch;