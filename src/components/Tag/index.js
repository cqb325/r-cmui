import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import velocity from '../../lib/velocity';

import './Tag.less';

class Tag extends React.Component {
    displayName = 'Tag';

    static defaultProps = {
        closable: false,
        circle: false
    };

    static propTypes = {
        closable: PropTypes.bool,
        badge: PropTypes.any,
        circle: PropTypes.bool
    };

    state = {
        show: true
    }

    onClose = (e) => {
        if (this.props.onBeforeClose) {
            const ret = this.props.onBeforeClose(this, e);
            if (ret) {
                this.doClose(e);
            }
        } else {
            this.doClose(e);
        }
    }

    onMouseEnter = () => {
        if (this.props.badge !== undefined) {
            const w = this.badgeText.getBoundingClientRect().width;
            velocity(this.badge, {width: w + 3}, {duration: 300});
        }
    }

    onMouseLeave = () => {
        if (this.props.badge !== undefined) {
            velocity(this.badge, {width: 3}, {duration: 300});
        }
    }

    doClose (e) {
        velocity(this.wrap, {width: 0}, {
            duration: 300,
            complete: () => {
                this.setState({
                    show: false
                }, () => {
                    if (this.props.onClose) {
                        this.props.onClose(this, e);
                    }
                });
            }
        });
    }

    render () {
        if (!this.state.show) {
            return null;
        }
        const {className, style, theme, badge, circle} = this.props;
        const clazzName = classNames('cm-tag', className, {
            [`cm-tag-${theme}`]: theme,
            'cm-tag-has-badge': badge !== undefined,
            'cm-tag-circle': !badge && circle
        });
        return (
            <div className={clazzName} style={style} ref={(f) => this.wrap = f } 
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div className='cm-tag-content'>
                    <span className='cm-tag-text'>{this.props.children}</span>
                    {
                        this.props.closable ? <i className='cmui cmui-close1 ml-5' onClick={this.onClose}></i> : null
                    }
                </div>{badge !== undefined ? <span className='cm-tag-badge' ref={(f) => this.badge = f}>
                    <span className='cm-tag-badge-text' ref={(f) => this.badgeText = f}>{badge}</span>
                </span> : null}
            </div>
        );
    }
}
export default Tag;
