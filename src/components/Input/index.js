/**
 * @author cqb 2016-04-26.
 * @module Input
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';
import grids from '../utils/grids';
const getGrid = grids.getGrid;
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
    static displayName = "Input";
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
        value: PropTypes.string,
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

    constructor(props) {
        super(props);

        this.addState({
            value: props.value
        });
    }

    componentWillReceiveProps (nextProps) {
        let value = nextProps.value;
        if (value !== this.props.value && value !== this.state.value) {
            this.setState({ value });
        }
    }

    handleChange(event){
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

        this.setState({ value });

        if (trigger === 'change') {
            this.handleTrigger(event);
        }
    }

    handleTrigger(event){
        let value = event.target.value;
        if(this.props.onChange){
            this.props.onChange(value, event);
        }
        this.emit('change');
    }

    onBlur = (event)=>{
        this.handleChange(event);
        let value = event.target.value;
        if(this.props.onChange){
            this.props.onChange(value, event);
        }
        this.emit('change', value, event);
    }

    /**
     * 获取值
     * @return {[type]} [description]
     */
    getValue(){
        return this.state.value;
    }

    /**
     * 设置值
     * @param {[type]} value [description]
     */
    setValue(value){
        this.setState({ value });
    }

    /**
     * 获取名称
     * @return {[type]} [description]
     */
    getName(){
        return this.props.name;
    }

    render () {
        const {className, grid, type, trigger} = this.props;
        let handleChange = this.props['handleChange']
            ? (event)=>{ this.props['handleChange'](event, {component: this}); }
            : this.handleChange.bind(this);
        const props = {
            className: classNames(
                className,
                'cm-form-control',
                getGrid(grid)
            ),
            onChange: handleChange,
            type: (type === 'password' || type === 'hidden') ? type : 'text',
            value: this.state.value
        };

        if (trigger && trigger === 'blur') {
            let handle = 'on' + trigger.charAt(0).toUpperCase() + trigger.slice(1);
            props[handle] = this.onBlur;
        }

        let others = filterProps(this.props);
        delete others['data-valueType'];

        return (<input {...others} {...props} />);
    }
}

FormControl.register(Input, ['text']);

export default Input;
