import React, {PureComponent} from 'react';
import classNames from 'classnames';
import grids from '../utils/grids';

class Col extends PureComponent{
    static displayName = 'Col';
    render(){
        let className = classNames('cm-col', this.props.className, grids.getGrid(this.props.grid));
        let eleName = this.props.component || 'div';

        let style = this.props.style || {};
        if(this.props.gutter){
            style.paddingLeft = this.props.gutter / 2;
            style.paddingRight = this.props.gutter / 2;
        }

        return React.createElement(eleName, {
            className: className,
            style: style
        }, this.props.children);
    }
}


export default Col;
