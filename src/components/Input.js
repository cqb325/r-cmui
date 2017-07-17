/**
 * @author cqb 2016-04-26.
 * @module Input
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import grids from './utils/grids';
const getGrid = grids.getGrid;
import Omit from './utils/omit';
import Regs from './utils/regs';
import FormControl from './FormControl';

/**
 * Input 类
 * @class Input
 * @constructor
 * @extend BaseComponent
 */
class Input extends BaseComponent {
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
        this.props.onChange(value, event);
        this.emit('change');
    }

    getValue(){
        return this.state.value;
    }

    setValue(value){
        this.setState({ value });
    }

    render () {
        const {className, grid, type, trigger} = this.props;
        const others = Omit(this.props,
            ['className', 'handleChange', 'data-valueType', 'data-itemBind', 'grid', 'type', 'trigger']);
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

        if (trigger && trigger !== 'change') {
            let handle = 'on' + trigger.charAt(0).toUpperCase() + trigger.slice(1);
            props[handle] = handleChange;
        }

        return (<input {...others} {...props} />);
    }
}

Input.defaultProps = {
    trigger: 'blur',
    value: ''
};

FormControl.register(Input, ['text']);

export default Input;
