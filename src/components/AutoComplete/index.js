/**
 * @author cqb 2016-04-29.
 * @module AutoComplete
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Dom from '../utils/Dom';
import Input from '../Input/index';
import FormControl from '../FormControl/index';
import Select from '../Select/index';

/**
 * AutoComplete 类
 * @class AutoComplete
 * @constructor
 * @extend BaseComponent
 */
class AutoComplete extends Select {
    static displayName = 'AutoComplete';
    constructor(props) {
        super(props);
        this.timer = null;
        this.addState({
            value: props.value,
            active: props.active,
            data: []
        });
    }

    /**
     * 渲染值域区域
     * @method _renderValues
     * @returns {XML}
     * @private
     */
    _renderValues(){
        let {name, placeholder} = this.props;
        let values = this.state.value ? (this.state.value + '').split(this.sep) : [];

        let html = [];
        if (values.length) {
            html = this.text;
        }
        let className = classNames('cm-select-value', {
            'cm-select-placeholder': !values.length && placeholder
        });

        return (<Input ref="input" type="text" className={className}
            name={name}
            value={html.join(this.sep)}
            placeholder={placeholder}
            trigger="change"
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

    /**
     * 过滤，默认显示过滤后的数据， silent为true时不显示
     * @param {any} value 
     * @param {any} silent 
     * @returns 
     * @memberof AutoComplete
     */
    filter(value, silent){
        if (!this.data) {
            return;
        }
        var filtered = this.data.filter((item)=> {
            if (item.text.indexOf(value) != -1) {
                return true;
            }

            return false;
        });

        this.setState({data: filtered}, ()=>{
            if(!silent){
                this.showOptions();
            }
        });
    }

    _selectItem(option) {
        super._selectItem(option);
        let v = option.getValue();
        this.filter(v, true);
    }

    getValue(){
        return this.refs.input.value;
    }

    /**
     * 显示下拉框
     * @method showOptions
     */
    showOptions = ()=>{
        if(!this.state.data || (this.state.data && !this.state.data.length)){
            return;
        }
        if (this.props.readOnly || this.state.disabled) {
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

    render(){
        return super.render();
    }
}

FormControl.register(AutoComplete, 'autocomplete');

export default AutoComplete;
