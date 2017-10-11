/**
 * @author cqb 2016-04-05.
 * @module IconButton
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import FontIcon from '../FontIcon/index';
import EnhancedButton from '../internal/EnhancedButton';
import './IconButton.less';

/**
 * IconButton 类
 * @class IconButton
 * @constructor
 * @extend BaseComponent
 */
class IconButton extends BaseComponent {
    static displayName = 'IconButton';
    static defaultProps = {
        href: 'javascript:void(0)',
        size: 12
    };

    /**
     * 点击回调
     * @private
     * @method _handleClick
     */
    _handleClick = ()=>{
        if (this.state.disabled) {
            return;
        }
        if (this.props.onClick) {
            this.props.onClick();
        }
        this.emit('click');
    }

    /**
     * 创建按钮子元素
     * @method createButtonChildren
     * @returns {*}
     */
    createButtonChildren() {
        const {
            children,
            disabled,
            touchRippleColor,
            touchRippleOpacity
        } = this.props;

        let icon = this.props.icon ? (<FontIcon icon={this.props.icon}>
            {children}
        </FontIcon>) : children;

        return <EnhancedButton centerRipple
            touchRippleColor={touchRippleColor || 'rgba(0, 0, 0, 0.27)'}
            opacity={touchRippleOpacity}
            disabled={disabled}
            style={{textAlign: 'center'}}>
            {icon}
        </EnhancedButton>;
    }

    /**
     * 渲染
     */
    render(){
        const className = classNames(
            this.props.className,
            'cm-button', 'cm-iconButton',
            this.state.theme
        );

        let link = this.props.href;

        let iconSize = this.props.size ? this.props.size : (this.props.style && this.props.style.fontSize) ? parseInt(this.props.style.fontSize, 10) : 24;
        let style = Object.assign({
            fontSize: iconSize + 'px',
            overflow: 'visible',
            padding: iconSize / 2,
            width: iconSize * 2,
            height: iconSize * 2,
            lineHeight: 'normal',
            textAlign: 'center'
        }, this.props.style);

        return (
            <a href={link} ref="button"
                disabled={this.state.disabled}
                onClick={this._handleClick}
                className={className}
                style={style}>
                {this.createButtonChildren()}
            </a>
        );
    }
}

export default IconButton;
