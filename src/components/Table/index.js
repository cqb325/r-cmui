/**
 * @author cqb 2016-04-20.
 * @module Table
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import UUID from '../utils/UUID';
import Header from './Header';
import Body from './Body';
import {List} from 'immutable';
import './Table.less';


/**
 * Table 类
 * @class Table
 * @extend BaseComponent
 */
class Table extends BaseComponent {
    static displayName = 'Table';

    static defaultProps = {
        data: [],
        sortMode: 'single'
    };

    constructor(props) {
        super(props);

        this.orignData = List(props.data).toJS();

        this.data = this._rebuildData(this.orignData);

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
        this.orignData = List(data).toJS();
        this.data = this._rebuildData(this.orignData);
        this._index = 1;
        this.setState({data: this.data});
        //有checkbox将头部的清空
        this.refs.header.check(false);
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
        let data = List(this.getData());
        let newData = data.push({
            key: row.id || UUID.v4(),
            data: row
        }).toJS();

        this.setState({data: newData});
        this.refreshHeaderCheckBox(null, false);
    }

    /**
     * 删除行
     * @param index
     */
    removeRow(index){
        let data = List(this.getData());
        let newData = data.delete(index).toJS();
        this.setState({data: newData}, ()=>{
            this.refreshHeaderCheckBox(null, true);
        });
    }

    /**
     * 删除行
     * @param field
     * @param value
     */
    removeRows(field, value){
        let data = List(this.getData());
        let newData = data.filter((item)=>{
            return item.data[field] !== value;
        }).toJS();
        this.setState({data: newData}, ()=>{
            this.refreshHeaderCheckBox(null, true);
        });
    }

    /**
     * 重置表格数据
     * @method resetData
     * @param data {Object} {header: [], data: []}
     */
    resetData(data){
        if(data.data){
            this.orignData = List(data.data).toJS();
            this.data = this._rebuildData(this.orignData);
            this._index = 1;
            this.setState({columns: data.columns, data: this.data});
            //有checkbox将头部的清空
            this.refs.header.check(false);
        }
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
     * @param  {[type]} sorts  [description]
     * @return {[type]}        [description]
     */
    onSort(column, type, sorts){
        if (this.props.onSort) {
            this.props.onSort(column, type, sorts);
        }
        this.emit('sort', column, type, sorts);
    }

    render(){
        let className = classNames('cm-table', this.props.className, {
            'table-bordered': this.props.bordered,
            'table-striped': this.props.striped,
            'table-hover': this.props.hover
        });
        return (
            <div className="table-responsive">
                <table className={className} style={this.props.style}>
                    <Header sortMode={this.props.sortMode} ref="header" columns={this.state.columns} table={this} />
                    <Body ref="body" data={this.state.data} columns={this.state.columns} table={this} />
                </table>
            </div>
        );
    }
}


Table.Header = Header;

Table.Body = Body;


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

export default Table;
