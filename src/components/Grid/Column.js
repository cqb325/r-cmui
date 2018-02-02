import React from 'react';
import DraggableCore from 'react-draggable';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FontIcon from '../FontIcon';
import Dropdown from '../Dropdown';
import CheckBoxGroup from '../CheckBoxGroup';
import CheckBox from '../CheckBox';

class Column extends React.Component {
    displayName = 'Column';

    static propTypes = {
        data: PropTypes.object,
        onResizeColumn: PropTypes.func,
        onSort: PropTypes.func,
        onFilter: PropTypes.func,
        onCheckedAll: PropTypes.func,
        index: PropTypes.number
    };

    state = {
        width: this.props.data ? this.props.data.width : 100,
        x: 0,
        y: 0,
        sort: null,
        checked: false
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

    onFilter = () => {
        const vals = this.filterList.getValue();
        if (this.props.onFilter) {
            this.props.onFilter(vals, this.props.data);
        }

        this.hideFilter();
    }

    onFilterReset = () => {
        this.filterList.setValue('');
        if (this.props.onFilter) {
            this.props.onFilter('', this.props.data);
        }
        
        this.hideFilter();
    }

    hideFilter () {
        if (this.filterDropdown) {
            this.filterDropdown.refs.trigger.setPopupVisible(false);
        }
    }

    renderFilters () {
        const menu = <div className='cm-grid-filter-wrap'>
            <ul className='cm-grid-filters'>
                <CheckBoxGroup ref={(f) => this.filterList = f} data={this.props.data.filters} layout='stack'/>
            </ul>
            <div>
                <span className='text-link cm-grid-filter-btn' onClick={this.onFilter}>OK</span>
                <span className='text-link cm-grid-filter-btn text-right' onClick={this.onFilterReset}>Reset</span>
            </div>
        </div>;
        return <Dropdown ref={(f) => this.filterDropdown = f} action='click' overlay={menu}><FontIcon icon='filter' className='cm-grid-filter'/></Dropdown>;
    }

    /**
     * 设置选中状态
     * @param {*} checked 
     */
    setChecked (checked) {
        if (this.checkbox) {
            this.setState({
                checked
            });
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
        this.setState({
            checked
        });
        if (this.props.onCheckedAll) {
            this.props.onCheckedAll(checked);
        }
    }

    render () {
        const {data, index} = this.props;
        data.width = data.width || 100;
        const style = {width: data.width};
        if (data.hide) {
            style.display = 'none';
        }
        const sortClassName = classNames('cm-grid-sort', {
            [`cm-grid-sort-${this.state.sort}`]: this.state.sort
        });

        let text = data.text;
        if (data.type === 'checkbox') {
            text = <CheckBox ref={(f) => this.checkbox = f} onChange={this.onChecked} checked={this.state.checked}/>;
        }
        return (
            <div className='cm-grid-column' data-column={data.name} data-index={index} style={style}>
                <span className='cm-grid-head-text'>
                    {text}
                    {data.sort ? <span className={sortClassName} onClick={this.sortColumn}></span> : null}
                </span>
                {data.resize ? <DraggableCore axis='x'
                    onDrag={this.resizeColumn}
                    onStop={this.resizeStop}
                    position={{x: this.state.x, y: this.state.y}}
                ><span className='cm-grid-resize'></span></DraggableCore> : null}
                {data.filters ? this.renderFilters() : null}
            </div>
        );
    }
}
export default Column;
