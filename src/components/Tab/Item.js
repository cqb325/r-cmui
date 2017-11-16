import React from 'react';

class Item extends React.Component {
    static displayName = 'Item';

    static defaultProps = {
        title: 'Tab'
    };

    render () {
        return (
            <div className={this.props.className} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}

export default Item;
