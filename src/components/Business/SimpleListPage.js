import React from 'react';
import Table from '../Table';
import Pagination from '../Pagination';
import Dom from '../utils/Dom';
import Events from '../utils/Events';
import fetch from '../utils/fetch';

class SimpleListPage extends React.Component{
    constructor(props){
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
    getSearchParams(page, pageSize){
        let params = {
            pageNum: page,
            pageSize: pageSize
        };

        let sort = [];
        for(let key in this.sort){
            if(this.sort[key]){
                sort.push(key + ' '+ this.sort[key]);
            }
        }
        if(sort.length){
            params['sort'] = sort.join(',');
        }

        let searchClazz = this.props.searchClass || 'searchItem';
        let doms = Dom.queryAll('.' + searchClazz);
        if(doms && doms.length){
            let els = Dom.dom(doms);
            els.each((el)=>{
                let name = el.attr('name');
                let value = el.value();

                if(el.attr('type') === 'radio'){
                    value = Dom.queryAll('input[name=\''+name+'\']:checked').value;
                }
                if(value != '') {
                    params[name] = value;
                }
            });
        }

        if(this.props.searchParams){
            params = Object.assign(params, this.props.searchParams);
        }

        return params;
    }

    search = async (page, pageSize)=>{
        let ret = await fetch(this.props.action, this.getSearchParams(page, pageSize), 'GET', (error)=>{
            console.log('get Table Data error!', error);
        });
        if(ret){
            this.refs.table.setData(ret.data);
            if(this.refs.pagination) {
                this.refs.pagination.update({total: ret.total, current: ret.pageNum, pageSize: ret.pageSize});
            }
            if(this.props.afterRequest){
                this.props.afterRequest(ret.data);
            }
        }
    }

    componentDidMount(){
        this.search(1, 10);
        let searchBtn;
        if(this.props.searchBtn && typeof this.props.searchBtn === 'function'){
            searchBtn = this.props.searchBtn();
        }else{
            searchBtn = Dom.query(this.props.searchBtn || '#search-btn');
        }
        if(searchBtn){
            if(typeof searchBtn === 'string'){
                Events.on(searchBtn, 'click', ()=>{
                    let pageSize = 10;
                    if(this.refs.pagination) {
                        pageSize = this.refs.pagination.state.pageSize;
                    }
                    this.search(1, pageSize);
                });
            }else{
                searchBtn.on('click', ()=>{
                    let pageSize = 10;
                    if(this.refs.pagination) {
                        pageSize = this.refs.pagination.state.pageSize;
                    }
                    this.search(1, pageSize);
                });
            }
        }
    }

    refresh(){
        let pageSize = 10;
        let current = 1;
        if(this.refs.pagination) {
            pageSize = this.refs.pagination.state.pageSize;
            current = this.refs.pagination.state.current;
        }
        this.search(current, pageSize);
    }

    getData(){
        return this.refs.table.getData();
    }

    setData(data){
        this.refs.table.setData(data);
    }

    getTable(){
        return this.refs.table;
    }

    checkRows(ids){
        ids.forEach(function(id){
            this.checkRow(id);
        }, this);
    }

    checkRow(field, value){
        this.refs.table.checkRow(field, value);
    }

    sortColumn = (column, type)=>{
        this.sort[column.name] = type;
        this.refresh();
    }

    render(){
        return (
            <div>
                <Table ref="table" columns={this.props.columns} onSort={this.sortColumn} data={this.props.data || []} bordered hover striped />

                <div className="cm-row">
                    {
                        this.props.pagination ? <Pagination className="pull-right" ref="pagination" current={1} pageSize={10} total={0} onChange={this.search} onShowSizeChange={this.search} /> : null
                    }
                </div>
            </div>
        );
    }
}

export default SimpleListPage;
