import React from 'react';
import classNames from 'classnames';
import Dom from '../../src/components/utils/Dom';
import BaseComponent from '../../src/components/core/BaseComponent';
import clickAway from '../../src/components/utils/ClickAway';
import Input from '../../src/components/Input';

import Scroll from '../../src/components/Scroll';
import Button from '../../src/components/Button';
import CheckBox from '../../src/components/CheckBox';
import Select from '../../src/components/Select';

import './style.less';

class Select2 extends BaseComponent {
    displayName = 'Select';

    static defaultProps = {
        active: false,
        disabled: false,
        sep: ',',
        value: '',
        filter: false,
        multi: false,
        valueField: 'id',
        textField: 'text'
    }

    state = {
        value: this.props.value,
        active: this.props.active,
        disabled: this.props.disabled,
        dropup: false,
        key: Math.random(),
        filterKey: ''
    }

    map = null

    _renderValues () {
        if (!this.map) {
            if (this.props.data && this.props.data.length) {
                this.map = {};
                this.props.data.forEach( ele => {
                    this.map[ele[this.props.valueField]] = ele;
                });
            }
        }
        const values = this.state.value ? this.state.value.split(this.props.sep) : null;
        let items = [];
        if (values && values.length) {
            items = values.map((v) => {
                return this.map[v];
            });
        }
        let showText = '';
        let tip = '';
        if (this.props.format) {
            showText = this.props.format(values, items);
            tip = showText;
            if (this.props.tipFormat) {
                tip = this.props.tipFormat(values, items);
            }
        } else {
            const arr = items.map(ele => (ele ? ele[this.props.textField] : ''));
            showText = arr.join(this.props.sep);
            tip = showText;
        }
        const className = classNames('cm-select-text', {
            'cm-select-placeholder': (!values || !values.length) && this.props.placeholder
        });
        return <span className={className} title={tip}>{showText}</span>;
    }

    onChange = (value, item) => {
        this.setState({value}, () => {
            if (this.props.onChange) {
                this.props.onChange(value, item);
            }
        });
    }

    _renderOptions () {
        const options = Object.assign({}, this.props);
        options.onChange = this.onChange;
        options.value = this.state.value;
        return <SelectOptions {...options} key={this.state.key} filterKey={this.state.filterKey}/>;
    }

    showOptions = (e) => {
        if (this.props.readOnly || this.state.disabled) {
            return;
        }
        if (this.props.filter && e.target == this.filterInputField) {
            return;
        }
        if (this.state.active && !this.props.multi) {
            this.hideOptions();
            return;
        }

        const options = this.options;
        options.style.display = 'block';

        const container = Dom.closest(options, '.cm-select');
        const offset = Dom.getOuterHeight(options) + 5;
        const dropup = Dom.overView(container, offset);

        Dom.withoutTransition(container, () => {
            if (this._isMounted) {
                this.setState({ dropup });
            }
        });

        this.bindClickAway();

        setTimeout(() => {
            if (this._isMounted) {
                this.setState({ active: true });
            }
            if (this.props.onShow) {
                this.props.onShow();
            }
            this.emit('show');
        }, 0);
    }

    /**
     * ClickAway 点击别的地方的回调
     * @method componentClickAway
     */
    componentClickAway () {
        this.hideOptions();
    }

    /**
     * 隐藏下拉框
     * @method hideOptions
     */
    hideOptions = () => {
        this.setState({ active: false });
        const options = this.options;

        this.unbindClickAway();

        let time = 500;
        if (this.isLtIE9()) {
            time = 0;
        }

        setTimeout(() => {
            if (this.state.active === false) {
                options.style.display = 'none';
            }
            if (this.props.onHide) {
                this.props.onHide();
            }
            this.emit('hide');
        }, time);
    }

    renderFilter () {
        if (this.props.filter) {
            return <Input onKeyUp={this.filter} ref={(f) => { this.filterInputField = f ; }}></Input>;
        } else {
            return null;
        }
    }

    filter = (e) => {
        this.setState({
            filterKey: e.target.value
        });
        if (this.props.onFilter) {
            this.props.onFilter(e.target.value);
        }
    }

    componentDidMount () {
        this._isMounted = true;
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.data !== this.props.data) {
            this.map = null;
            if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
                this.setState({value: nextProps.value, key: Math.random()});
            } else {
                this.setState({value: '', key: Math.random()});
            }
        } else {
            if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
                this.setState({value: nextProps.value});
            }
        }
    }

    render () {
        let {className, style, multi} = this.props;
        className = classNames('cm-select cm-large-select', className, {
            'cm-select-active': this.state.active,
            'cm-select-disabled': this.state.disabled,
            'cm-select-dropup': this.state.dropup,
            'cm-select-hasEmptyOption': !multi && this.props.hasEmptyOption
        });
        const text = this._renderValues();
        return <div className={className} style={style} onClick={this.showOptions}>
            {text}
            <span className='cm-select-cert' />
            <div className='cm-select-options-wrap'>
                <div ref={f => this.options = f} className='cm-select-options'>
                    {this.renderFilter()}
                    {this._renderOptions()}
                </div>
            </div>
        </div>;
    }
}

clickAway(Select2);

class SelectOptions extends React.Component {
    displayName = 'SelectOptions';

    static defaultProps = {
        textField: 'text',
        valueField: 'id',
        offset: 50,
        page: 0,
        pageSize: 10,
        height: 300,
        sep: ',',
        value: '',
        checkType: 'checkbox'
    };

    state = {
        page: this.props.page,
        height: this.props.height
    }

    selectedItems = {};

    renderOptions (data) {
        if (this.props.data.length) {
            const {textField, valueField, sep, value} = this.props;
            const page = this.state.page;
            const startPage = Math.max(page - 1, 0);
            const endPage = startPage + 3;
            const start = startPage * this.props.pageSize;
            let end = endPage * this.props.pageSize;
            end = Math.min(end, data.length);
            const ret = [];
            const currentValues = value.split(sep);
            for (let i = start; i < end; i++) {
                const item = data[i];
                const value = `${item[valueField]}`;
                const active = currentValues.includes(value);
                const text = item[textField];
                const content = this.format(text, item, active);
                let tip = text;
                if (typeof content === 'string') {
                    tip = content;
                }
                const clazzName = classNames('cm-select-option', {
                    'cm-select-option-active': active
                });
                ret.push(<li className={clazzName} onClick={this.onSelect.bind(this, value, item)} title={tip} key={value}>{content}</li>);
            }
            return ret;
        } else {
            return <div className='text-center'>暂无数据</div>;
        }
    }

    filterData () {
        const {filter, textField, data, filterKey} = this.props;
        if (filter) {
            const items = data.filter(item => {
                const text = item[textField];
                return text.indexOf(filterKey) !== -1;
            });
            return items;
        } else {
            return data;
        }
    }

    /**
     * 格式化数据
     * @param {*} text 
     */
    format (text, item, active) {
        if (item.type === 'checkbox') {
            return <CheckBox value={item[this.props.valueField]} 
                onChange={this.onChecked.bind(this, item)}
                checked={item.checked} label={text}
                name={this.props.name} type={this.props.checkType}/>;
        }
        if (this.props.optionFormat) {
            return this.props.optionFormat(text, item, active);
        }
        return text;
    }

    onChecked (item, value, checked) {
        if (!this.props.multi) {
            for (const key in this.selectedItems) {
                const lastItem = this.selectedItems[key];
                lastItem.checked = false;
            }
            item.checked = true;
            this.selectedItems = {};
            this.selectedItems[value] = item;
        } else {
            item.checked = checked;
            if (checked) {
                this.selectedItems[value] = item;
            } else {
                delete this.selectedItems[value];
            }
        }
        if (this.props.onChange) {
            const vals = this.getCheckedValue();
            this.props.onChange(vals.join(this.props.sep), item, this.selectedItems);
        }
    }

    onSelect (value, item) {
        if (item.type === 'checkbox') {
            return false;
        }
        if (!this.props.multi) {
            this.selectedItems = {};
            this.selectedItems[value] = item;
        } else {
            if (this.selectedItems[value]) {
                delete this.selectedItems[value];
            } else {
                this.selectedItems[value] = item;
            }
        }
        if (this.props.onChange) {
            const vals = Object.keys(this.selectedItems);
            this.props.onChange(vals.join(this.props.sep), item, this.selectedItems);
        }
    }

    getAllChecked () {
        const items = this.props.data.filter(item => {
            return item.checked;
        });
        return items;
    }

    getCheckedValue () {
        const items = this.getAllChecked();
        const vals = items.map(item => {
            return item[this.props.valueField];
        });
        return vals;
    }

    onScroll = (left, top) => {
        const pageHeight = 30 * this.props.pageSize;
        const page = parseInt(top / pageHeight, 10);
        if (page !== this.state.page) {
            let t = top - this.props.pageSize * 30;
            t = Math.max(t, 0);
            this.wrap.style.top = `${t}px`;
            this.setState({page});
        }
    }

    componentDidMount () {
        if (this.scroll) {
            const viewHeight = this.scroll.getViewHeight();
            const contentHeight = this.props.data.length * 30;
            if (contentHeight < viewHeight) {
                this.setState({height: contentHeight});
            }
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.filterKey !== this.props.filterKey) {
            this.setState({page: 0});
            this.scroll.reset();
            this.wrap.style.top = '0px';
        }
    }

    render () {
        const data = this.filterData();
        const totalHeight = 30 * data.length;
        return <Scroll ref={f => this.scroll = f} style={{height: this.state.height}} wrapDisplay='block' onScroll={this.onScroll}>
            <ul className='cm-select-options-list' ref={f => this.wrap = f}>
                {this.renderOptions(data)}
            </ul>
            <div style={{height: totalHeight}}></div>
        </Scroll>;
    }
}


class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        data: []
    };

    render () {
        const data1 = [];
        for (let i = 0; i < 1000; i++) {
            data1.push({id: i, text: `text${i}`});
        }
        return <div style={{width: 500, height: 500, margin: '0 auto', paddingTop: 50}}>
            阿萨德：<Select2 data={this.state.data} multi style={{maxWidth: 168}} filter />
            
            {/* <SelectOptions data={data} format={(text, item) => {
                return <div>{`${item.id} ${text}`}</div>;
            }} onChange={(v, item) => {
                console.log(v, item);
            }}/> */}

            <Select data={data1} hasEmptyOption placeholder='啊实打实'/>
            <Button onClick={() => {
                const data = [];
                for (let i = 0; i < 90000; i++) {
                    data.push({id: i, text: `text${i}`});
                }
                this.setState({data});
            }}>设置数据</Button>
        </div>;
    }
}


export default Comp;
