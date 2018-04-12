import React from 'react';
import classNames from 'classnames';
import Dom from '../utils/Dom';

import './Contacts.less';

class Contacts extends React.Component {
    displayName = 'Contacts';

    static defaultProps = {
        selectable: false
    }

    state = {
        data: this.props.data
    };

    onClick (chart, item) {
        if (!this.props.selectable) {
            return false;
        }
        item._active = !item._active;
        
        this.setState({
            data: this.state.data
        });
    }

    setData (data) {
        this.setState({data});
    }

    /**
     * 选中节点
     * @param {*} item 
     */
    selectItem (item) {
        item._active = true;
        this.setState({
            data: this.state.data
        });
    }

    /**
     * 取消选中节点
     * @param {*} item 
     */
    unSelectItem (item) {
        item._active = false;
        this.setState({
            data: this.state.data
        });
    }

    /**
     * 获取选中的节点
     */
    getSelectedItems () {
        const data = this.state.data;
        let ret = [];
        for (const chart in data) {
            const list = data[chart];
            const alist = list.filter((item) => {
                return item._active;
            });
            ret = ret.concat(alist);
        }

        return ret;
    }

    renderList () {
        const eles = [];
        const data = this.state.data;

        for (const chart in data) {
            const list = data[chart];
            const dds = list.map((item) => {
                if (this.props.renderItem) {
                    const ele = this.props.renderItem(chart, item);
                    const props = Object.assign({
                        onClick: this.onClick.bind(this, chart, item)
                    },ele.props);
                    return React.cloneElement(ele, props);
                }
                return <dd className={item._active ? 'active' : ''} onClick={this.onClick.bind(this, chart, item)} key={item} data-link={chart}>{item}</dd>;
            });
            eles.push(<dl key={`contact_${chart}`}><dt id={`contact_${chart}`}>{chart}</dt>{dds}</dl>);
        }
        return eles;
    }

    renderDots () {
        const eles = [];
        const data = this.state.data;
        for (const chart in data) {
            eles.push(<a key={chart} href={`#contact_${chart}`}>{chart}</a>);
        }
        return <div className='cm-contacts-nav'>{eles}</div>;
    }

    /**
     * 移除一个节点
     * @param {*} chart 
     * @param {*} aitem 
     */
    removeItem (chart, aitem) {
        const data = this.state.data;
        const list = data[chart];
        if (list) {
            const alist = list.filter((item) => {
                return aitem !== item;
            });
            data[chart] = alist;
            if (alist.length === 0) {
                delete data[chart];
            }
            this.setState({
                data
            });
        }
    }

    /**
     * 添加节点
     * @param {*} chart 
     * @param {*} aitem 
     */
    addItem (chart, aitem) {
        const data = this.state.data;
        const list = data[chart];

        if (list) {
            list.push(aitem);
        } else {
            data[chart] = [aitem];
        }

        this.setState({
            data
        });
    }

    updateItem (chart, oldItem, aitem) {
        const data = this.state.data;
        const list = data[chart];
        if (list) {
            const alist = list.map((item) => {
                if (item === oldItem) {
                    return aitem;
                }
                return item;
            });
            data[chart] = alist;
            this.setState({
                data
            });
        }
    }

    componentDidMount () {
        const rect = this.wrap.getBoundingClientRect();
        const H = rect.height;
        const h = H / 26;
        const els = Dom.queryAll('a', this.wrap);
        if (els.length) {
            const eles = Dom.dom(els);
            eles.css({height: `${h}px`, 'line-height': `${h}px`});
        }
    }

    render () {
        const {className, style} = this.props;
        const clazzName = classNames(className, 'cm-contacts');
        return (
            <div className={clazzName} style={style} ref={(f) => this.wrap = f}>
                <div className='cm-contacts-list'>
                    {this.renderList()}
                </div>
                {this.renderDots()}
            </div>
        );
    }
}
export default Contacts;
