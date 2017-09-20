/**
 * Dropdown
 * @author cqb
 * @type {[type]}
 */
import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import InnerDropdown from '../internal/InnerDropdown';
import './Dropdown.less';

/**
 * Dropdown下拉
 * @class Dropdown
 * @constructor
 * @type {Dropdown}
 */
class Dropdown extends BaseComponent {
    static displayName = 'Dropdown';

    static defaultProps = {
        action: 'hover',
        align: 'bottomLeft'
    };
    
    constructor(props){
        super(props);

        this.action = props.action;
    }

    /**
     * 显示隐藏回调
     * @param visible
     */
    onVisibleChange(visible){
        if (this.props.onVisibleChange) {
            this.props.onVisibleChange(visible);
        }

        this.emit('visibleChange', visible);
    }

    render(){
        let {className, style} = this.props;
        className = classNames('cm-dropdown', className, this.props.align);

        return (
            <InnerDropdown
                ref='trigger'
                action={this.action}
                overlay={this.props.overlay}
                align={this.props.align || 'bottomLeft'}
                delay={this.delay}
                onVisibleChange={this.onVisibleChange.bind(this)}
                extraProps={{
                    className: className,
                    style: style
                }}
            >
                {React.isValidElement(this.props.children)
                    ? this.props.children
                    : <span className='cm-dropdown-helper'>{this.props.children}</span>
                }
            </InnerDropdown>
        );
    }
}

export default Dropdown;
