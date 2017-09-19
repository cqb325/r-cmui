/**
 * @author cqb 2016-04-26.
 * @module TextArea
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import grids from '../utils/grids';
import filterProps from 'react-valid-props';
import Dom from '../utils/Dom';
// import FormControl from './FormControl';
const getGrid = grids.getGrid;
import './TextArea.less';


/**
 * TextArea 类
 * @class TextArea
 * @constructor
 * @extend BaseComponent
 */
class TextArea extends BaseComponent {
    static displayName = "TextArea";

    static defaultProps = {
        value: '',
        autoHeight: false,
        height: null,
        trigger: 'blur'
    };

    static propTypes = {
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

    constructor(props) {
        super(props);

        this.addState({
            value: props.value
        });
    }

    componentWillReceiveProps (nextProps) {
        let value = nextProps.value;
        if (value !== this.state.value) {
            this.setState({ value });
        }
    }

    /**
     *
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    handleChange = (event)=>{
        this.props.autoHeight && this.autoHeight(event);

        const { trigger } = this.props;

        if (this.state.disabled) {
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
        let {className, grid, trigger, style, height, width} = this.props;
        let handleChange = this.props.handleChange
            ? (event)=>{ this.props.handleChange(event, {component: this}); }
            : this.handleChange.bind(this);
        style = style || {};
        if (height !== undefined && height !== null) {
            style['height'] = height;
        }
        if (width !== undefined && width !== null) {
            style['width'] = width;
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

        return (<textarea {...filterProps(this.props)} {...props} value={this.state.value} />);
    }
}


// FormControl.register(TextArea, ['textarea']);

export default TextArea;
