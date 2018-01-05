import React from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Head from './Head';
import Body from './Body';
import SmartBody from './SmartBody';
import Pagination from '../Pagination';
import fetch from '../utils/fetch';
import './Grid.less';

class Grid extends React.Component {
    displayName = 'Grid';

    state = {
        headHeight: 0,
        pageNum: 1,
        total: this.props.total,
        pageSize: this.props.pageSize || 10,
        data: this.props.data
    };

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
        onSelectRow: PropTypes.func
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
            });
        }
        this.setState({
            headHeight
        });
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
        if (!this.props.source && this.state.data) {
            const data = this.state.data;
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

            this.setState(data);
        }
    }

    sortData (a, b, name, sortType) {
        if (sortType === 'string') {
            return a[name].localeCompare(b[name]);
        } else {
            let aVal = a[name];
            if (aVal.replace) {
                aVal = parseFloat(aVal.replace(/[^0-9\.]+/g, ''));
            }
            let bVal = b[name];
            if (bVal.replace) {
                bVal = parseFloat(bVal.replace(/[^0-9\.]+/g, ''));
            }
            return aVal - bVal;
        }
    }

    onPageNumChange = async (pageNum, pageSize) => {
        if (this.props.source === 'dynamic') {
            let data = this.state.data;
            const start = (pageNum - 1) * pageSize;
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
        } else {
            this.setState({
                pageNum,
                pageSize
            });
        }
    }

    async getDynamicData (pageNum, pageSize) {
        const params = {
            pageNum,
            pageSize
        };
        const ret = await fetch(this.props.action, params);
        return ret;
    }

    componentWillMount () {
        this.onPageNumChange(this.state.pageNum, this.state.pageSize);
    }

    render () {
        const {className, style, border, total, pageSize, pageNum, selectMode, smart} = this.props;
        const clazzName = classNames('cm-grid-wrap', className, {
            'cm-grid-border': border,
            'cm-grid-cell-selectable': selectMode === 'cell'
        });

        const BodyComp = smart ? SmartBody : Body;
        return (
            <div className={clazzName} style={style}>
                <div className='cm-grid-box'>
                    <Head columns={this.props.columns} ref={(f) => this.head = f}
                        onResizeColumn={this.onResizeColumn}
                        onSort={this.onSort}
                    />
                    {this.state.data ? <BodyComp 
                        columns={this.props.columns}
                        ref={(f) => this.body = f}
                        data={this.state.data}
                        total={this.state.total}
                        selectMode={this.props.selectMode}
                        pageSize={this.state.pageSize}
                        pageNum={this.state.pageNum}
                        headHeight={this.state.headHeight}
                        onScrollX={this.onScrollX}
                        onSelectRow={this.props.onSelectRow}
                    ></BodyComp>
                        : null
                    }
                </div>
                {smart ? null : <div className='cm-grid-pagination'>
                    <Pagination ref={(f) => this.pagination = f} total={total} pageSize={pageSize} current={pageNum}
                        onChange={this.onPageNumChange}
                    />
                </div>}
            </div>
        );
    }
}
export default Grid;
