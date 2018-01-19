/**
 * @author cqb 2016-04-26.
 * @module TextArea
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import filterProps from 'react-valid-props';
import Dom from '../utils/Dom';
import FormControl from '../FormControl/index';
import './TextArea.less';


/**
 * TextArea 类
 * @class TextArea
 * @constructor
 * @extend BaseComponent
 */
class TextArea extends BaseComponent {
    static displayName = 'TextArea';

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
        value: PropTypes.any,
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

    state = {
        _value: this.props.value || ''
    };

    componentWillReceiveProps (nextProps) {
        const value = nextProps.value;
        if (value !== this.props.value && value !== this.state._value) {
            this.setState({ _value: value });
        }
    }

    /**
     *
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    onChange = (event) => {
        this.props.autoHeight && this.autoHeight(event);

        const { trigger } = this.props;

        if (this.state.disabled) {
            return;
        }

        const value = event.target.value;
        

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

        this.setState({_value: value});
    }

    autoHeight (event) {
        const ele = event.target;
        if (!this.initHeight) {
            this.initHeight = ele.clientHeight;
        }
        if (ele.scrollHeight > this.initHeight) {
            ele.style.height = 'auto';
            ele.style.overflowY = 'hidden';
            ele.scrollTop = 0; // 防抖动
            const pd = this.getPadding(ele);
            ele.style.height = `${ele.scrollHeight + pd}px`;
        }
    }

    getPadding (ele) {
        const pdTop = parseFloat(Dom.css(ele, 'paddingTop'));
        const pdBottom = parseFloat(Dom.css(ele, 'paddingBottom'));
        const bdTop = parseFloat(Dom.css(ele, 'borderTopWidth'));
        const bdBottom = parseFloat(Dom.css(ele, 'borderBottomWidth'));

        return pdTop + pdBottom + bdTop + bdBottom;
    }

    getValue () {
        return this.widget.value;
    }

    setValue (value) {
        this.setState({ _value: value });
    }

    getName () {
        return this.props.name;
    }

    render () {
        let {className, style, height, width} = this.props;

        const clazzName = classNames(
            className,
            'cm-input',
            {
                'cm-input-disabled': this.props.disabled
            }
        );

        style = Object.assign({}, style || {});
        if (height !== undefined && height !== null) {
            style['height'] = height;
        }
        if (width !== undefined && width !== null) {
            style['width'] = width;
        }

        const props = {
            className: clazzName,
            onChange: this.onChange,
            style
        };

        props.onBlur = this.onChange;

        const others = filterProps(this.props);
        delete others['data-valueType'];

        return (<textarea ref={(f) => this.widget = f} {...others} {...props} value={this.state._value} />);
    }
}


FormControl.register(TextArea, ['textarea']);

export default TextArea;
