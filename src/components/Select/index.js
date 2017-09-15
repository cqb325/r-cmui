/**
 * @author cqb 2016-04-29.
 * @module Select
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import Core from '../core/Core';
// import Ajax from '../core/Ajax';
import clickAway from '../utils/ClickAway';
import strings from '../utils/strings';
import Dom from '../utils/Dom';
// import FormControl from './FormControl';
import grids from '../utils/grids';
import {fromJS} from 'immutable';
const getGrid = grids.getGrid;
const substitute = strings.substitute;
import './Select.less';

class Option extends BaseComponent{
    static displayName = "Option";

    render(){
        let {active, html, children} = this.props;
        let className = classNames('cm-select-option', {
            'cm-select-option-active': active
        });

        return (
            <li className={className} onClick={this.props.onClick}>
                <a href='javascript:void(0)'>
                    {
                        html ? <span dangerouslySetInnerHTML={{__html: html}} /> : children
                    }
                </a>
            </li>
        );
    }
}

/**
 * Select 类
 * @class Select
 * @constructor
 * @extend BaseComponent
 */
class Select extends BaseComponent {
    static displayName = "Select";
    static defaultProps = {
        textField: 'text',
        valueField: 'id',
        sep: ','
    };

    static propTypes = {
        /**
         * 数据源
         * @attribute data
         * @type {Array/Object}
         */
        data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        /**
         * 默认选中的值
         * @attribute value
         * @type {String}
         */
        value: PropTypes.string,
        /**
         * 自定义class
         * @attribute className
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 禁用
         * @attribute disabled
         * @type {Boolean}
         */
        disabled: PropTypes.bool,
        /**
         * 多选状态
         * @attribute multi
         * @type {Boolean}
         */
        multi: PropTypes.bool,
        /**
         * 自定义样式
         * @attribute style
         * @type {Object}
         */
        style: PropTypes.object,
        /**
         * 显示字段
         * @attribute textField
         * @type {String}
         */
        textField: PropTypes.string,
        /**
         * 取值字段
         * @attribute valueField
         * @type {String}
         */
        valueField: PropTypes.string,
        /**
         * 请选择文字
         * @attribute choiceText
         * @type {String}
         */
        choiceText: PropTypes.string,
        /**
         * holder文字
         * @attribute placeholder
         * @type {String}
         */
        placeholder: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.selectedItems = {};
        this.sep = props.sep;
        this.orignData = props.data;

        let data = this._rebuildData(props.data, props.value, props.valueField);

        this.addState({
            value: props.value,
            active: false,
            data: data
        });
    }

    /**
     * 重置数据源
     * @method _rebuildData
     * @param data 原数据源
     * @param defaultValue 默认的值
     * @param valueField 默认的值字段
     * @returns {*}
     * @private
     */
    _rebuildData(data, defaultValue, valueField){
        if (!data) {
            return null;
        }
        //生成一个新的数据， 防止后续操作影响到改数据
        data = fromJS(data).toJS();

        let defaultValues = defaultValue ? (defaultValue + '').split(this.sep) : [];
        if (Core.isArray(data)) {
            let one = data[0];
            if (Core.isString(one)) {
                return data.map(function(item){
                    let option = {id: item, text: item};
                    for (let i in defaultValues) {
                        if (item == defaultValues[i]) {
                            this.selectedItems[item] = option;
                        }
                    }
                    return option;
                }, this);
            }
            if (Core.isObject(one)) {
                if (defaultValue !== undefined) {
                    data.forEach(function (item) {
                        for (let i in defaultValues) {
                            if (item[valueField] == defaultValues[i]) {
                                this.selectedItems[item[valueField]] = item;
                            }
                        }
                    }, this);
                }
                return data;
            }

            return null;
        }
        if (Core.isObject(data)) {
            let ret = [];
            for (var id in data) {
                let item = {id: id, text: data[id]};
                for (let i in defaultValues) {
                    if (id == defaultValues[i]) {
                        this.selectedItems[id] = item;
                    }
                }
                ret.push(item);
            }

            return ret;
        }

        return null;
    }

    /**
     * 渲染值域区域
     * @method _renderValues
     * @returns {XML}
     * @private
     */
    _renderValues(){
        let values = this.state.value ? (this.state.value + '').split(this.sep) : [];
        let html = [];
        let className = classNames('cm-select-value', {
            'cm-select-placeholder': !values.length && this.props.placeholder
        });
        if (values.length) {
            values.forEach((value) => {
                let item = this.selectedItems[value];

                let textField = this.props.textField;
                let label = item
                    ? item[textField]
                    : (this.props.placeholder ? this.props.placeholder + '&nbsp;' : '&nbsp;');

                let optionsTpl = this.props.optionsTpl;

                if (optionsTpl && item) {
                    html.push(substitute(optionsTpl, item));
                } else {
                    html.push(label);
                }
            });
        } else {
            html.push(this.props.placeholder ? this.props.placeholder + '&nbsp;' : '&nbsp;');
        }
        html = '<div class="cm-select-value-text">' + (html.join(this.sep) || '&nbsp;') + '</div>';

        html = html + '<input type="hidden" class="' + (this.props.className || '') + '" name="' +
            (this.props.name || '') + '" value="' + (this.state.value || '') + '">';


        return (<span className={className} dangerouslySetInnerHTML={{__html: html}} />);
    }

    _renderFilter(){
        return '';
    }

    /**
     * 选中选项
     * @method _selectItem
     * @param item 选中的选项
     * @private
     */
    _selectItem(item){
        let valueField = this.props.valueField;

        let value = null;
        if (!item) {
            if (!this.props.multi) {
                this.hideOptions();
            }
            this.selectedItems = {};
        } else {
            if (this.props.multi) {
                if (this.selectedItems[item[valueField]]) {
                    delete this.selectedItems[item[valueField]];
                } else {
                    this.selectedItems[item[valueField]] = item;
                }
                value = this.getSelectedValues();
            } else {
                value = item[valueField];
                this.selectedItems = {};
                this.selectedItems[value] = item;
                this.hideOptions();
            }
        }

        this.setState({
            value: value
        });

        if (this.props.onChange) {
            this.props.onChange(value, item);
        }

        this.emit('change', value, item);
    }

    /**
     * 获取选中的值
     * @method getSelectedValues
     * @returns {string}
     */
    getSelectedValues(){
        if (this.selectedItems) {
            let ret = [];
            for (let value in this.selectedItems) {
                ret.push(value);
            }
            return ret.join(this.sep);
        }
        return '';
    }

    getValue(){
        return this.getSelectedValues();
    }

    setValue(value){
        let valueField = this.props.valueField;
        let data = this.state.data;
        if (value === null || value === undefined || value === '') {
            this.selectedItems = {};
            this.setState({value});
        }
        if (value != undefined) {
            for (let i in data) {
                let item = data[i];
                let values = (value + '').split(this.sep);
                for (let j in values) {
                    if (item[valueField] == values[j]) {
                        this.selectedItems[values[j]] = item;
                    }
                }
            }
            this.setState({value});
        }
    }

    /**
     * 渲染选项
     * @method _renderOptions
     * @returns {*}
     * @private
     */
    _renderOptions(){
        let {textField, valueField, optionsTpl, choiceText, multi, hasEmptyOption} = this.props;

        let data = this.state.data;
        if (!data) {
            return '';
        }
        let ret = [];
        if (!multi && hasEmptyOption) {
            ret.push(<Option key={-1} onClick={this._selectItem.bind(this, null)}>{choiceText}</Option>);
        }
        data.forEach((item, index)=>{
            let text = item[textField];
            let value = item[valueField];

            let html = text;
            if (optionsTpl) {
                html = substitute(optionsTpl, item);
            }

            ret.push(<Option html={html}
                key={value}
                onClick={this._selectItem.bind(this, item)}
                active={!!this.selectedItems[value]}
            />);
        });

        return ret;
    }

    /**
     * ClickAway 点击别的地方的回调
     * @method componentClickAway
     */
    componentClickAway() {
        this.hideOptions();
    }

    /**
     * 显示下拉框
     * @method showOptions
     */
    showOptions = ()=>{
        if (this.props.readOnly || this.state.disabled) {
            return;
        }
        if (this.state.active && !this.props.multi) {
            this.hideOptions();
            return;
        }

        let options = ReactDOM.findDOMNode(this.refs.options);
        options.style.display = 'block';

        let container = Dom.closest(options, '.cm-select');
        let offset = Dom.getOuterHeight(options) + 5;
        let dropup = Dom.overView(container, offset);

        Dom.withoutTransition(container, () => {
            this.setState({ dropup });
        });

        this.bindClickAway();

        setTimeout(() => {
            this.setState({ active: true });
        }, 0);
    }

    /**
     * 隐藏下拉框
     * @method hideOptions
     */
    hideOptions = ()=>{
        this.setState({ active: false });
        let options = ReactDOM.findDOMNode(this.refs.options);

        this.unbindClickAway();

        let time = 500;
        if (this.isLtIE9()) {
            time = 0;
        }

        setTimeout(() => {
            if (this.state.active === false) {
                options.style.display = 'none';
            }
        }, time);
    }

    /**
     * 设置值
     * @method setData
     * @param data 新值
     * @param value 默认值
     */
    setData(data, value){
        let valueField = this.props.valueField;
        if (value !== undefined) {
            this.selectedItems = {};
        }
        let val = value === undefined ? this.state.value : value;
        this.data = data;
        data = this._rebuildData(data, val, valueField);
        this.setState({
            data: data,
            value: val
        });
    }

    /**
     * 添加选项
     * @param option
     */
    addOption(option){
        let data = this.state.data;
        data.push(option);
        this.setState({
            data: data
        });
    }

    /**
     * 删除选项
     * @param key
     * @param value
     */
    removeOption(key, value){
        let data = this.state.data;
        data.forEach((item, index)=>{
            if (item[key] === value) {
                data.splice(index, 1);
            }
        });

        this.setState({
            data: data
        });
    }

    componentWillMount(){
        if (this.props.url) {
            // let scope = this;
            // let valueField = this.props.valueField || 'id';
            // Ajax.get(this.props.url, {}, function(data){
            //     if (data) {
            //         data = scope._rebuildData(data, scope.props.value, valueField);
            //         scope.setState({
            //             data: data
            //         });
            //
            //         if (scope.props.onDataLoaded) {
            //             scope.props.onDataLoaded();
            //         }
            //         scope.emit('dataLoaded');
            //     }
            // });
        }
    }

    componentWillReceiveProps (nextProps) {
        let value = nextProps.value;
        if (value !== this.state.value) {
            this.setState({ value });
        }
    }

    render(){
        let {className, style, grid} = this.props;
        className = classNames('cm-select', getGrid(grid), {
            'cm-select-active': this.state.active,
            'cm-select-disabled': this.state.disabled,
            'cm-select-dropup': this.state.dropup,
            'cm-select-hasEmptyOption': this.props.hasEmptyOption
        });

        let text = this._renderValues();
        let filter = this._renderFilter();
        let options = this._renderOptions();
        return (
            <div className={className} style={style} onClick={this.showOptions}>
                {text}
                <span className='cm-select-cert' />
                <div className='cm-select-options-wrap'>
                    <div ref='options' className='cm-select-options'>
                        {filter}
                        <ul>{options}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

Select = clickAway(Select);

Select.Option = Option;

// FormControl.register(Select, 'select');

export default Select;
