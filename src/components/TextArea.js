/**
 * @author cqb 2016-04-26.
 * @module TextArea
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import grids from './utils/grids';
import Omit from './utils/omit';
import Dom from './utils/Dom';
import FormControl from './FormControl';
const getGrid = grids.getGrid;


/**
 * TextArea 类
 * @class TextArea
 * @constructor
 * @extend BaseComponent
 */
class TextArea extends BaseComponent {
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
        this.props.autoHeight && this.autoHeight(event);

        const { readOnly, trigger } = this.props;

        if (readOnly) {
            return;
        }

        let value = event.target.value;

        this.setState({ value });

        if (trigger === 'change') {
            this.handleTrigger(event);
        }
    }

    autoHeight(event){
        let ele = event.target;
        if (!this.initHeight) {
            this.initHeight = ele.clientHeight;
        }
        if (ele.scrollHeight > this.initHeight) {
            ele.style.height = 'auto';
            ele.style.overflowY = 'hidden';
            ele.scrollTop = 0; // 防抖动
            let pd = this.getPadding(ele);
            ele.style.height = (ele.scrollHeight + pd) + 'px';
        }
    }

    getPadding(ele){
        let pdTop = parseFloat(Dom.css(ele, 'paddingTop'));
        let pdBottom = parseFloat(Dom.css(ele, 'paddingBottom'));
        let bdTop = parseFloat(Dom.css(ele, 'borderTopWidth'));
        let bdBottom = parseFloat(Dom.css(ele, 'borderBottomWidth'));

        return pdTop + pdBottom + bdTop + bdBottom;
    }

    handleTrigger(event){
        let value = event.target.value;
        if (this.props.onChange) {
            this.props.onChange(value, event);
        }
        this.emit('change', value);
    }

    getValue(){
        return this.state.value;
    }

    setValue(value){
        this.setState({ value });
    }

    render () {
        let {className, grid, trigger, style, height} = this.props;
        const others = Omit(this.props, ['className', 'handleChange', 'data-valueType',
            'data-itemBind', 'grid', 'type', 'trigger', 'style', 'autoHeight']);
        let handleChange = this.props.handleChange
            ? (event)=>{ this.props.handleChange(event, {component: this}); }
            : this.handleChange.bind(this);
        style = style || {};
        if (height !== undefined && height !== null) {
            style['height'] = height;
        }
        const props = {
            className: classNames(
                className,
                'cm-form-control',
                getGrid(grid)
            ),
            onChange: handleChange,
            style
        };

        if (trigger && trigger !== 'change') {
            let handle = 'on' + trigger.charAt(0).toUpperCase() + trigger.slice(1);
            props[handle] = handleChange;
        }

        return (<textarea {...others} {...props} value={this.state.value} />);
    }
}


FormControl.register(TextArea, ['textarea']);

TextArea.propTypes = {
    /**
     * 默认选中的值
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
     * 禁用
     * @attribute disabled
     * @type {Boolean}
     */
    disabled: PropTypes.bool,
    /**
     * 只读
     * @attribute readOnly
     * @type {Boolean}
     */
    readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * 自适应高度
     * @attribute autoHeight
     * @type {Boolean}
     */
    autoHeight: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * 高度
     * @attribute height
     * @type {String}
     */
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

TextArea.defaultProps = {
    trigger: 'blur',
    value: ''
};

export default TextArea;
