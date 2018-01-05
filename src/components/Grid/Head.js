import React from 'react';
import Column from './Column';

class Head extends React.Component {
    displayName = 'Head';

    columns = {};

    state = {
        scrollLeft: 0
    };

    lastSortColumn = null;

    saveColumn (f, column) {
        this.columns[column.name] = f;
    }

    onSort = (col, sort, sortType) => {
        if (this.lastSortColumn && this.lastSortColumn !== col) {
            this.lastSortColumn.resetSort();
        }
        if (this.props.onSort) {
            this.props.onSort(col, sort, sortType);
        }
    }

    renderColumns () {
        if (this.props.columns) {
            return this.props.columns.map((column, index) => {
                return <Column ref={(f) => this.saveColumn.bind(this, f, column)}
                    data={column} key={column.name || column.type} index={index}
                    onResizeColumn={this.props.onResizeColumn}
                    onSort={this.onSort}
                />;
            });
        } else {
            return null;
        }
    }

    setScrollLeft (scrollLeft) {
        this.setState({
            scrollLeft
        });
    }

    render () {
        return (
            <div className='cm-grid-head-wrap'>
                <div className='cm-grid-head' style={{left: this.state.scrollLeft}}>
                    {this.renderColumns()}
                </div>
            </div>
        );
    }
}
export default Head;
