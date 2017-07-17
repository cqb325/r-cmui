/**
 * @author cqb 2016-04-17.
 * @module FontIcon
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';

/**
 * 字体图标
 * @class FontIcon
 * @extend BaseComponent
 */
class FontIcon extends BaseComponent {
    static propTypes = {
        /**
         * 图标名称 font awesome 中的图标
         * @attribute icon
         * @type {String}
         */
        icon: PropTypes.string.isRequired,
        /**
         * 自定义图标的名称
         * @attribute font
         * @type {String}
         */
        font: PropTypes.string,
        /**
         * 自定义class
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 自定义样式
         * @type {Object}
         */
        style: PropTypes.object,
        /**
         * 字体大小
         * @type {String}
         */
        size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
        /**
         * 字体颜色
         * @type {String}
         */
        color: PropTypes.string,
        /**
         * 旋转
         * @type {Boolean}
         */
        spin: PropTypes.bool
    }

    render(){
        const {
            icon,
            spin,
            pulse,
            title,
            font
        } = this.props;

        let className = '';
        // 自定义字体
        if (font) {
            className = classNames(font, font + '-' + icon, this.props.className);
        } else {
            let size = this.props.size ? 'fa-' + this.props.size : false;
            let rotate = this.props.rotate ? 'fa-rotate-' + this.props.rotate : false;
            className = classNames('fa', 'fa-' + icon, size, this.props.className, {
                'fa-spin': spin,
                'fa-pulse': pulse
            }, rotate);
        }

        let style = this.props.style || {};
        if (this.props.color) {
            style.color = this.props.color;
        }
        return (
            <i className={className} style={style} onClick={this.props.onClick} title={title}>
                {this.props.children}
            </i>
        );
    }
}

export default FontIcon;
