/**
 * @author cqb 2017-01-16.
 * @module Sider
 */

import React from 'react';
import classNames from 'classnames';
import omit from './utils/omit';
import FontIcon from './FontIcon';


/**
 * Sider 类
 * @class Sider
 * @constructor
 * @extend React.Component
 */
class Sider extends React.Component {
    constructor(props){
        super(props);

        let collapsed;
        if (props['collapsed'] !== undefined) {
            collapsed = props.collapsed;
        } else {
            collapsed = props.defaultCollapsed;
        }
        this.state = {
            collapsed
        };

        this.toggle = this.toggle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.collapsed !== this.state.collapsed) {
            this.setState({
                collapsed: nextProps.collapsed
            });
        }
    }

    setCollapsed(collapsed){
        if (this.props.collapsed !== this.state.collapsed) {
            this.setState({
                collapsed: collapsed
            });

            if (this.props.onCollapse) {
                this.props.onCollapse(collapsed);
            }
        }
    }

    toggle(){
        let collapsed = !this.state.collapsed;
        this.setCollapsed(collapsed);
    }

    render(){
        let {prefixCls, className, collapsible, trigger, style, width, collapsedWidth} = this.props;
        let divProps = omit(this.props, ['collapsed', 'defaultCollapsed', 'onCollapse', 'name']);

        className = classNames(className, prefixCls, {
            [`${prefixCls}-collapsed`]: !!this.state.collapsed,
            [`${prefixCls}-has-trigger`]: !!trigger
        });

        style = Object.assign({
            flex: `0 0 ${this.state.collapsed ? collapsedWidth : width}px`
        }, style);

        const iconObj = {
            'expanded': <FontIcon icon='angle-left' />,
            'collapsed': <FontIcon icon='angle-right' />
        };
        const status = this.state.collapsed ? 'collapsed' : 'expanded';
        const defaultTrigger = iconObj[status];
        const triggerDom = (
            trigger !== null
                ? (
                    <div className={`${prefixCls}-trigger`} onClick={this.toggle}>
                        {trigger || defaultTrigger}
                    </div>
                )
                : null
        );

        return (
            <div className={className} {...divProps} style={style}>
                {this.props.children}
                {collapsible && triggerDom}
            </div>
        );
    }
}

Sider.defaultProps = {
    width: 200,
    collapsedWidth: 64,
    name: 'Sider',
    prefixCls: 'cm-layout-sider',
    collapsible: false,
    defaultCollapsed: false
};

export default Sider;
