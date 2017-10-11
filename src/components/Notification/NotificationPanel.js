/**
 * @author cqb 2017-05-19.
 * @module Notification
 */

import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import velocity from '../../lib/velocity';

class NotificationPanel extends PureComponent{
    static displayName = 'NotificationPanel';

    /**
     * 关闭消息
     * @return {[type]} [description]
     */
    close = ()=>{
        if (!this._isMounted) {
            return false;
        }
        let ele = ReactDOM.findDOMNode(this);
        velocity(ele, {height: 0, opacity: 0}, {
            duration: 100,
            easing: 'linear',
            complete: ()=>{
                this.props.parent.destroy(this.props.config.key);
                if (this.props.config.onClose) {
                    this.props.config.onClose();
                }
            }
        });
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
        let ele = ReactDOM.findDOMNode(this);
        let params = {};
        if (this.props.dock === 'topRight' || this.props.dock === 'bottomRight') {
            params = {right: 0};
        } else {
            params = {left: 0};
        }
        velocity(ele, params, {duration: 100, easing: 'linear'});

        if (this.props.config.duration) {
            window.setTimeout(()=>{
                this.close();
            }, this.props.config.duration * 1000);
        }
    }

    render(){
        let {className, style, icon, btn} = this.props.config;
        className = classNames('cm-notification-item', className, {
            'cm-notification-item-width-icon': icon
        });
        return (
            <div className={className} style={style}>
                <a className="cm-notification-close" onClick={this.close}>x</a>
                {
                    icon ? <div className="cm-notification-icon">{icon}</div> : null
                }
                <div className="cm-notification-content">
                    <div className="cm-notification-head">{this.props.config.title}</div>
                    <div className="cm-notification-body">{this.props.config.desc}</div>
                    { btn
                        ? <span className="cm-notification-btn-wrap">
                            {btn}
                        </span>
                        : null
                    }
                </div>
            </div>
        );
    }
}

export default NotificationPanel;
