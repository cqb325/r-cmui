/**
 * @author cqb 2016-04-17.
 * @module FontIcon
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';

/**
 * 字体图标
 * @class FontIcon
 * @extend BaseComponent
 */
class FontIcon extends BaseComponent {
    static displayName = 'FontIcon';

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
        let {icon,spin,pulse,title,font,className,size,rotate,style,color} = this.props;

        // 自定义字体
        if (font) {
            className = classNames(font, font + '-' + icon, className);
        } else {
            size = size ? 'fa-' + size : false;
            rotate = rotate ? 'fa-rotate-' + rotate : false;
            className = classNames('fa', 'fa-' + icon, size, className, {
                'fa-spin': spin,
                'fa-pulse': pulse
            }, rotate);
        }

        if (color) {
            style.color = color;
        }
        return (
            <i className={className} style={style} onClick={this.props.onClick} title={title}>
                {this.props.children}
            </i>
        );
    }
}

export default FontIcon;
