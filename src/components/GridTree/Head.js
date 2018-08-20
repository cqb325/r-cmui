import React from 'react';
import PropTypes from 'prop-types';


class Head extends React.Component {
    displayName = 'Head';

    static contextTypes = {
        columnsWidth: PropTypes.object,
        scrollLeft: PropTypes.number
    }

    renderColumns () {
        const cols = [];
        const columns = this.props.columns;
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const style = {};
            Object.assign(style, column.style, {
                width: column.width,
                display: column.type !== 'tree' ? column.hide ? 'none' : '' : ''
            });
            cols.push(<div style={style} className='cm-grid-tree-column' key={i}>{column.text}</div>);
        }
        return cols;
    }

    render () {
        return <div className='cm-grid-tree-head-wrap'>
            <div className='cm-grid-tree-head' style={{left: this.context.scrollLeft}}>
                {this.renderColumns()}
            </div>
        </div>;
    }
}

export default Head;
