import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';
import UUID from '../utils/UUID';

class Cell extends React.Component {
    displayName = 'Cell';

    static propTypes = {
        selectMode: PropTypes.string,
        rowIndex: PropTypes.number,
        index: PropTypes.number,
        onSelectCell: PropTypes.func,
        onEnterCell: PropTypes.func,
        onCellChange: PropTypes.func,
        onCheckedRow: PropTypes.func,
        onOpenEdit: PropTypes.func,
        column: PropTypes.object,
        data: PropTypes.object
    };

    state = {
        selected: false,
        edit: false
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

    /**
     * 设置选中状态
     * @param {*} checked 
     */
    setChecked (checked) {
        const {data} = this.props;
        if (data._disabled) {
            return false;
        }
        data._checked = checked;
        if (this.checkbox) {
            this.checkbox.setChecked(checked);
        }
    }

    /**
     * 当前是否选中
     */
    isChecked () {
        if (this.checkbox) {
            return this.checkbox.isChecked();
        }
        return false;
    }

    onChecked = (val, checked) => {
        const {data} = this.props;
        data._checked = checked;
        if (this.props.onCheckedRow) {
            this.props.onCheckedRow(checked);
        }
    }

    onClick = () => {
        if (!this._isMounted) {
            return false;
        }
        if (!this.props.editable) {
            return false;
        }
        this.setState({
            edit: true
        }, () => {
            if (this.props.onOpenEdit) {
                this.props.onOpenEdit(this);
            }
        });
    }

    setEdit (edit) {
        if (!this._isMounted) {
            return false;
        }
        if (!edit && this.editor && this.editor.getValue) {
            const v = this.editor.getValue();
            const col = this.props.column;
            this.props.data[col.name] = v;

            if (this.props.onCellChange) {
                this.props.onCellChange(v, this.props.column, this.props.data, this);
            }
        }
        this.setState({
            edit
        });
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    componentDidMount () {
        this._isMounted = true;
    }

    render () {
        const {rowIndex, index, column, data} = this.props;
        if (!data) {
            return null;
        }
        if (data._checked === undefined) {
            data._checked = false;
        }
        const width = column.width;
        const style = {};
        if (width != undefined) {
            style.width = width;
            style.maxWidth = width;
        }
        if (column.hide) {
            style.display = 'none';
        }
        let text = '';
        if (column.type === 'index') {
            text = rowIndex + 1;
        } else if (column.type === 'checkbox') {
            text = <CheckBox ref={(f) => this.checkbox = f} onChange={this.onChecked} checked={data._checked} key={data.id || UUID.v4()}/>;
        } else {
            text = this.format(data[column.name], column, data);
        }

        const className = classNames('cm-grid-cell', {
            'cm-grid-cell-selected': this.state.selected,
            'cm-grid-cell-edit': this.state.edit && !!column.editor
        });
        let tip;
        if (column.tip) {
            if (typeof column.tip === 'function') {
                tip = column.tip(data[column.name], column, data);
            } else {
                tip = text;
            }
        }

        if (this.state.edit && column.editor) {
            text = React.cloneElement(column.editor, {ref: (f) => {
                this.editor = f;
            }, value: data[column.name], className: 'cm-grid-editor'});
        }

        return (
            <div style={style} className={className} data-row={rowIndex} data-cell={index} 
                onMouseDown={this.onMouseDown}
                onMouseEnter={this.onMouseEnter}
                title={tip}
                onClick={this.onClick}
            >
                {text}
            </div>
        );
    }
}
export default Cell;
