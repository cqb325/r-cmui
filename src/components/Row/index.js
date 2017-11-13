import React, {PureComponent} from 'react';
import classNames from 'classnames';

class Row extends PureComponent{
    renderCols(){
        return React.Children.map(this.props.children, (child)=>{
            let componentName = child.type && child.type.displayName ? child.type.displayName : '';
            if (componentName === 'Col') {
                let props = Object.assign({
                    'gutter': this.props.gutter
                }, child.props);
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    render(){
        let className = classNames('cm-row', this.props.className);
        let eleName = this.props.component || 'div';
        let style = this.props.style || {};
        if(this.props.gutter){
            style.marginLeft = -this.props.gutter;
            style.marginRight = -this.props.gutter;
        }
        return React.createElement(eleName, {
            className: className,
            style: style
        }, this.renderCols());
    }
}


export default Row;
