import React from 'react';
import Table from '../Table';
import Pagination from '../Pagination';
import Dom from '../utils/Dom';
import Events from '../utils/Events';
import fetch from '../utils/fetch';
import Spin from '../Spin';
import PropTypes from 'prop-types';
const {SVGSpin} = Spin;

class SimpleListPage extends React.Component {
    displayName = 'SimpleListPage';

    static defaultProps = {
        displayInfo: true,
        min: false,
        pageSize: 10,
        bordered: true,
        pagination: false,
        theme: 'default'
    }

    static propTypes = {
        displayInfo: PropTypes.bool,
        min: PropTypes.bool,
        pagination: PropTypes.bool,
        bordered: PropTypes.bool,
        pageSize: PropTypes.number,
        theme: PropTypes.string,
        action: PropTypes.string,
        searchBtn: PropTypes.oneOfType([PropTypes.string,PropTypes.func]),
        searchParams: PropTypes.oneOfType([PropTypes.object,PropTypes.func]),
        afterRequest: PropTypes.func,
        condition: PropTypes.func
    }

    state = {
        spinning: false
    };

    constructor (props) {
        super(props);
        this.sort = {};
    }

    /**
     * 获取查询条件
     * @param {any} page 
     * @param {any} pageSize 
     * @returns 
     * @memberof SimpleListPage
     */
    getSearchParams (page, pageSize) {
        let params = {
            pageNum: page,
            pageSize
        };

        const sort = [];
        for (const key in this.sort) {
            if (this.sort[key]) {
                sort.push(`${key} ${this.sort[key]}`);
            }
        }
        if (sort.length) {
            params['sort'] = sort.join(',');
        }
        
        this.getParamsByClass(params);
        this.getParamsByConditionForm(params);

        if (this.props.searchParams) {
            if (typeof this.props.searchParams === 'function') {
                params = Object.assign(params, this.props.searchParams());
            } else {
                params = Object.assign(params, this.props.searchParams);
            }
        }

        return params;
    }

    /**
     * 根据className来获取查询参数
     * @param {*} params 
     */
    getParamsByClass (params) {
        const searchClazz = this.props.searchClass || 'searchItem';
        const doms = Dom.queryAll(`.${searchClazz}`);
        if (doms && doms.length) {
            const els = Dom.dom(doms);
            els.each((el) => {
                const name = el.attr('name');
                let value = el.value();

                if (el.attr('type') === 'radio') {
                    value = Dom.queryAll(`input[name='${name}']:checked`).value;
                }
                if (value != '') {
                    params[name] = value;
                }
            });
        }
    }

    /**
     * 根据form表单获取查询参数
     * @param {*} params 
     */
    getParamsByConditionForm (params) {
        if (this.form) {
            const ps = this.form.getFormParams();
            Object.assign(params, ps);
        }
    }

    /**
     * 查询
     */
    search = async (page, pageSize) => {
        this.setState({spinning: true});
        const ret = await fetch(this.props.action, this.getSearchParams(page, pageSize), 'GET', (error) => {
            console.log('get Table Data error!', error);
        });
        if (ret) {
            this.refs.table.setData(ret.data);
            if (this.refs.pagination) {
                this.refs.pagination.update({total: ret.total, current: ret.pageNum, pageSize: ret.pageSize});
            }
            
            this.setState({spinning: false});
            
            if (this.props.afterRequest) {
                this.props.afterRequest(ret.data);
            }
        }
    }

    clickSearch () {
        let pageSize = this.props.pageSize;
        if (this.refs.pagination) {
            pageSize = this.refs.pagination.state.pageSize;
        }
        this.search(1, pageSize);
    }

    componentDidMount () {
        this.search(1, this.props.pageSize);
        let searchBtn;
        if (this.props.searchBtn && typeof this.props.searchBtn === 'function') {
            searchBtn = this.props.searchBtn();
        } else {
            searchBtn = Dom.query(this.props.searchBtn || '#search-btn');
        }

        if (searchBtn) {
            if (typeof searchBtn === 'string') {
                Events.on(searchBtn, 'click', () => {
                    this.clickSearch();
                });
            } else {
                searchBtn.on('click', () => {
                    this.clickSearch();
                });
            }
        }


        if (this.props.condition) {
            if (typeof this.props.condition === 'function') {
                this.form = this.props.condition();
            } else {
                this.form = null;
                console.warning('condition 参数使用 function 参数');
            }
        }

        if (this.form) {
            if (this.form.displayName === 'Form') {
                this.form.on('onSubmit', () => {
                    this.clickSearch();
                    return false;
                });
            }
        }
    }

    refresh () {
        let pageSize = this.props.pageSize;
        let current = 1;
        if (this.refs.pagination) {
            pageSize = this.refs.pagination.state.pageSize;
            current = this.refs.pagination.state.current;
        }
        this.search(current, pageSize);
    }

    getData () {
        return this.refs.table.getData();
    }

    setData (data) {
        this.refs.table.setData(data);
    }

    getTable () {
        return this.refs.table;
    }
    
    getPagination () {
        return this.refs.pagination;
    }

    checkRows (ids) {
        ids.forEach(function (id) {
            this.checkRow(id);
        }, this);
    }

    checkRow (field, value) {
        this.refs.table.checkRow(field, value);
    }

    sortColumn = (column, type, sorts) => {
        this.sort = sorts;
        this.refresh();
    }

    render () {
        return (
            <SVGSpin spinning={this.state.spinning}>
                <Table ref='table' columns={this.props.columns} onSort={this.sortColumn} data={this.props.data || []} bordered={this.props.bordered} hover striped />

                <div className='cm-row'>
                    {
                        this.props.pagination ? <Pagination 
                            theme={this.props.theme}
                            min={this.props.min}
                            displayInfo={this.props.displayInfo}
                            className='pull-right'
                            ref='pagination'
                            current={1}
                            pageSize={this.props.pageSize}
                            total={0}
                            onChange={this.search}
                            onShowSizeChange={this.search} /> : null
                    }
                </div>
            </SVGSpin>
        );
    }
}

export default SimpleListPage;
