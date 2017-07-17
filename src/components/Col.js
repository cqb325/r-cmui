import React from 'react';
import classNames from 'classnames';
import grids from './utils/grids';

let Col = React.createClass({
    render(){
        let className = classNames('cm-col', this.props.className, grids.getGrid(this.props.grid));
        let eleName = this.props.component || 'div';
        return React.createElement(eleName, {
            className: className,
            style: this.props.style
        }, this.props.children);
    }
});


export default Col;
