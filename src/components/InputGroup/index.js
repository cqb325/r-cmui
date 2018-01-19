import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';

import './InputGroup.less';

class InputGroup extends BaseComponent {
    displayName = 'InputGroup';

    static defaultProps = {};

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
        style: PropTypes.object
    };

    renderComponents () {
        return React.Children.map(this.props.children, (child) => {
            const props = Object.assign({}, this.props, child.props, {
                className: 'cm-input-group-item'
            });
            return React.cloneElement(child, props);
        });
    }

    render () {
        const {className, style, size} = this.props;

        const clazzName = classNames('cm-input-group', className, {
            [`cm-input-group-${size}`]: size
        });
        return (
            <span className={clazzName} style={style}>
                {this.renderComponents()}
            </span>
        );
    }
}
export default InputGroup;
