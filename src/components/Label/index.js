import React, {PureComponent} from 'react';
import classNames from 'classnames';
import grids from '../utils/grids';

class Label extends PureComponent {
    displayName = 'Label'
    static displayName = 'Label'
    
    render () {
        const className = classNames('cm-label', this.props.className, grids.getGrid(this.props.grid));
        const eleName = this.props.component || 'div';
        return React.createElement(eleName, {
            className,
            style: this.props.style
        }, this.props.children);
    }
}

export default Label;
