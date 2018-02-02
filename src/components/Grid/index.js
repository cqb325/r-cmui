import React from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Head from './Head';
import Body from './Body';
import SmartBody from './SmartBody';
import Pagination from '../Pagination';
import fetch from '../utils/fetch';
import Dom from '../utils/Dom';
import UUID from '../utils/UUID';
import Events from '../utils/Events';
import ContextMenu from '../ContextMenu';
import './Grid.less';

class Grid extends React.Component {
    displayName = 'Grid';

    static defaultProps = {
        muiltiSort: true,
        autoHeight: false,
        editable: false
    };

    state = {
        headHeight: 0,
        pageNum: 1,
        total: this.props.total,
        pageSize: this.props.pageSize || 10,
        data: this.props.data
    };

    cloneData = null;
    filters = {};
    sorts = {};
    /**
     * 已经开启编辑的单元格
     */
    lastOpenEditCell = null;

    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        data: PropTypes.array,
        columns: PropTypes.array,
        selectMode: PropTypes.oneOf(['row', 'cell']),
        source: PropTypes.oneOf(['dynamic']),
        action: PropTypes.string,
        border: PropTypes.bool,
        total: PropTypes.number,
        pageSize: PropTypes.number,
        pageNum: PropTypes.number,
        smart: PropTypes.bool,
        editable: PropTypes.bool,
        onSelectRow: PropTypes.func,
        onCellChange: PropTypes.func,
        muiltiSort: PropTypes.bool,
        autoHeight: PropTypes.bool
    };

    componentDidMount () {
        const head = ReactDom.findDOMNode(this.head);
        const headHeight = head.getBoundingClientRect().height;
        const data = this.state.data;
        if (data) {
            data.forEach((item, index) => {
                if (item._rowIndex === undefined) {
                    item._rowIndex = index;
                }
                if (item.id === undefined) {
                    item.id = UUID.v4();
                }
            });
            this.cloneData = data;
        }
        this.setState({
            headHeight
        });

        Events.on(document, 'mousedown', this.onDocumentMouseDown);
    }

    componentWillUnmount () {
        Events.off('mousedown', this.onDocumentMouseDown);
    }

    onDocumentMouseDown = (e) => {
        const targetEle = Dom.closest(e.target, '.cm-grid-cell');
        if (this.lastOpenEditCell && this.lastOpenEditCell._isMounted) {
            const lastEle = ReactDom.findDOMNode(this.lastOpenEditCell);
            if (lastEle != targetEle) {
                this.lastOpenEditCell.setEdit(false);
            }
        }
    }

    onScrollX = (scrollLeft) => {
        this.head.setScrollLeft(scrollLeft);
    }

    onResizeColumn = () => {
        this.setState({
            headHeight: this.state.headHeight
        });
        this.body.updateScrollSize();
    }

    onSort = (col, sort, sortType) => {
        if (!this.props.source && this.cloneData) {
            const data = this.cloneData;
            let name = col.getName();
            if (!sort) {
                name = '_rowIndex';
                sort = 'asc';
                sortType = null;
            }
            if (sort === 'asc') {
                data.sort((a, b) => {
                    return this.sortData(a, b, name, sortType);
                });
            }
            if (sort === 'desc') {
                data.sort((a, b) => {
                    return this.sortData(b, a, name, sortType);
                });
            }

            const newData = data.filter((item) => {
                if (item._show === undefined) {
                    return true;
                }
                return item._show;
            });
            this.setState({data: newData});
        }
        if (this.props.source) {
            if (sort) {
                if (!this.props.muiltiSort) {
                    this.sorts = {};
                }
                this.sorts[col.getName()] = sort;
            } else {
                delete this.sorts[col.getName()];
            }

            this.refresh(true);
        }
    }

    sortData (a, b, name, sortType) {
        if (sortType === 'string') {
            return a[name].localeCompare(b[name]);
        } else {
            let aVal = a[name];
            if (aVal && aVal.replace) {
                aVal = parseFloat(aVal.replace(/[^0-9\.]+/g, ''));
            }
            let bVal = b[name];
            if (bVal && bVal.replace) {
                bVal = parseFloat(bVal.replace(/[^0-9\.]+/g, ''));
            }
            return aVal - bVal;
        }
    }

    onPageNumChange = (pageNum, pageSize) => {
        if (this.props.source === 'dynamic') {
            this.getRemoteData(pageNum, pageSize);
        } else {
            this.setState({
                pageNum,
                pageSize
            });
        }

        if (this.body && this.body.resetScroll) {
            this.body.resetScroll();
        }
    }

    async getRemoteData (pageNum, pageSize, conditionChange) {
        let data = this.state.data;
        const start = (pageNum - 1) * pageSize;
        if (conditionChange) {
            data = null;
        }
        if (!data || !data[start]) {
            const ret = await this.getDynamicData(pageNum, pageSize);
            
            if (!data) {
                data = [];
            }
            const start = (ret.pageNum - 1) * ret.pageSize;
            const end = ret.pageNum * ret.pageSize - 1;
            let index = 0;
            for (let i = start; i <= end; i++) {
                data[i] = ret.data[index];
                index++;
            }
            
            this.setState({
                data,
                pageNum: ret.pageNum,
                pageSize: ret.pageSize,
                total: ret.total
            });
            this.pagination.update({
                current: ret.pageNum,
                pageSize: ret.pageSize,
                total: ret.total
            });
        } else {
            this.setState({
                pageNum,
                pageSize
            });
        }
    }

    async getDynamicData (pageNum, pageSize) {
        const sort = [];
        for (const key in this.sorts) {
            if (this.sorts[key]) {
                sort.push(`${key} ${this.sorts[key]}`);
            }
        }

        const params = {
            pageNum,
            pageSize,
            filters: JSON.stringify(this.filters)
        };
        if (sort.length) {
            params['sort'] = sort.join(',');
        }
        const ret = await fetch(this.props.action, params);
        return ret;
    }

    componentWillMount () {
        this.onPageNumChange(this.state.pageNum, this.state.pageSize);
    }

    onMenuSelect = (item) => {
        const target = Dom.closest(this.contextmenu.getTrigger(), '.cm-grid-cell');
        const row = target.getAttribute('data-row');
        const cell = target.getAttribute('data-cell');

        const rowData = this.state.data[row];
        const col = this.props.columns[cell];
        const cellData = rowData ? rowData[col.name] : undefined;

        if (this.props.onMenuSelect) {
            this.props.onMenuSelect(item, row, cell, rowData, cellData);
        }
    }

    /**
     * 刷新当页数据
     */
    refresh (conditionChange) {
        if (this.props.source === 'dynamic') {
            this.getRemoteData(this.pagination.state.currrent, this.pagination.state.pageSize, conditionChange);
        } else {
            this.setState({
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
        }
    }

    onFilter = (vals, column) => {
        if (this.props.source === 'dynamic') {
            if (vals) {
                this.filters[column.name] = vals;
            } else {
                delete this.filters[column.name];
            }

            this.refresh(true);
        } else {
            const data = this.cloneData;
            const newData = data.filter((item) => {
                if (column.onFilter) {
                    const show = column.onFilter(vals, item);
                    item._show = show;
                    return show;
                }
                return true;
            });

            this.setState({data: newData}, () => {
                if (this.props.smart) {
                    this.body.updateSpaceSize();
                }
                this.pagination ? this.pagination.update({
                    current: this.pagination.state.current,
                    total: newData.length
                }) : null;
            });
        }
    }

    /**
     * 重置高度
     */
    resetHeight = (bodyHeight) => {
        const headerHeight = ReactDom.findDOMNode(this.head).getBoundingClientRect().height;
        const footerHeight = this.pagination ? ReactDom.findDOMNode(this.pageWrap).getBoundingClientRect().height : 0;
        console.log(bodyHeight, headerHeight, footerHeight);
        this.wrap.style.height = `${bodyHeight + headerHeight + footerHeight + 2}px`;
    }

    /**
     * 复选框全选
     */
    onCheckedAll = (checked) => {
        if (!this.props.source) {
            const data = this.state.data;
            data.forEach((item) => {
                if (!item._disabled) {
                    item._checked = checked;
                }
            });
            this.setState({data});
        } else {
            this.body.checkAllRows(checked);
        }
    }

    onCheckedRow = (checked) => {
        if (!checked) {
            this.head.setChecked(false);
        } else {
            let allChecked = true;
            if (this.body.isAllChecked) {
                allChecked = this.body.isAllChecked();
                this.head.setChecked(allChecked);
            }
        }
    }

    getCheckedRows () {
        let data = this.state.data;
        data = data.filter((item) => {
            return item._checked;
        });
        return data;
    }

    /**
     * 添加行并更新大小和分页信息
     * @param {*} row 
     */
    addRow (row) {
        const data = this.state.data;
        row._rowIndex = 0;
        data.unshift(row);
        if (data !== this.cloneData) {
            this.cloneData.unshift(row);
        }
        this.cloneData.forEach((item) => {
            item._rowIndex = item._rowIndex + 1;
        });

        this.setState({data, pageNum: 1}, () => {
            if (this.props.smart) {
                this.body.updateSpaceSize();
            }
            this.pagination ? this.pagination.update({
                current: 1,
                total: data.length
            }) : null;
        });
        this.head.setChecked(false);
    }

    /**
     * 批量删除行
     * @param {*} rows 
     */
    removeRows (rows) {
        let data = this.state.data;
        if (data !== this.cloneData) {
            this.cloneData = this.cloneData.filter((item) => {
                return !rows.includes(item);
            });
        }
        data = data.filter((item) => {
            return !rows.includes(item);
        });
        this.setState({data}, () => {
            if (this.props.smart) {
                this.body.updateSpaceSize();
            }
            this.pagination ? this.pagination.update({
                current: 1,
                total: data.length
            }) : null;
        });
        this.head.setChecked(false);
    }

    onOpenEdit = (cell) => {
        if (this.lastOpenEditCell && this.lastOpenEditCell !== cell) {
            this.lastOpenEditCell.setEdit(false);
        }
        this.lastOpenEditCell = cell;
    } 

    render () {
        const {className, style, border, total, pageSize, pageNum, selectMode, smart} = this.props;
        const clazzName = classNames('cm-grid-wrap', className, {
            'cm-grid-border': border,
            'cm-grid-has-pagination': !smart,
            'cm-grid-cell-selectable': selectMode === 'cell'
        });

        const totalSize = this.props.source === 'dynamic' ? total : this.state.data.length;

        const BodyComp = smart ? SmartBody : Body;
        return (
            <div className={clazzName} style={style} ref={(f) => this.wrap = f}>
                <div className='cm-grid-box'>
                    <Head columns={this.props.columns} ref={(f) => this.head = f}
                        onResizeColumn={this.onResizeColumn}
                        onSort={this.onSort}
                        onFilter={this.onFilter}
                        muiltiSort={this.props.muiltiSort}
                        source={this.props.source}
                        onCheckedAll={this.onCheckedAll}
                    />
                    {this.state.data ? <BodyComp 
                        columns={this.props.columns}
                        ref={(f) => this.body = f}
                        data={this.state.data}
                        total={totalSize}
                        source={this.props.source}
                        selectMode={this.props.selectMode}
                        pageSize={this.state.pageSize}
                        pageNum={this.state.pageNum}
                        headHeight={this.state.headHeight}
                        onScrollX={this.onScrollX}
                        onSelectRow={this.props.onSelectRow}
                        autoHeight={this.props.autoHeight}
                        resetHeight={this.resetHeight}
                        onCheckedRow={this.onCheckedRow}
                        onOpenEdit={this.onOpenEdit}
                        editable={this.props.editable}
                        onCellChange={this.props.onCellChange}
                    ></BodyComp>
                        : null
                    }
                </div>
                {smart ? null : <div className='cm-grid-pagination' ref={(f) => this.pageWrap = f}>
                    <Pagination ref={(f) => this.pagination = f} total={totalSize} pageSize={pageSize} current={pageNum}
                        onChange={this.onPageNumChange}
                    />
                </div>}

                {this.props.contextmenu ? <ContextMenu ref={(f) => this.contextmenu = f} onSelect={this.onMenuSelect} overlay={this.props.contextmenu} target='.cm-grid-cell'/> : null}
            </div>
        );
    }
}
export default Grid;
