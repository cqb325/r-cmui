import React from 'react';
import DraggableCore from 'react-draggable';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class Column extends React.Component {
    displayName = 'Column';

    static propTypes = {
        data: PropTypes.object,
        onResizeColumn: PropTypes.func,
        onSort: PropTypes.func,
        index: PropTypes.number
    };

    state = {
        width: this.props.data ? this.props.data.width : 100,
        x: 0,
        y: 0,
        sort: null
    }

    resizeColumn = (event, obj) => {
        const {data} = this.props;
        const width = Math.max(this.state.width + obj.deltaX, 100);
        data.width = width;

        this.setState({
            width
        }, () => {
            if (this.props.onResizeColumn) {
                this.props.onResizeColumn();
            }
        });
    }

    resizeStop = () => {
        this.setState({
            x: 0,
            y: 0
        });
    }

    sortColumn = () => {
        const column = this.props.data;
        if (!column.__sort) {
            column.__sort = 'asc';
        } else if (column.__sort === 'asc') {
            column.__sort = 'desc';
        } else {
            column.__sort = null;
        }

        this.setState({
            sort: column.__sort
        });

        if (this.props.onSort) {
            this.props.onSort(this, column.__sort, column.sortType);
        }
    }

    getName () {
        return this.props.data.name;
    }

    resetSort () {
        this.props.data.__sort = null;
        this.setState({
            sort: null
        });
    }

    render () {
        const {data, index} = this.props;
        data.width = data.width || 100;
        const style = {width: data.width};
        const sortClassName = classNames('cm-grid-sort', {
            [`cm-grid-sort-${this.state.sort}`]: this.state.sort
        });
        return (
            <div className='cm-grid-column' data-column={data.name} data-index={index} style={style}>
                <span className='cm-grid-head-text'>
                    {data.text}
                    {data.sort ? <span className={sortClassName} onClick={this.sortColumn}></span> : null}
                </span>
                {data.resize ? <DraggableCore axis='x'
                    onDrag={this.resizeColumn}
                    onStop={this.resizeStop}
                    position={{x: this.state.x, y: this.state.y}}
                ><span className='cm-grid-resize'></span></DraggableCore> : null}
            </div>
        );
    }
}
export default Column;
