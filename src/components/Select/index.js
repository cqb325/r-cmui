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
import fetch from '../utils/fetch';
import clickAway from '../utils/ClickAway';
import substitute from '../utils/strings';
import Dom from '../utils/Dom';
import Input from '../Input/index';
import FormControl from '../FormControl/index';
import grids from '../utils/grids';
import {fromJS} from 'immutable';
const getGrid = grids.getGrid;
import './Select.less';

class Option extends BaseComponent{
    static displayName = 'Option';

    constructor(props){
        super(props);

        let {itemBind, value} = props;

        if(itemBind){
            itemBind(value, this);
        }

        this.addState({
            active: props.active
        });
    }

    onSelect = (e)=>{
        if(e && e.preventDefault){
            e.preventDefault();
        }
        if(e && e.stopPropagation){
            e.stopPropagation();
        }

        let {multi, disabled} = this.props;
        if(disabled){
            return false;
        }

        if(multi){
            this.setState({
                active: !this.state.active
            }, ()=>{
                if(this.props.onClick){
                    this.props.onClick(this);
                }
            });
        }else{
            if(!this.state.active){
                this.setState({
                    active: true
                }, ()=>{
                    if(this.props.onClick){
                        this.props.onClick(this);
                    }
                });
            }
        }
    }

    /**
     * 获取值
     * @return {[type]} [description]
     */
    getValue(){
        return this.props.value;
    }

    getText(){
        return this.props.children || this.props.html;
    }

    /**
     * 是否为空选项
     * @return {Boolean} [description]
     */
    isEmptyOption(){
        return this.props.empty;
    }

    /**
     * 是否选中
     * @return {Boolean} [description]
     */
    isActive(){
        return this.state.active;
    }

    /**
     * 设置选中状态
     * @param {[type]} active [description]
     */
    setActive(active){
        this.setState({active});
    }

    componentWillUnmount(){
        let {itemUnBind} = this.props;
        if(itemUnBind){
            itemUnBind(this.props.value);
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.active !== this.props.active) {
            this.setState({
                active: nextProps.active
            });
        }
    }

    render(){
        let {html, children, disabled} = this.props;
        let className = classNames('cm-select-option', {
            'cm-select-option-active': this.state.active,
            'cm-select-option-disabled': disabled
        });

        return (
            <li className={className} onClick={this.onSelect} style={{display: this.props.show ? 'block' : 'none'}}>
                <a href="javascript:void(0)">
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
    static displayName = 'Select';
    static defaultProps = {
        textField: 'text',
        valueField: 'id',
        sep: ',',
        choiceText: '请选择',
        active: false
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

        this.sep = props.sep;
        this.orignData = props.data;

        let data = this._rebuildData(props.data, props.value, props.valueField);
        this.data = data || [];

        this.addState({
            value: props.value,
            active: props.active,
            data: data,
            filterKey: ''
        });

        this.options = {};
        this.text = [];
        this.lastSelectItem = null;

        this._selectItem = this._selectItem.bind(this);
    }

    /**
     * 绑定
     * @param  {[type]} value  [description]
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    itemBind = (value, option)=>{
        this.options[value] = option;
    }

    /**
     * 取消绑定
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    itemUnBind = (value)=>{
        delete this.options[value];
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
    _rebuildData(data){
        if (!data) {
            return null;
        }
        //生成一个新的数据， 防止后续操作影响到改数据
        data = fromJS(data).toJS();

        // let defaultValues = defaultValue ? (defaultValue + '').split(this.sep) : [];
        if (Core.isArray(data)) {
            let one = data[0];
            if (Core.isString(one)) {
                return data.map(function(item){
                    return {id: item, text: item};
                }, this);
            }
            if (Core.isObject(one)) {
                return data;
            }

            return null;
        }
        if (Core.isObject(data)) {
            let ret = [];
            for (var id in data) {
                let item = {id: id, text: data[id]};
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
            html = this.text;
        } else {
            html.push(this.props.placeholder ? this.props.placeholder + '&nbsp;' : '&nbsp;');
        }
        html = '<div class="cm-select-value-text">' + (html.join(this.sep) || '&nbsp;') + '</div>';

        html = html + '<input type="hidden" class="' + (this.props.className || '') + '" name="' +
            (this.props.name || '') + '" value="' + (this.state.value || '') + '">';


        return (<span style={{maxWidth: this.props.maxWidth, minWidth: this.props.minWidth}} className={className} dangerouslySetInnerHTML={{__html: html}} />);
    }

    _renderFilter(){
        if(this.props.filter){
            return <Input onKeyUp={this.filter}></Input>;
        }else{
            return null;
        }
    }

    filter = (e) => {
        this.setState({
            filterKey: e.target.value
        });
    }

    /**
     * 选中选项
     * @method _selectItem
     * @param option 选中的选项
     * @private
     */
    _selectItem(option){
        let value = '';
        //空选项
        if (option.isEmptyOption()) {
            if (!this.props.multi) {
                if(this.lastSelectItem){
                    this.lastSelectItem.setActive(false);
                }
                this.lastSelectItem = option;
                this.hideOptions();
                this.text = [];
            }
        } else {
            if (this.props.multi) {
                value = this.getSelectedValues();
                this.text = this.getDisplayText();
            } else {
                value = option.getValue();
                if(this.lastSelectItem){
                    this.lastSelectItem.setActive(false);
                }
                this.lastSelectItem = option;
                this.text = [option.getText()];
                this.hideOptions();
            }
        }

        this.setState({
            value: value
        });

        if (this.props.onChange) {
            this.props.onChange(value, option.props.item, option);
        }

        this.emit('change', value, option.props.item, option);
    }

    /**
     * 获取显示内容
     * @return {[type]} [description]
     */
    getDisplayText(){
        let text = [];
        for (let value in this.options) {
            let option = this.options[value];
            if (option.isActive()) {
                text.push(option.getText());
            }
        }
        return text;
    }

    /**
     * 获取选中的值
     * @method getSelectedValues
     * @returns {string}
     */
    getSelectedValues(){
        let values = [];
        for (let value in this.options) {
            let option = this.options[value];
            if (option.isActive()) {
                values.push(option.getValue());
            }
        }
        return values.join(this.sep);
    }

    getValue(){
        return this.state.value;
    }

    setValue(value){
        // let valueField = this.props.valueField;
        // let options = this.options;
        if (value === null || value === undefined || value === '') {
            this.text = [];
            this.setState({value});
        }
        if (value != undefined) {
            this.text = this.getDisplayText();
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
            ret.push(<Option key={-1} empty
                itemBind={this.itemBind}
                itemUnBind={this.itemUnBind}
                value="___empty"
                multi={multi}
                onClick={this._selectItem}>{choiceText}</Option>);
        }
        this.text = [];
        data.forEach((item)=>{
            let text = item[textField];
            let value = item[valueField];
            let active = this.isActive(value);
            let show = text.indexOf(this.state.filterKey) !== -1;

            let html = text;
            if (optionsTpl) {
                html = substitute(optionsTpl, item);
            }

            ret.push(<Option
                html={html}
                key={value}
                value={value}
                item={item}
                multi={multi}
                show={show}
                itemBind={this.itemBind}
                itemUnBind={this.itemUnBind}
                onClick={this._selectItem}
                active={active}
            />);

            if(active){
                this.text.push(html);
            }
        });

        return ret;
    }

    /**
     * 是否已经选中
     * @param  {[type]}  value [description]
     * @return {Boolean}       [description]
     */
    isActive(value){
        let vs = this.state.value ? this.state.value.split(this.sep) : [];
        return vs.indexOf(value) !== -1;
    }

    /**
     * 渲染子元素
     * @return {[type]} [description]
     */
    getChildrenOptions(){
        this.text = [];
        return React.Children.map(this.props.children, (child)=>{
            let componentName = child.type && child.type.displayName ? child.type.displayName : '';
            if (componentName === 'Option') {
                let value = child.props.value;
                let active = this.isActive(value);
                let show = child.props.children.indexOf(this.state.filterKey) !== -1;
                if (active) {
                    this.text.push(child.props.children);
                }
                let props = Object.assign({}, child.props, {
                    itemBind: this.itemBind,
                    itemUnBind: this.itemUnBind,
                    active: active,
                    multi: this.props.multi,
                    onClick: this._selectItem,
                    key: value,
                    show: show
                });
                if(this.props.multi && child.props.empty){
                    return null;
                }
                if (child.props.empty) {
                    props.value = '___empty';
                }
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
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
        if(this.props.filter && e.target == ReactDOM.findDOMNode(this.filterInputField)){
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
            if(this._isMounted){
                this.setState({ dropup });
            }
        });

        this.bindClickAway();

        setTimeout(() => {
            if(this._isMounted){
                this.setState({ active: true });
            }
            if(this.props.onShow){
                this.props.onShow();
            }
            this.emit('show');
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
            if(this.props.onHide){
                this.props.onHide();
            }
            this.emit('hide');
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
            this.text = [];
        }
        let val = value === undefined ? this.state.value : value;
        this.orignData = data;
        let newData = this._rebuildData(data, val, valueField);
        this.data = newData;
        if(this._isMounted){
            this.setState({
                data: newData,
                value: val
            });
        }
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

    /**
     * 加载远程数据
     * @param  {[type]}  url [description]
     * @return {Promise}     [description]
     */
    async loadFromRemote(url){
        let data = await fetch(url);
        this.setData(data);

        if (this.props.onDataLoaded) {
            this.props.onDataLoaded();
        }
        this.emit('dataLoaded');
    }

    componentWillMount(){
        if (this.props.url) {
            this.loadFromRemote(this.props.url);
        }
    }

    componentDidMount(){
        this._isMounted = true;
        if(!this.props.multi){
            for(let value in this.options){
                let option = this.options[value];
                if(option.isActive()){
                    this.lastSelectItem = option;
                }
            }
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentWillReceiveProps (nextProps) {
        let value = nextProps.value;
        if (value !== this.props.value && value !== this.state.value) {
            this.setState({ value });
        }
    }

    render(){
        let {className, style, grid, multi} = this.props;
        className = classNames('cm-select', getGrid(grid), {
            'cm-select-active': this.state.active,
            'cm-select-disabled': this.state.disabled,
            'cm-select-dropup': this.state.dropup,
            'cm-select-hasEmptyOption': !multi && this.props.hasEmptyOption
        });

        let filter = this._renderFilter();
        let childrenOptions = this.getChildrenOptions();
        let options = this._renderOptions();
        let text = this._renderValues();
        return (
            <div className={className} style={style} onClick={this.showOptions}>
                {text}
                <span className="cm-select-cert" />
                <div className="cm-select-options-wrap">
                    <div ref="options" className="cm-select-options">
                        {filter}
                        <ul>{childrenOptions}{options}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

Select = clickAway(Select);

Select.Option = Option;

FormControl.register(Select, 'select');

export default Select;
