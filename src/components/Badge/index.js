/**
 * @author cqb 2017-01-17.
 * @module Badge
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import './Badge.less';

/**
 * Badge 类
 * @class Badge
 * @constructor
 * @extend BaseComponent
 */
class Badge extends BaseComponent{
    static displayName = 'Badge';
    static defaultProps = {
        count: 0,
        dot: false
    };

    constructor(props){
        super(props);

        this.addState({
            count: props.count,
            status: props.status
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.count !== this.props.count) {
            this.setState({
                count: nextProps.count
            });
        }
    }

    renderCount(){
        if (this.state.status) {
            let countName = classNames('cm-badge-status-dot', {
                [`cm-badge-status-${this.state.status}`]: this.state.status
            });
            return [
                <span key="1" className={countName} />,
                <span key="2" className="cm-badge-status-text">{this.props.text}</span>
            ];
        } else {
            let countName = classNames('cm-badge-count', {
                'cm-badge-dot': this.props.dot
            });
            if (this.state.count != undefined || this.props.dot) {
                return (
                    <sup className={countName}>
                        {this.props.dot ? null : this.state.count}
                    </sup>
                );
            } else {
                return null;
            }
        }
    }

    /**
     * 添加count
     * @param {any} num 
     * @memberof Badge
     */
    addCount(num){
        num = num || 0;
        let value = Math.max(this.state.count + num, 0);

        this.setState({
            count: value
        });
    }

    /**
     * 设置count值
     * @param {any} count 
     * @memberof Badge
     */
    setCount(count){
        count = Math.max(count, 0);
        this.setState({count});
    }

    render(){
        let {className, style} = this.props;
        className = classNames(className, 'cm-badge', this.state.theme, {
            'cm-badge-static': (!React.Children.count(this.props.children) && !this.state.status),
            'cm-badge-status': this.state.status
        });

        return (
            <span className={className} style={style}>
                {this.props.children}
                {this.renderCount()}
            </span>
        );
    }
}

export default Badge;
