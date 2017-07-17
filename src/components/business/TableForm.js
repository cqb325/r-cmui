import React from 'react';
import BaseComponent from '../core/BaseComponent';
import FormControl from '../FormControl';
import Table from '../Table';
import UUID from '../utils/UUID';

class TableForm extends BaseComponent{
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };

        this.items = [];
    }

    /**
     * 创建table使用的column
     * @param columns
     */
    buildColumns(columns){
        if (columns) {
            columns.forEach((column) => {
                if (column.type) {
                    this.buildColumn(column);
                }
            });
        }
    }

    /**
     * 某项change事件回调
     * @param col
     * @param items
     * @param name
     * @param value
     * @param selectItem
     */
    onChange(col, items, name, value, selectItem){
        if (this.props.onChange) {
            this.props.onChange(name, value, col, items, selectItem);
        }
    }

    /**
     * 创建列
     * @param column
     */
    buildColumn(column){
        let scope = this;
        column.format = function(value, col){
            let itemProps = Object.assign({}, column.props || {});
            scope.mergeProps(itemProps, column, ['rules', 'messages', 'name']);
            itemProps.value = value || itemProps.defaultValue || '';
            return (
                <FormControl
                    ref={(ref)=>{
                        let refs = scope.getLastRefs();
                        if (refs) {
                            refs[column.name] = ref;
                        }
                    }}
                    onChange={scope.onChange.bind(scope, col, scope.getLastRefs(), itemProps.name)}
                    type={column.type} {...itemProps}
                />
            );
        };
    }

    /**
     *
     * @param target
     * @param source
     * @param props
     */
    mergeProps(target, source, props){
        if (props) {
            props.forEach(function(prop){
                if (source[prop] !== undefined) {
                    target[prop] = source[prop];
                }
            });
        }
    }

    /**
     * 获取最后的refs
     * @returns {*}
     */
    getLastRefs(){
        if (this.items.length) {
            return this.items[this.items.length - 1];
        } else {
            return null;
        }
    }

    /**
     * 添加一行表格
     * @param row
     */
    addRow(row){
        let rowItems = {};
        this.items.push(rowItems);
        if (row) {
            if (row.id === undefined) {
                row.id = UUID.v4();
            }
            this.refs.table.addRow(row);
            row.__rowItems = rowItems;
        } else {
            row = this.props.columns.map((column)=>{
                return {
                    [`${column.name}`]: column.defaultValue || ''
                };
            });
            row.id = UUID.v4();
            row.__rowItems = rowItems;
            this.refs.table.addRow(row);
        }
    }

    /**
     *
     * @param id
     */
    getRowData(id){
        let index = this.getIndexById(id);

        if (index != null) {
            if (index < this.items.length) {
                let items = this.items[index];
                let param = {};
                for (let field in items) {
                    if (items[field].getValue) {
                        param[field] = items[field].getValue();
                    }
                }
                return param;
            }
        }

        return null;
    }

    /**
     * 根据索引删除某一行
     * @param index
     */
    removeRow(index){
        this.items.splice(index, 1);
        this.refs.table.removeRow(index);
    }

    /**
     *
     * @param id
     */
    removeRowById(id){
        let index = this.getIndexById(id);
        if (index != null) {
            this.removeRow(index);
        }
    }

    /**
     *
     * @param id
     */
    getIndexById(id){
        let tableData = this.refs.table.getData();
        let index = null;
        for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].key === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    /**
     * 获取表格数据
     */
    getData(){
        return this.items.map((rowItems)=>{
            let param = {};
            for (let field in rowItems) {
                if (rowItems[field].getValue) {
                    param[field] = rowItems[field].getValue();
                }
            }
            return param;
        });
    }

    /**
     * 验证是否通过
     */
    isValid(){
        let valid = true;
        for (let i = 0; i < this.items.length; i++) {
            let rowItems = this.items[i];
            for (let field in rowItems) {
                if (rowItems[field].isFormItem() && rowItems[field].check() === false) {
                    valid = false;
                    return valid;
                }
            }
        }

        return valid;
    }

    render(){
        let {columns, className, bordered, hover, striped} = this.props;
        this.buildColumns(columns);
        return (
            <Table ref='table' columns={columns} data={this.state.data}
                className={className} bordered={bordered} hover={hover} striped={striped} />
        );
    }
}

export default TableForm;
