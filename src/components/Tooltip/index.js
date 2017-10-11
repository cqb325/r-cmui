/**
 * @author cqb 2016-05-09.
 * @module Tooltip
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import InnerTrigger from '../internal/InnerTrigger';
import './Tooltip.less';


/**
 * Tooltip 类
 * @class Tooltip
 * @constructor
 * @extend BaseComponent
 */
class Tooltip extends BaseComponent {
    static displayName = 'Tooltip';

    static defaultProps = {
        delay: 0,
        trigger: 'hover',
        theme: 'black'
    };

    static propTypes = {
        /**
         * 显示的内容
         * @attribute title
         * @type {String}
         */
        title: PropTypes.string,
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
         * 主题
         * @attribute theme
         * @type {String}
         */
        theme: PropTypes.string,
        /**
         * 停靠位置 'topLeft','top','topRight','bottom','bottomLeft',
         * 'bottomRight','left','leftTop','leftBottom','right',
         * 'rightTop','rightBottom'
         * @attribute theme
         * @type {String}
         */
        align: PropTypes.oneOf(['topLeft', 'top', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left',
            'leftTop', 'leftBottom', 'right', 'rightTop', 'rightBottom']),
        /**
         * 触发条件 'hover','click'
         * @attribute trigger
         * @type {String}
         */
        trigger: PropTypes.oneOf(['hover', 'click'])
    };

    constructor(props) {
        super(props);

        this.addState({
            title: props.title,
            show: false
        });

        // 鼠标移走后延迟隐藏
        this.delay = this.props.delay;
        this.action = this.props.trigger;
        if (this.action === 'hover') {
            this.showAction = 'mouseEnter';
            this.hideAction = 'mouseLeave';
        }
        if (this.action === 'click') {
            this.showAction = 'click';
            this.hideAction = 'click';
        }
    }

    /**
     * 获取显示的内容
     * @param title
     * @returns {XML}
     */
    getPopupElement(title){
        return (
            <div className="cm-tooltip-body">
                <div className="cm-tooltip-arrow" />
                <div className="cm-tooltip-inner">
                    {title || this.state.title}
                </div>
            </div>
        );
    }

    /**
     * 显示隐藏回调
     * @param visible
     */
    onVisibleChange(visible){
        if (this.props.onVisibleChange) {
            this.props.onVisibleChange(visible);
        }
    }

    /**
     * 设置显示内容
     * 空的内容的时候设置空内容标识
     * @param title
     */
    setTitle(title){
        this.setState({title});
        this.refs.trigger.contentIsEmpty(!title);
        this.refs.trigger.updateContent(this.getPopupElement(title));
    }

    /**
     * 显示
     */
    show(){
        this.refs.trigger.setPopupVisible(true);
    }

    /**
     * 隐藏
     */
    hide(){
        this.refs.trigger.setPopupVisible(false);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.title !== this.props.title) {
            this.setTitle(nextProps.title);
        }
        if (nextProps.show !== this.props.show) {
            if (nextProps.show) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    render(){
        let {className, style} = this.props;
        className = classNames('cm-tooltip', className, this.state.theme, this.props.align);

        return (
            <InnerTrigger
                ref="trigger"
                action={this.action}
                hideAction={this.hideAction}
                showAction={this.showAction}
                popup={this.getPopupElement.bind(this)}
                align={this.props.align || 'top'}
                delay={this.delay}
                isEmpty={!this.state.title}
                offsetEle={this.props.offsetEle}
                onVisibleChange={this.onVisibleChange.bind(this)}
                extraProps={{
                    className: className,
                    style: style
                }}
            >
                {
                    React.isValidElement(this.props.children)
                        ? this.props.children
                        : <span className="cm-tooltip-helper">{this.props.children}</span>
                }
            </InnerTrigger>
        );
    }
}

export default Tooltip;
