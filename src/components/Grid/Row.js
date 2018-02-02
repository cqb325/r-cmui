import React from 'react';
import Cell from './Cell';
import PropTypes from 'prop-types';

class Row extends React.Component {
    displayName = 'Row';

    static propTypes = {
        selectMode: PropTypes.string,
        rowIndex: PropTypes.number,
        onSelectCell: PropTypes.func,
        onEnterCell: PropTypes.func,
        onSelectRow: PropTypes.func,
        onCheckedRow: PropTypes.func,
        onOpenEdit: PropTypes.func,
        onCellChange: PropTypes.func,
        editable: PropTypes.bool,
        columns: PropTypes.array,
        data: PropTypes.object
    };

    state = {
        selected: this.props.data._selected
    };

    cells = [];

    checkboxCell = null;

    selectCells (cells) {
        for (let i = cells[0]; i <= cells[1]; i++) {
            const cell = this.cells[i];
            if (cell) {
                cell.select();
            }
        }
    }

    unSelectCells (cells) {
        for (let i = cells[0]; i <= cells[1]; i++) {
            const cell = this.cells[i];
            if (cell) {
                cell.unSelect();
            }
        }
    }

    saveCell (col, f) {
        this.cells.push(f);
        if (col.type === 'checkbox') {
            this.checkboxCell = f;
        }
    }

    setChecked (checked) {
        if (this.checkboxCell) {
            this.checkboxCell.setChecked(checked);
        }
    }

    isChecked () {
        if (this.checkboxCell) {
            return this.checkboxCell.isChecked();
        }
        return false;
    }

    renderCells () {
        return this.props.columns.map((column, index) => {
            return <Cell 
                selectMode={this.props.selectMode}
                column={column}
                rowIndex={this.props.rowIndex}
                index={index}
                key={column.name || column.type}
                data={this.props.data}
                ref={this.saveCell.bind(this, column)}
                onSelectCell={this.props.onSelectCell}
                onEnterCell={this.props.onEnterCell}
                onCheckedRow={this.props.onCheckedRow}
                onOpenEdit={this.props.onOpenEdit}
                editable={this.props.editable}
                onCellChange={this.props.onCellChange}
            />;
        });
    }

    onMouseDown = (e) => {
        if (this.props.selectMode === 'row') {
            this.select();

            if (this.props.onSelectRow) {
                this.props.onSelectRow(this, e.ctrlKey, e.shiftKey);
            }
        }
    }

    getRowIndex () {
        return this.props.rowIndex;
    }

    unSelect () {
        this.setState({
            selected: false
        });
    }

    select () {
        this.setState({
            selected: true
        });
    }

    isSelect () {
        return this.state.selected;
    }

    render () {
        const show = this.props.data._show === undefined ? true : this.props.data._show;
        const style = {
            display:  show ? 'block' : 'none'
        };
        return (
            <div style={style} className={`cm-grid-row ${(this.state.selected && this.props.selectMode === 'row') ? 'cm-grid-row-selected' : ''}`} data-row={this.props.rowIndex} onMouseDown={this.onMouseDown}>
                {this.renderCells()}
            </div>
        );
    }
}
export default Row;
