/**
 * @author cqb 2016-04-20.
 * @module Table
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import moment from 'moment';
import Dom from './utils/Dom';
import UUID from './utils/UUID';
import CheckBox from './CheckBox';
import shallowEqual from './utils/shallowEqual';


/**
 * Table 类
 * @class Table
 * @extend BaseComponent
 */
class Table extends BaseComponent {
    constructor(props) {
        super(props);

        this.data = this._rebuildData(props.data);

        this.addState({
            data: this.data || [],
            columns: props.columns
        });

        this.checkboxes = {};

        this._index = 1;
    }

    _rebuildData(data){
        if (data && data.length){
            return data.map((item)=>{
                return {
                    key: item.id || UUID.v4(),
                    data: item
                };
            });
        }
        return data;
    }

    /**
     * 设置数据
     * @method setData
     * @param data {Array} 表体数据
     */
    setData(data){
        let newData = this._rebuildData(data);
        this._index = 1;
        this.setState({data: newData});
    }

    /**
     * 获取表格数据
     * @returns {*}
     */
    getData(){
        return this.state.data;
    }

    /**
     * 获取表头信息
     */
    getColumns(){
        return this.state.columns;
    }

    /**
     * 添加行
     * @param row
     */
    addRow(row){
        let data = this.getData();
        data.push({
            key: row.id || UUID.v4(),
            data: row
        });
        this.setState({data: data});
    }

    /**
     * 删除行
     * @param index
     */
    removeRow(index){
        let data = this.getData();
        if (index >= 0 && index < data.length){
            data.splice(index, 1);
            this.setState({data: data});
        }
    }

    /**
     * 删除行
     * @param field
     * @param value
     */
    removeRows(field, value){
        let data = this.getData();
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].data[field] == value){
                data.splice(i, 1);
            }
        }
        this.setState({data: data});
    }

    /**
     * 重置表格数据
     * @method resetData
     * @param data {Object} {header: [], data: []}
     */
    resetData(data){
        let newData = this._rebuildData(data.data);
        this._index = 1;
        this.setState({columns: data.columns, data: newData});
    }

    /**
     * 勾选所有的
     * @param checked
     */
    checkedAll(checked){
        for (let key in this.checkboxes) {
            let row = this.checkboxes[key]['row'];
            row.check(checked);
        }
    }

    /**
     * 根据属性勾选行
     * @param field
     * @param value
     */
    checkRow(field, value){
        for (let key in this.checkboxes) {
            let row = this.checkboxes[key]['row'];
            if (row.getData()[field] == value){
                row.check(true);
            }
        }
    }


    /**
     * 根据属性取消勾选行
     * @param field
     * @param value
     */
    unCheckRow(field, value){
        for (let key in this.checkboxes) {
            let row = this.checkboxes[key]['row'];
            if (row.getData()[field] == value){
                row.check(false);
            }
        }
    }

    /**
     * 绑定checkbox
     * @param key
     * @param data
     */
    bindCheckBox(key, data){
        this.checkboxes[key] = data;
    }

    /**
     * 删除checkbox
     * @param key
     */
    unBindCheckBox(key){
        delete this.checkboxes[key];
    }

    /**
     * 获取所有勾选的数据
     */
    getAllChecked(){
        let data = []; let rows = [];
        for (let key in this.checkboxes) {
            let row = this.checkboxes[key]['row'];
            if (row.isChecked()){
                data.push(row.getData());
                rows.push(row);
            }
        }

        return {
            data: data,
            rows: rows
        };
    }

    /**
     * 刷新表头的checkbox
     * @param key
     * @param checked
     */
    refreshHeaderCheckBox(key, checked){
        if (!checked) {
            this.refs.header.check(checked);
        } else {
            let isAllChecked = true;
            for (let key in this.checkboxes) {
                let row = this.checkboxes[key]['row'];
                if (!row.isChecked()) {
                    isAllChecked = false;
                    break;
                }
            }

            this.refs.header.check(isAllChecked);
        }
    }

    /**
     * 排序回调
     * @param  {[type]} column [description]
     * @param  {[type]} type   [description]
     * @return {[type]}        [description]
     */
    onSort(column, type){
        if (this.props.onSort) {
            this.props.onSort(column, type);
        }
        this.emit('sort', column, type);
    }

    render(){
        let className = classNames('cm-table', this.props.className, {
            'table-bordered': this.props.bordered,
            'table-striped': this.props.striped,
            'table-hover': this.props.hover
        });
        return (
            <div className='table-responsive'>
                <table className={className} style={this.props.style}>
                    <Header ref='header' columns={this.state.columns} table={this} />
                    <Body ref='body' data={this.state.data} columns={this.state.columns} table={this} />
                </table>
            </div>
        );
    }
}

/**
 * Header 类
 * @class Header
 * @extend BaseComponent
 */
class Header extends BaseComponent{
    constructor(props){
        super(props);

        this.addState({
            columns: props.columns || []
        });
    }

    componentWillReceiveProps(nextProps){
        if (!shallowEqual(nextProps.columns, this.state.columns)) {
            this.setState({
                columns: nextProps.columns
            });
        }
    }

    checkedAll(value, checked){
        this.props.table.checkedAll(checked);
    }

    check(checked){
        this.refs.checkbox.updateState({
            checked
        });
    }

    sort(column){
        let columns = this.state.columns;
        if (!column.__sort){
            column.__sort = 'asc';
        } else if (column.__sort === 'asc'){
            column.__sort = 'desc';
        } else {
            column.__sort = undefined;
        }
        this.setState({
            columns
        });
        this.props.table.onSort(column, column.__sort);
    }

    renderColumns(){
        let columns = this.state.columns;

        return columns.map((column, index)=>{
            if (columns.hide){
                return null;
            }
            let text = null;
            let className = classNames(column.className);
            if (column.type === 'checkbox'){
                text = <CheckBox ref='checkbox' checked={false} onChange={this.checkedAll.bind(this)} />;
                className = classNames(className, 'cm-table-col-checkbox');
            } else if (column.type === 'index'){
                className = classNames(className, 'cm-table-col-index');
                text = column.text;
            } else {
                text = column.text;
            }
            let sortEle = null;
            if (column.sort) {
                let sortClassName = classNames('cm-table-sort', {
                    [`cm-table-sort-${column.__sort}`]: column.__sort
                });
                sortEle = <span className={sortClassName} onClick={this.sort.bind(this, column)} />;
            }
            return <th key={index} className={className} width={column.width} style={column.style}
                name={column.name}>{text}{sortEle}
            </th>;
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

Table.Header = Header;


/**
 * Body 类
 * @class Body
 * @extend BaseComponent
 */
class Body extends BaseComponent{
    constructor(props){
        super(props);

        this.addState({
            data: props.data || []
        });
    }

    componentWillReceiveProps(nextProps){
        if (!shallowEqual(nextProps.data, this.state.data)) {
            this.setState({
                data: nextProps.data
            });
        }
    }

    renderData(){
        let data = this.state.data;

        return data.map((row, index)=>{
            return <Row row={index} data={row.data} key={row.key} identify={row.key}
                columns={this.props.columns} table={this.props.table} />;
        });
    }

    render(){
        return (
            <tbody>
                {this.renderData()}
            </tbody>
        );
    }
}

Table.Body = Body;


/**
 * Row 类
 * @class Row
 * @extend BaseComponent
 */
class Row extends BaseComponent{
    constructor(props){
        super(props);

        this.addState({
            data: props.data || []
        });

        this.identify = props.identify || UUID.v4();
    }

    componentWillReceiveProps(nextProps){
        if (!shallowEqual(nextProps.data, this.state.data)) {
            this.setState({
                data: nextProps.data
            });
        }
    }

    checkRow(value, checked){
        window.setTimeout(()=>{
            this.props.table.refreshHeaderCheckBox(this.identify, checked);
        }, 0);
    }

    check(checked){
        this.refs.checkbox.updateState({checked});
    }

    isChecked(){
        if (this.refs.checkbox) {
            return this.refs.checkbox.state.checked;
        } else {
            return false;
        }
    }

    getData(){
        return this.state.data;
    }

    componentDidMount(){
        if (this.refs.checkbox){
            this.props.table.bindCheckBox(this.identify, {checkbox: this.refs.checkbox, row: this});
        }
    }

    componentWillUnmount(){
        if (this.refs.checkbox){
            this.props.table.unBindCheckBox(this.identify);
        }
    }

    renderData(){
        let data = this.state.data;
        let table = this.props.table;

        let columns = this.props.columns || [];
        return columns.map((col, index)=>{
            if (col.hide){
                return null;
            }
            if (col.type === 'checkbox'){
                return <td data-row={this.props.row} data-col={index} key={index}>
                    <CheckBox ref='checkbox' checked={false} onChange={this.checkRow.bind(this)} />
                </td>;
            }
            if (col.type === 'index'){
                return <td data-row={this.props.row} data-col={index} key={index}>{table._index++}</td>;
            }
            let text = data[col.name];
            text = this.formatData(text, col, data);

            let tip = '';
            if (React.isValidElement(text)) {
                if (col.tip){
                    text = text.props.children;
                }
                return (
                    <td data-row={this.props.row} data-col={index} key={index} title={tip}>
                        {text}
                    </td>
                );
            }

            if (text instanceof Array){
                text = text.join('');
                col.tip = false;
            }

            if (col.tip){
                tip = text + '';
                if (tip.charAt(0) === '<'){
                    tip = Dom.dom(tip).text();
                }
            }

            return <td data-row={this.props.row} data-col={index}
                key={index} dangerouslySetInnerHTML={{__html: text}} title={tip} />;
        });
    }

    /**
     * 数据格式化
     * @param text
     * @param col
     * @param data
     * @returns {*}
     */
    formatData(text, col, data){
        if (col.format){
            let formatFun;
            if (typeof col.format === 'function'){
                formatFun = col.format;
            } else if (typeof col.format === 'string'){
                formatFun = Table.Formats[col.format];
            }
            if (formatFun) {
                text = formatFun(text, col, data);
            }
        }

        return text;
    }

    render(){
        return (
            <tr data-row={this.props.row}>
                {this.renderData()}
            </tr>
        );
    }
}

Table.Row = Row;

Table.propTypes = {
    /**
     * 表中数据
     * @attribute data
     * @type {Array}
     */
    data: PropTypes.array,
    /**
     * 表头定义
     * @attribute header
     * @type {Array}
     */
    header: PropTypes.array,
    /**
     * 宽度
     * @attribute width
     * @type {String}
     * @default auto/100%
     */
    width: PropTypes.string,
    /**
     * 高度
     * @attribute height
     * @type {String}
     * @default auto
     */
    height: PropTypes.string,
    /**
     * 是否显示边框
     * @attribute bordered
     * @type {Boolean}
     * @default false
     */
    bordered: PropTypes.bool,
    /**
     * 是否交替显示背景
     * @attribute striped
     * @type {Boolean}
     * @default false
     */
    striped: PropTypes.bool,
    /**
     * 鼠标滑过是否显示背景色
     * @attribute hover
     * @type {Boolean}
     * @default false
     */
    hover: PropTypes.bool
};


Table.Formats = {
    /**
     * 日期格式化
     * @param value
     * @param column
     * @param row
     * @returns {*}
     * @constructor
     */
    DateFormat: function(value){
        if (value) {
            return moment(value).format('YYYY-MM-DD');
        } else {
            return '';
        }
    },

    /**
     * 日期时间格式化
     * @param value
     * @param column
     * @param row
     * @returns {*}
     * @constructor
     */
    DateTimeFormat: function(value){
        if (value) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return '';
        }
    }
};

export default Table;
