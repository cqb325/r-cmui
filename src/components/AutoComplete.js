/**
 * @author cqb 2016-04-29.
 * @module AutoComplete
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from './core/BaseComponent';
import Core from './Core';
import Ajax from './core/Ajax';
import clickAway from './utils/ClickAway';
import strings from './utils/strings';
import Dom from './utils/Dom';
const substitute = strings.substitute;
import grids from './utils/grids';
const getGrid = grids.getGrid;
import Input from './Input';
import FormControl from './FormControl';

/**
 * AutoComplete 类
 * @class AutoComplete
 * @constructor
 * @extend BaseComponent
 */
class AutoComplete extends BaseComponent {
    constructor(props) {
        super(props);

        this.selectedItems = {};
        let valueField = props.valueField || 'id';
        let data = this._rebuildData(props.data, props.value, valueField);
        this.data = data;

        this.addState({
            value: props.value,
            active: false,
            data: data
        });

        this.timer = null;

        this.showOptions = this.showOptions.bind(this);
        this.hideOptions = this.hideOptions.bind(this);
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
        if (Core.isArray(data)) {
            let one = data[0];
            if (Core.isString(one)) {
                return data.map(function(item){
                    let option = {id: item, text: item};
                    if (item == defaultValue) {
                        this.selectedItems[item] = option;
                    }
                    return option;
                });
            }
            if (Core.isObject(one)) {
                if (defaultValue != undefined) {
                    data.forEach(function (item) {
                        if (item[valueField] == defaultValue) {
                            this.selectedItems[defaultValue] = item;
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
                if (id == defaultValue) {
                    this.selectedItems[defaultValue] = item;
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
        let item = this.selectedItems[this.state.value];
        let textField = this.props.textField || 'text';
        let label = item ? item[textField] : (this.props.placeholder ? this.props.placeholder + '' : '');
        let className = classNames('cm-select-value', {
            placeholder: !item && this.props.placeholder
        });

        return (<Input type='text' className={className}
            name={this.props.name}
            value={label}
            trigger='change'
            onChange={(value)=>{
                if (this.timer) {
                    window.clearTimeout(this.timer);
                }
                this.timer = setTimeout(()=>{
                    this.filter(value);
                    this.timer = null;
                }, 200);
            }}
        />);
    }

    filter(value){
        if (this.props.filterurl) {
            let scope = this;
            Ajax.get(this.props.filterurl, {keyword: value}, function(data){
                if (data) {
                    scope.setState({data: data});
                }
            });
        } else {
            if (!this.data) {
                return;
            }
            var filtered = this.data.filter((item)=> {
                if (item.text.indexOf(value) != -1) {
                    return true;
                }

                return false;
            });

            this.setState({data: filtered});
        }

        this.showOptions();
    }

    /**
     * 选中选项
     * @method _selectItem
     * @param item 选中的选项
     * @private
     */
    _selectItem(item){
        let valueField = this.props.valueField || 'id';

        let value = null;
        if (!item) {
            if (!this.props.multi) {
                this.hideOptions();
            }
        } else {
            if (this.props.multi) {
                this.selectedItems[item[valueField]] = item;
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
            return ret.join(',');
        }
        return '';
    }

    getValue(){
        return this.getSelectedValues();
    }

    setValue(value){
        let valueField = this.props.valueField || 'id';
        let data = this.state.data;
        if (value == null || value == undefined || value == '') {
            this.selectedItems = {};
            this.setState({value});
        }
        if (value != undefined) {
            for (let i in data) {
                let item = data[i];
                if (item[valueField] == value) {
                    this.selectedItems[value] = item;
                    this.setState({value});
                    break;
                }
            }
        }
    }

    /**
     * 渲染选项
     * @method _renderOptions
     * @returns {*}
     * @private
     */
    _renderOptions(){
        let {textField, valueField, optionsTpl} = this.props;

        let data = this.state.data;
        if (!data) {
            return '';
        }
        let ret = [];
        if (!this.props.multi && this.props.hasEmptyOption) {
            ret.push(<li key={-1} onClick={this._selectItem.bind(this, null)}>
                <a href='javascript:void(0)'>
                    {this.props.choiceText || '--请选择--'}
                </a>
            </li>);
        }
        data.forEach(function(item, index){
            textField = textField || 'text';
            valueField = valueField || 'id';
            let text = item[textField];
            let value = item[valueField];
            let liClassName = classNames({
                active: !!this.selectedItems[value]
            });

            let html = text;
            if (optionsTpl) {
                html = substitute(optionsTpl, item);
            }
            ret.push(<li className={liClassName} key={index} onClick={this._selectItem.bind(this, item)}>
                <a href='javascript:void(0)'>
                    <span dangerouslySetInnerHTML={{__html: html}} />
                </a>
            </li>);
        }, this);

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
    showOptions(){
        if (this.props.readOnly || this.props.disabled) {
            return;
        }
        if (this.state.active) {
            // this.hideOptions();
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
    hideOptions(){
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
     */
    setData(data){
        data = this._rebuildData(data);
        this.data = data;
        this.setState({
            data: data,
            value: ''
        });
    }

    componentWillMount(){
        if (this.props.url) {
            let scope = this;
            Ajax.get(this.props.url, {}, function(data){
                if (data) {
                    scope.setData(data);
                }
            });
        }
    }

    render(){
        let {className, disabled, readOnly, style, grid} = this.props;
        className = classNames('cm-select', 'cm-autocomplete', getGrid(grid), {
            active: this.state.active,
            disabled: disabled || readOnly,
            dropup: this.state.dropup,
            hasEmptyOption: this.props.hasEmptyOption
        });

        let text = this._renderValues();
        let options = this._renderOptions();
        return (
            <div className={className} style={style} onClick={this.showOptions}>
                {text}
                <span className='cm-select-cert' />

                <div className='cm-select-options-wrap'>
                    <div ref='options' className='cm-select-options'>
                        <ul>{options}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

AutoComplete = clickAway(AutoComplete);

AutoComplete.propTypes = {
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
     * 只读
     * @attribute readOnly
     * @type {Boolean}
     */
    readOnly: PropTypes.bool,
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

FormControl.register(AutoComplete, 'autocomplete');

export default AutoComplete;
