import React from 'react';
import classNames from 'classnames';
import CheckBox from '../CheckBox';
import Input from '../Input';
import PropTypes from 'prop-types';

class List extends React.Component {
    displayName = 'List';

    static propTypes = {
        data: PropTypes.array,
        onChange: PropTypes.func
    }

    state = {
        allChecked: false,
        data: this.props.data || []
    };

    checkedKeys = [];

    renderList () {
        const {data} = this.state;
        return data.map((item) => {
            return <div className='cm-transfer-item' key={item.id} style={{display: item.__show ? 'block' : 'none'}}>
                <CheckBox checked={item.checked} disabled={item.disabled} label={item.text} onChange={this.itemCheckedChange.bind(this, item)}/>
            </div>;
        });
    }

    filter = () => {
        const keyWord = this.filterInput.getValue();
        const {data} = this.state;
        data.forEach((item) => {
            if (item.text.indexOf(keyWord) > -1) {
                item.__show = true;
            } else {
                item.__show = false;
            }
        });

        const ret = this.isAllChecked();

        this.setState({
            data,
            allChecked: ret.allChecked,
            value: ret.value
        }, () => {
            if (this.props.onFilter) {
                this.props.onFilter();
            }
        });
    }

    allCheckedChange = (v, checked) => {
        const {data} = this.state;
        this.checkedKeys = [];
        data.forEach((item) => {
            if (!item.disabled && item.__show) {
                item.checked = checked;
                if (checked) {
                    this.checkedKeys.push(item.id);
                }
            }
        });
        this.setState({
            data,
            allChecked: checked,
            value: this.checkedKeys.join(',')
        }, () => {
            if (this.props.onChange) {
                this.props.onChange();
            }
        });
    }

    isAllChecked () {
        const {data} = this.state;
        let checkedNum = 0;
        this.checkedKeys = [];
        const showData = data.filter((item) => {
            return item.__show;
        });
        showData.forEach((item) => {
            if (!item.disabled) {
                if (item.checked) {
                    checkedNum ++;
                    this.checkedKeys.push(item.id);
                }
            } else {
                checkedNum ++;
            }
        });
        let allChecked = false;
        if (checkedNum !== 0 && checkedNum === showData.length) {
            allChecked = true;
        }

        return {
            allChecked,
            value: this.checkedKeys.join(',')
        };
    }

    itemCheckedChange = (aItem, v, checked) => {
        aItem.checked = checked;
        const ret = this.isAllChecked();
        this.setState({
            allChecked: ret.allChecked,
            value: ret.value
        }, () => {
            if (this.props.onChange) {
                this.props.onChange();
            }
        });
    }

    getValue () {
        return this.state.value;
    }

    getChecked () {
        const {data} = this.state;
        const checked = [];
        data.forEach((item) => {
            if (!item.disabled && item.__show) {
                if (item.checked) {
                    checked.push(item);
                }
            }
        });
        return checked;
    }

    addData (data) {
        if (data) {
            data = data.map((item) => {
                item.checked = false;
                return item;
            });

            const newData = this.state.data.concat(data);
            this.setState({
                data: newData,
                allChecked: false
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange();
                }
            });
        }
    }

    removeCheckedData () {
        let {data} = this.state;
        data = data.filter((item) => {
            if (item.disabled) {
                return true;
            }
            if (!item.__show) {
                return true;
            }
            return !item.checked;
        });
        this.setState({
            data,
            allChecked: false,
            value: ''
        }, () => {
            if (this.props.onChange) {
                this.props.onChange();
            }
        });
    }

    getData () {
        return this.state.data;
    }

    componentWillMount () {
        const {data} = this.state;
        data.forEach((item) => {
            item.__show = true;
        });
    }

    getShowSize () {
        const {data} = this.state;
        if (!data) {
            return 0;
        }
        const show = data.filter((item) => {
            return item.__show;
        });
        return show.length;
    }

    render () {
        const {className, style} = this.props;
        const clazzName = classNames('cm-transfer-list', className);
        
        return (
            <div className={clazzName} style={style}>
                <div className='cm-transfer-head'>
                    <CheckBox label={this.props.title} checked={this.state.allChecked} onChange={this.allCheckedChange}/>
                    <span className='pull-right'>总数: {this.getShowSize()}</span>
                </div>
                {this.props.filter ? <div className='cm-transfer-filter-wrap'>
                    <Input ref={(f) => this.filterInput = f} onInput={this.filter}/>
                </div> : null}
                <div className='cm-transfer-body'>
                    {this.renderList()}
                </div>
            </div>
        );
    }
}
export default List;
