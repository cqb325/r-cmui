import React from 'react';
import Cell from './Cell';

class Row extends React.Component {
    displayName = 'Row';

    state = {
        selected: this.props.data._selected
    };

    cells = [];

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

    saveCell = (f) => {
        this.cells.push(f);
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
                ref={this.saveCell}
                onSelectCell={this.props.onSelectCell}
                onEnterCell={this.props.onEnterCell}
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
        return (
            <div className={`cm-grid-row ${(this.state.selected && this.props.selectMode === 'row') ? 'cm-grid-row-selected' : ''}`} data-row={this.props.rowIndex} onMouseDown={this.onMouseDown}>
                {this.renderCells()}
            </div>
        );
    }
}
export default Row;
