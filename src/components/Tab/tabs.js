import React from 'react';
import BaseComponent from '../core/BaseComponent';
import Tab from './index';

class Tabs extends BaseComponent {
    displayName = 'Tabs';

    constructor (props) {
        super(props);

        const items = props.items || [];
        this.addState({
            items,
            activeKey: props.activeKey || (items.length > 0 ? items[0].key : '')
        });
    }

    onRemove = (key) => {
        this.remove(key);
    }

    remove (key) {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.items.forEach((pane, i) => {
            if (pane.key === key) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.items.filter(pane => pane.key !== key);
        if (lastIndex >= 0 && activeKey === key) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({ items: panes, activeKey }, () => {
            if (this.props.onRemove) {
                this.props.onRemove(key);
            }
        });
    }

    add (item) {
        const items = this.state.items;
        const activeKey = item.key;
        items.push(item);
        this.setState({ items, activeKey }, () => {
            if (this.props.onAdd) {
                this.props.onAdd(item);
            }
        });
    }

    /**
     * 是否存在该key的选项卡
     * @param {*} key 
     */
    hasItem (key) {
        const items = this.state.items;
        const ret = items.filter(item => {
            return item.key === key;
        });
        return ret.length;
    }

    select (key) {
        const activeKey = this.state.activeKey;
        if (key === activeKey) {
            return false;
        }
        this.state.items.forEach((pane) => {
            if (pane.key === key) {
                this.setState({
                    activeKey: pane.key
                });
            }
        });
    }

    onSelect = (key) => {
        const items = this.state.items;
        const ret = items.filter(item => {
            return item.key === key;
        });
        if (this.props.onSelect) {
            this.props.onSelect(key, ret[0]);
        }
    }

    getActive () {
        return this.state.activeKey;
    }

    renderTans () {
        return this.state.items.map(pane => <Tab.Item title={pane.title} key={pane.key}>{pane.content}</Tab.Item>);
    }

    render () {
        const {hasClose, className, style} = this.props;
        return (
            <Tab 
                className={className}
                style={style}
                hasClose={hasClose}
                activeKey={this.state.activeKey}
                onRemove={this.onRemove}
                onSelect={this.onSelect}
                tools={this.props.tools}
            >
                {this.renderTans()}
            </Tab>
        );
    }
}
export default Tabs;
