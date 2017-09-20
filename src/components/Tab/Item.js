import React from 'react';
import UUID from '../utils/UUID';

class Item extends React.PureComponent {
    static displayName = 'Item';
    static defaultProps = {
        title: 'Tab',
        id: UUID.v4()
    };
    render(){
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default Item;
