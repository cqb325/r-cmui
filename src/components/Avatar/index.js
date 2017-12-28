import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import FontIcon from '../FontIcon/index';

import './Avatar.less';

class Avatar extends BaseComponent {
    displayName = 'Avatar';

    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        size: PropTypes.oneOf(['large', 'small']),
        icon: PropTypes.any,
        src: PropTypes.string,
        font: PropTypes.string,
        shape: PropTypes.string
    }

    renderContent () {
        if (this.props.src) {
            return this.renderImage();
        }
        if (this.props.icon) {
            return this.renderIcon();
        }
        return <span className='cm-avatar-string' ref={(f) => this.string = f }>{this.props.children}</span>;
    }

    renderImage () {
        return <img src={this.props.src} alt='' />;
    }

    renderIcon () {
        return  <FontIcon icon={this.props.icon} fpnt={this.props.font}/>;
    }

    componentDidMount () {
        if (!this.props.src && !this.props.icon) {
            const wrapW = this.wrap.clientWidth;
            const strRect = this.string.getBoundingClientRect();
            const strW = strRect.width;
            const strH = 21;
            const theta = Math.acos(strH / wrapW);
            const w = Math.sin(theta) * wrapW;
            const ratio = strW > wrapW ? w / strW : 1;

            this.string.style.Transform = `scale(${ratio}) translate(-50%, 0)`;
            this.string.style.webkitTransform = `scale(${ratio}) translate(-50%, 0)`;
            this.string.style.mozTransform = `scale(${ratio}) translate(-50%, 0)`;
        }
    }

    onClick = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render () {
        const {className, style, size, icon, src, shape} = this.props;
        const clazzName = classNames('cm-avatar', className, {
            [`cm-avatar-${size}`]: size,
            'cm-avatar-icon': icon,
            'cm-avatar-img': src,
            'cm-avatar-square': shape === 'square'
        });
        return (
            <span className={clazzName} style={style} ref={(f) => this.wrap = f} onClick={this.onClick}>
                {this.renderContent()}
            </span>
        );
    }
}
export default Avatar;
