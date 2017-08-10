/**
 * @author cqb 2016-04-05.
 * @module Button
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import FontIcon from './FontIcon';
import EnhancedButton from './internal/EnhancedButton';


/**
 * Button 类
 * @class Button
 * @constructor
 * @extends BaseComponent
 */
class Button extends BaseComponent {
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
        target: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.addState({
            disabled: props.disabled,
            raised: false,
            text: null,
            active: this.props.active || false
        });
    }

    /**
     * 禁用
     * @method disable
     * @param elem {Element} 显示的内容
     */
    disable(elem) {
        this.setState({ disabled: true, show: elem });
    }

    /**
     * 启用
     * @method enable
     * @param elem {Element} 显示的内容
     */
    enable(elem) {
        this.setState({ disabled: false, show: elem });
    }

    /**
     * 设置按钮的文字
     * @method setText
     * @param text {String} 要设置的按钮文字
     */
    setText(text){
        this.setState(text);
    }

    /**
     * 点击回调
     * @private
     * @method _handleClick
     */
    _handleClick(e){
        if (this.state.disabled) {
            return;
        }
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        this.emit('click');
        if (this.props.once) {
            this.disable();
        }
    }

    setActive(active){
        this.setState({active: active});
    }

    getActive(){
        return this.state.active;
    }

    handleMouseDown = (event) => {
        if (event.button === 0 && !this.props.disabled) {
            this.setState({
                raised: true
            });
        }
    };

    handleMouseUp = () => {
        if (!this.props.disabled) {
            this.setState({
                raised: false
            });
        }
    };

    componentDidMount(){
        this._isMounted = true;
        if (this.props['data-itemBind']) {
            this.props['data-itemBind'](this);
        }
    }

    /**
     * 主题和disabled属性变化后改变状态
     * @param  {[type]} nextProps [description]
     * @return {[type]}           [description]
     */
    componentWillReceiveProps(nextProps){
        let params = {};
        if (nextProps.theme !== this.props.theme) {
            params.theme = nextProps.theme;
        }
        if (nextProps.disabled !== this.props.disabled) {
            params.disabled = nextProps.disabled;
        }

        this.setState(params);
    }

    /**
     * 渲染
     */
    render(){
        let props = this.props;
        const className = classNames(
            props.className,
            'cm-button',
            this.state.theme,
            props.size,
            {
                'cm-iconButton': props.iconButton,
                'raised': props.raised && this.state.raised,
                'flat': props.flat,
                'active': this.state.active,
                'cm-button-circle': props.circle,
                'cm-button-icon-only': !!props.icon && !props.children
            }
        );

        let link = this.props.href || 'javascript:void(0)';

        let iconPosition = props.iconAlign || 'left';
        let icon = null;
        if (props.icon) {
            icon = iconPosition === 'left'
                ? <FontIcon icon={props.icon} className={iconPosition} style={{marginRight: props.children ? 5 : 0}} />
                : <FontIcon icon={props.icon} className={iconPosition} style={{marginLeft: props.children ? 5 : 0}} />;
        }

        let nodes = iconPosition === 'left'
            ? (<EnhancedButton>
                {icon}
                {props.children}
            </EnhancedButton>)
            : (<EnhancedButton>
                {props.children}
                {icon}
            </EnhancedButton>);

        return (
            <a href={link} ref='button'
                disabled={this.state.disabled}
                onClick={this._handleClick.bind(this)}
                onMouseUp={this.handleMouseUp}
                onMouseDown={this.handleMouseDown}
                className={className}
                style={this.props.style}
                target={this.props.target}>
                {nodes}
            </a>
        );
    }
}

export default Button;
