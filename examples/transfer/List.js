import React from 'react';
import classNames from 'classnames';
import Radio from '../../src/components/Radio';
import Input from '../../src/components/Input';
import PropTypes from 'prop-types';

class List extends React.Component {
    displayName = 'List';

    static propTypes = {
        data: PropTypes.array,
        onChange: PropTypes.func,
        textField: PropTypes.string,
        valueField: PropTypes.string
    }

    static defaultProps = {
        textField: 'text',
        valueField: 'id'
    }

    state = {
        data: this.props.data || [],
        value: ''
    };

    lastCheckedItem = null;

    renderList () {
        const {data} = this.state;
        return data.map((item) => {
            const value = item[this.props.valueField];
            return <div className='cm-transfer-item' key={value} style={{display: item.__show ? 'block' : 'none'}}>
                <Radio checked={item.checked} disabled={item.disabled} label={item[this.props.textField]} onChange={this.itemCheckedChange.bind(this, item)}/>
            </div>;
        });
    }

    filter = () => {
        const keyWord = this.filterInput.getValue();
        const {data} = this.state;
        data.forEach((item) => {
            if (item[this.props.textField].indexOf(keyWord) > -1) {
                item.__show = true;
            } else {
                item.__show = false;
            }
        });

        this.setState({
            data
        }, () => {
            if (this.props.onFilter) {
                this.props.onFilter();
            }
        });
    }

    itemCheckedChange = (aItem, v, checked) => {
        if (this.lastCheckedItem) {
            this.lastCheckedItem.checked = false;
        }
        aItem.checked = checked;
        this.lastCheckedItem = aItem;
        this.setState({
            value: aItem[this.props.valueField]
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
            if (!item.disabled && item.checked) {
                checked.push(item);
            }
        });
        return checked;
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

    render () {
        const {className, style} = this.props;
        const clazzName = classNames('cm-transfer-list', className);
        
        return (
            <div className={clazzName} style={style}>
                {this.props.filter ? <div className='cm-transfer-filter-wrap' style={{top: 0}}>
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
