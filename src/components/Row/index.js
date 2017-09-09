import React, {PureComponent} from 'react';
import classNames from 'classnames';

class Row extends PureComponent{
    render(){
        let className = classNames('cm-row', this.props.className);
        let eleName = this.props.component || 'div';
        return React.createElement(eleName, {
            className: className,
            style: this.props.style
        }, this.props.children);
    }
}


export default Row;
