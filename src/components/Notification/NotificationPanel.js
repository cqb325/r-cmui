/**
 * @author cqb 2017-05-19.
 * @module Notification
 */

import React, {PureComponent} from 'react';
import classNames from 'classnames';

class NotificationPanel extends PureComponent {
    static displayName = 'NotificationPanel';

    state = {
        open: false,
        close: false
    };

    /**
     * 关闭消息
     * @return {[type]} [description]
     */
    close = () => {
        if (!this._isMounted) {
            return false;
        }
        this.setState({
            close: true
        });
        window.setTimeout(() => {
            this.props.parent.destroy(this.props.config.key);
            if (this.props.config.onClose) {
                this.props.config.onClose();
            }
        }, 300);
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    componentDidMount () {
        this._isMounted = true;
        // const ele = ReactDOM.findDOMNode(this);
        // let params = {};
        // if (this.props.config.dock === 'topRight' || this.props.config.dock === 'bottomRight') {
        //     params = {right: 0};
        // } else {
        //     params = {left: 0};
        // }
        // velocity(ele, params, {duration: 100, easing: 'linear'});

        setTimeout(() => {
            this.setState({
                open: true
            });
        },10);
        
        if (this.props.config.duration) {
            window.setTimeout(() => {
                this.close();
            }, this.props.config.duration * 1000);
        }
    }

    render () {
        let {className, style, icon, btn, theme} = this.props.config;
        className = classNames('cm-notification-item', className, {
            'cm-notification-item-width-icon': icon,
            'cm-notification-item-open': this.state.open,
            'cm-notification-item-close': this.state.close,
            [`cm-notification-item-${theme}`]: theme
        });
        return (
            <div className={className} style={style}>
                <div className='cm-notification-item-wrap'>
                    <a className='cm-notification-close' onClick={this.close}>x</a>
                    {
                        icon ? <div className='cm-notification-icon'>{icon}</div> : null
                    }
                    <div className='cm-notification-content'>
                        <div className='cm-notification-head'>{this.props.config.title}</div>
                        <div className='cm-notification-body'>{this.props.config.desc}</div>
                        { btn
                            ? <span className='cm-notification-btn-wrap'>
                                {btn}
                            </span>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default NotificationPanel;
