/**
 * @author cqb 2017-01-17.
 * @module Badge
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';

/**
 * Badge 类
 * @class Badge
 * @constructor
 * @extend BaseComponent
 */
class Badge extends BaseComponent{
    constructor(props){
        super(props);

        this.addState({
            value: props.value,
            status: props.status
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.value !== this.state.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    renderCount(){
        if (this.state.status) {
            let countName = classNames('cm-badge-status-dot', {
                [`cm-badge-status-${this.state.status}`]: this.state.status
            });
            return [
                <span key='1' className={countName} />,
                <span key='2' className='cm-badge-status-text'>{this.props.text}</span>
            ];
        } else {
            let countName = classNames('cm-badge-count', {
                'cm-badge-dot': this.props.dot
            });
            if (this.state.value != undefined || this.props.dot) {
                return (
                    <sup className={countName}>
                        {this.props.dot ? null : this.state.value}
                    </sup>
                );
            } else {
                return null;
            }
        }
    }

    addCount(num){
        num = num || 0;
        let value = Math.max(this.state.value + num, 0);

        this.setState({
            value: value
        });
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
