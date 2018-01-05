import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class Cell extends React.Component {
    displayName = 'Cell';

    static propTypes = {
        selectMode: PropTypes.string,
        rowIndex: PropTypes.number,
        index: PropTypes.number,
        onSelectCell: PropTypes.func,
        onEnterCell: PropTypes.func,
        column: PropTypes.object,
        data: PropTypes.object
    };

    state = {
        selected: false
    };

    format (value, column, row) {
        if (column.format && typeof column.format === 'function') {
            return column.format(value, column, row);
        } else {
            return value;
        }
    }

    onMouseDown = () => {
        if (this.props.selectMode === 'cell') {
            if (this.props.onSelectCell) {
                this.props.onSelectCell(this.props.rowIndex, this.props.index);
            }
        }
    }

    onMouseEnter = () => {
        if (this.props.selectMode === 'cell') {
            if (this.props.onEnterCell) {
                this.props.onEnterCell(this.props.rowIndex, this.props.index);
            }
        }
    }

    select () {
        this.setState({
            selected: true
        });
    }

    unSelect () {
        this.setState({
            selected: false
        });
    }

    render () {
        const {rowIndex, index, column, data} = this.props;
        if (!data) {
            return null;
        }
        const width = column.width;
        const style = {};
        if (width != undefined) {
            style.width = width;
            style.maxWidth = width;
        }
        let text = '';
        if (column.type === 'index') {
            text = rowIndex + 1;
        } else {
            text = this.format(data[column.name], column, data);
        }

        const className = classNames('cm-grid-cell', {
            'cm-grid-cell-selected': this.state.selected
        });
        let tip;
        if (column.tip) {
            if (typeof column.tip === 'function') {
                tip = column.tip(data[column.name], column, data);
            } else {
                tip = text;
            }
        }

        return (
            <div style={style} className={className} data-row={rowIndex} data-cell={index} 
                onMouseDown={this.onMouseDown}
                onMouseEnter={this.onMouseEnter}
                title={tip}
            >
                {text}
            </div>
        );
    }
}
export default Cell;
