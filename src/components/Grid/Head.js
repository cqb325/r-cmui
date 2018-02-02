import React from 'react';
import Column from './Column';
import PropTypes from 'prop-types';

class Head extends React.Component {
    displayName = 'Head';

    static propTypes = {
        onSort: PropTypes.func,
        columns: PropTypes.array,
        onResizeColumn: PropTypes.func,
        onFilter: PropTypes.func
    };

    columns = {};

    state = {
        scrollLeft: 0
    };

    lastSortColumn = null;

    checkboxColumn = null;

    saveColumn (f, column) {
        this.columns[column.name] = f;

        if (column.type === 'checkbox') {
            this.checkboxColumn = f;
        }
    }

    onSort = (col, sort, sortType) => {
        // 不是动态加载数据的或者指定是单排的
        if (!this.props.source || !this.props.muiltiSort) {
            if (this.lastSortColumn && this.lastSortColumn !== col) {
                this.lastSortColumn.resetSort();
            }
        }
        if (this.props.onSort) {
            this.props.onSort(col, sort, sortType);
        }
        this.lastSortColumn = col;
    }

    renderColumns () {
        if (this.props.columns) {
            return this.props.columns.map((column, index) => {
                return <Column ref={(f) => this.saveColumn(f, column)}
                    data={column} key={column.name || column.type} index={index}
                    onResizeColumn={this.props.onResizeColumn}
                    onSort={this.onSort}
                    onFilter={this.props.onFilter}
                    onCheckedAll={this.props.onCheckedAll}
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

    setChecked (checked) {
        if (this.checkboxColumn) {
            this.checkboxColumn.setChecked(checked);
        }
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
