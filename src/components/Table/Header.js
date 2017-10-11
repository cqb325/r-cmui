import React from 'react';
import BaseComponent from '../core/BaseComponent';
import Column from './Column';

/**
 * Header 类
 * @class Header
 * @extend BaseComponent
 */
class Header extends BaseComponent{
    static displayName = 'Header';

    static defaultProps = {
        columns: [],
        table: null,
        sortMode: 'single'
    };

    constructor(props){
        super(props);

        this.addState({
            columns: props.columns
        });

        this.columns = [];
        this.checkedColumn = null;
        this.sorts = {};
        this.lastSortColumn = null;
    }

    /**
     * 管理Column
     * @memberof Header
     */
    addColumn = (f)=>{
        this.columns.push(f);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.columns != this.props.columns && nextProps.columns != this.state.columns) {
            this.setState({
                columns: nextProps.columns
            });
        }
    }

    componentDidMount(){
        this.columns.forEach((col)=>{
            if(col.getCheckBox()){
                this.checkedColumn = col;
            }
        });
    }

    /**
     * 全选或全不选
     * @param  {[type]} value   [description]
     * @param  {[type]} checked [description]
     * @return {[type]}         [description]
     */
    checkedAll = (checked)=>{
        if(this.props.table){
            this.props.table.checkedAll(checked);
        }
    }

    /**
     * 勾选选择
     * @param  {[type]} checked [description]
     * @return {[type]}         [description]
     */
    check(checked){
        if(this.checkedColumn){
            this.checkedColumn.check(checked);
        }
    }

    /**
     * 排序
     * @param  {[type]} column [description]
     * @return {[type]}        [description]
     */
    sort = (column, type)=>{
        if(this.props.sortMode === 'single'){
            if(this.lastSortColumn && this.lastSortColumn != column){
                this.lastSortColumn.resetSort();
            }
            if(type){
                this.sorts = {
                    [column.getName()]: type
                };
                this.lastSortColumn = column;
            }else{
                this.sorts = {};
            }
        }else{
            if(type){
                this.sorts[column.getName()] = type;
            }else{
                delete this.sorts[column.getName()];
            }
        }
        if(this.props.table && this.props.table.onSort){
            this.props.table.onSort(column, column.__sort, this.sorts);
        }
    }

    /**
     * 渲染表头
     * @return {[type]} [description]
     */
    renderColumns(){
        let columns = this.state.columns;

        return columns.map((column)=>{
            return <Column ref={this.addColumn} key={column.name || column.type} {...column} onSort={this.sort} onChecked={this.checkedAll}/>;
        });
    }

    render(){
        return (
            <thead>
                <tr>
                    {this.renderColumns()}
                </tr>
            </thead>
        );
    }
}

export default Header;
