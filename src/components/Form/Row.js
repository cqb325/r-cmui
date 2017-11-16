import React from 'react';
import classNames from 'classnames';

class Row extends React.Component{
    static displayName = 'Row';

    renderChildren(){
        return React.Children.map(this.props.children, (child)=>{
            let componentName = (child && child.type && child.type.displayName) ? child.type.displayName : '';
            if (componentName === 'FormControl' || componentName === 'Row') {
                let props = Object.assign({
                    'itemBind': this.props['itemBind'],
                    'itemUnBind': this.props['itemUnBind']
                }, child.props);
                props.layout = this.props.layout ? this.props.layout : props.layout;
                props.labelWidth = this.props.labelWidth ? this.props.labelWidth : props.labelWidth;
                return React.cloneElement(child, props);
            } else if (componentName === 'Promote') {
                let props = Object.assign({
                    labelWidth: this.props.labelWidth ? this.props.labelWidth : child.props.labelWidth
                }, child.props);
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    render(){
        let className = classNames('cm-form-row', this.props.className);
        return <div className={className} style={this.props.style}>
            {this.renderChildren()}
        </div>;
    }
}

export default Row;
