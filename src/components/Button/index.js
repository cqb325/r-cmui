/**
 * @author cqb 2016-04-05.
 * @module Button
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import FontIcon from '../FontIcon/index';
import EnhancedButton from '../internal/EnhancedButton';
import './Button.less';


/**
 * Button 类
 * @class Button
 * @constructor
 * @extends BaseComponent
 */
class Button extends BaseComponent {
    static displayName = 'Button';

    static propTypes = {
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
         * 禁用
         * @attribute disabled
         * @type {Boolean}
         */
        disabled: PropTypes.bool,
        /**
         * 主题
         * @attribute theme
         * @type {String}
         */
        theme: PropTypes.string,
        /**
         * 升起效果
         * @attribute raised
         * @type {string/bool}
         */
        raised: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        /**
         * 无边框效果
         * @attribute flat
         * @type {string/bool}
         */
        flat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        /**
         * 链接地址
         * @attribute href
         * @type {string}
         */
        href: PropTypes.string,
        /**
         * 图标
         * @attribute icon
         * @type {string}
         */
        icon: PropTypes.string,
        /**
         * 图标位置
         * @attribute iconAlign
         * @type {string}
         */
        iconAlign: PropTypes.oneOf(['left', 'right']),
        /**
         * 按钮尺寸
         * @attribute size
         * @type {string}
         */
        size: PropTypes.oneOf(['default', 'large', 'small']),
        /**
         * 跳转的目标通a标签的target
         * @attribute target
         * @type {string}
         */
        target: PropTypes.string,
        /**
         * 图片
         * @attribute img
         * @type {string}
         */
        img: PropTypes.string
    }

    static defaultProps = {
        theme: 'default',
        disabled: false,
        iconAlign: 'left',
        img: null,
        size: null,
        raised: false,
        flat: false,
        circle: false,
        active: false,
        animation: true,
        loadding: false
    }

    state = {
        raised: this.props.raised,
        active: this.props.active
    };

    /**
     * 点击回调
     * @private
     * @method handleClick
     */
    handleClick = e => {
        if (this.props.disabled) {
            return;
        }
        if (this.props.loadding) {
            return;
        }
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        this.emit('click', e);
    }

    /**
     * 鼠标按下事件
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    handleMouseDown = (event) => {
        if (event.button === 0 && !this.props.disabled && this.props.raised) {
            this.setState({
                raised: true
            });
        }
    };

    /**
     * 鼠标弹起事件
     * @return {[type]} [description]
     */
    handleMouseUp = () => {
        if (!this.props.disabled && this.props.raised) {
            this.setState({
                raised: false
            });
        }
    };

    /**
     * set active
     * @param {Boolean} active [description]
     */
    setActive (active) {
        this.setState({active});
    }

    /**
     * get is active
     * @return {[type]} [description]
     */
    isActive () {
        return this.state.active;
    }

    componentDidMount () {
        this._isMounted = true;
        if (this.props['itemBind']) {
            this.props['itemBind'](this);
        }
    }

    /**
     * 渲染
     */
    render () {
        let {id, className, style, target, size, iconButton, circle,
            iconAlign, raised, flat, icon, href, children, img} = this.props;
        className = classNames(
            className,
            'cm-button',
            this.props.theme,
            {
                [`cm-button-${size}`]: size,
                'cm-iconButton': iconButton,
                'cm-button-raised': raised && this.state.raised,
                'cm-button-flat': flat,
                'cm-button-active': this.state.active,
                'cm-button-circle': circle,
                'cm-button-icon-only': !!icon && !children
            }
        );

        const link = href || null;

        const iconPosition = iconAlign || 'left';
        let fontIcon = null;
        if (icon) {
            fontIcon = iconPosition === 'left'
                ? <FontIcon icon={icon} className={iconPosition} style={{marginRight: children ? 5 : 0}} />
                : <FontIcon icon={icon} className={iconPosition} style={{marginLeft: children ? 5 : 0}} />;
        }

        if (img) {
            img = <img src={img} className='cm-button-img' alt='' style={{marginRight: children ? 5 : 0}} />;
        }

        const nodes = iconPosition === 'left'
            ? (<EnhancedButton disabled={!this.props.animation}>
                {img}
                {fontIcon}
                {children}
            </EnhancedButton>)
            : (<EnhancedButton disabled={!this.props.animation}>
                {img}
                {children}
                {fontIcon}
            </EnhancedButton>);

        return (
            <a ref={(f) => this.button = f}
                href={link}
                id={id}
                disabled={this.props.disabled}
                onClick={this.handleClick}
                onMouseUp={this.handleMouseUp}
                onMouseDown={this.handleMouseDown}
                className={className}
                style={style}
                target={target}>
                {nodes}
                {this.props.loadding ? <FontIcon icon='loading' font='cmui' spin className='ml-5' /> : null}
            </a>
        );
    }
}

export default Button;
