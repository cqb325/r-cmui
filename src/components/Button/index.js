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
    static displayName = "Button";

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
        active: false
    }

    /**
     * 构造函数
     * @param  {[type]} props [description]
     * @return {[type]}       [description]
     */
    constructor(props) {
        super(props);

        this.addState({
            raised: false,
            active: props.active
        });
    }

    /**
     * 点击回调
     * @private
     * @method _handleClick
     */
    _handleClick = e => {
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

    /**
     * set active
     * @param {Boolean} active [description]
     */
    setActive(active){
        this.setState({active: active});
    }

    /**
     * get is active
     * @return {[type]} [description]
     */
    getActive(){
        return this.state.active;
    }

    /**
     * 鼠标按下事件
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    handleMouseDown = (event) => {
        if (event.button === 0 && !this.state.disabled && this.props.raised) {
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
        if (!this.state.disabled && this.props.raised) {
            this.setState({
                raised: false
            });
        }
    };

    /**
     * theme和disabled属性变化的时候重新渲染
     * @param  {[type]} nextProps [description]
     * @return {[type]}           [description]
     */
    componentWillReceiveProps(nextProps){
        let params = {};
        if(nextProps.theme !== this.state.theme){
            params['theme'] = nextProps.theme;
        }
        if(nextProps.disabled !== this.state.disabled){
            params['disabled'] = nextProps.disabled;
        }
        this.setState(params);
    }

    componentDidMount(){
        this._isMounted = true;
        if (this.props['itemBind']) {
            this.props['itemBind'](this);
        }
    }

    /**
     * 渲染
     */
    render(){
        let {id, className, style, target, size, iconButton, circle,
            iconAlign, raised, flat, props, icon, href, children, img} = this.props;
        className = classNames(
            className,
            'cm-button',
            this.state.theme,
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

        let link = href || null;

        let iconPosition = iconAlign || 'left';
        let fontIcon = null;
        if (icon) {
            fontIcon = iconPosition === 'left'
                ? <FontIcon icon={icon} className={iconPosition} style={{marginRight: !!children ? 5 : 0}} />
                : <FontIcon icon={icon} className={iconPosition} style={{marginLeft: !!children ? 5 : 0}} />;
        }

        if (img) {
            img = <img src={img} className="cm-button-img" alt="" style={{marginRight: !!children ? 5 : 0}} />
        }

        let nodes = iconPosition === 'left'
            ? (<EnhancedButton>
                {img}
                {fontIcon}
                {children}
            </EnhancedButton>)
            : (<EnhancedButton>
                {img}
                {children}
                {fontIcon}
            </EnhancedButton>);

        return (
            <a ref='button'
                href={link}
                id={id}
                disabled={this.state.disabled}
                onClick={this._handleClick}
                onMouseUp={this.handleMouseUp}
                onMouseDown={this.handleMouseDown}
                className={className}
                style={style}
                target={target}>
                {nodes}
            </a>
        );
    }
}

export default Button;
