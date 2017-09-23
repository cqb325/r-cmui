import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import CheckBox from '../CheckBox/index';

/**
 * Column 类
 * @class Column
 * @extend BaseComponent
 */
class Column extends BaseComponent{
    static displayName = 'Column';

    static defaultProps = {
        sortType: null
    };

    constructor(props){
        super(props);

        this.addState({
            sortType: props.sortType
        });
    }

    /**
     * 全选或全不选
     * @param  {[type]} value   [description]
     * @param  {[type]} checked [description]
     * @return {[type]}         [description]
     */
    onChecked = (value, checked)=>{
        if(this.props.onChecked){
            this.props.onChecked(checked);
        }
    }

    /**
     * 勾选选择
     * @param  {[type]} checked [description]
     * @return {[type]}         [description]
     */
    check(checked){
        if(this.refs.checkbox){
            this.refs.checkbox.setChecked(checked);
        }
    }

    /**
     * 是否选中
     * @return 是否选中 true/false 
     */
    isChecked(){
        return this.refs.checkbox.isChecked();
    }

    /**
     * 获取排序方式
     * @returns 
     * @memberof Column
     */
    getSortType(){
        return this.state.sortType;
    }

    /**
     * 获取name
     * @return {String} name值
     */
    getName(){
        return this.props.name;
    }

    /**
     * 获取checkbox对象
     * @returns 
     * @memberof Column
     */
    getCheckBox(){
        return this.refs.checkbox;
    }

    /**
     * 排序
     * @param  {[type]} column [description]
     * @return {[type]}        [description]
     */
    sort = ()=>{
        let type = this.state.sortType;
        if (!type){
            type = 'asc';
        } else if (type === 'asc'){
            type = 'desc';
        } else {
            type = null;
        }
        this.setState({
            sortType: type
        });

        if(this.props.onSort){
            this.props.onSort(this, type);
        }
    }

    resetSort(){
        this.setState({
            sortType: null
        });
    }

    render(){
        let {hide, className, style, type, text, sort, width, name} = this.props;
        if(hide){
            style = Object.assign({
                display: 'none'
            }, style);
        }
        
        if (type === 'checkbox') {
            text = <CheckBox ref='checkbox' checked={false} onChange={this.onChecked} />;
            className = classNames(className, 'cm-table-col-checkbox');
        } 
        if (type === 'index') {
            className = classNames(className, 'cm-table-col-index');
        }
        let sortEle = null;
        if (sort) {
            let sortClassName = classNames('cm-table-sort', {
                [`cm-table-sort-${this.state.sortType}`]: this.state.sortType
            });
            sortEle = <span className={sortClassName} onClick={this.sort} />;
        }

        return (
            <th 
                className={className}
                width={width}
                style={style}
                name={name}>
                {text}
                {sortEle}
            </th>
        );
    }
}

export default Column;
