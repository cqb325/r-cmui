import React from 'react';
import classNames from 'classnames';

/**
 * 提示文字
 * @class Promote
 * @extends {React.Component}
 */
class Promote extends React.Component {
    displayName = 'Promote';
    static displayName = 'Promote';
    render () {
        const className = classNames('cm-form-promote', 'text-promote', this.props.className);
        const style = Object.assign({
            'paddingLeft': this.props.labelWidth,
            'fontStyle': this.props.italic ? 'italic' : 'normal'
        }, this.props.style);
        return <div className={className} style={style}>
            {this.props.children}
        </div>;
    }
}

export default Promote;
