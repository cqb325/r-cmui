import React from 'react';
import classNames from 'classnames';
import Table from '../Table';
import omit from 'omit.js';

import './TreeGrid.less';

class TreeGrid extends React.Component {
    displayName = 'TreeGrid';

    static defaultProps = {
        valueField: 'id',
        textField: 'text'
    };

    constructor (props) {
        super(props);

        this.nodeMap = {};
        this.data = [];
        this.rebuildData(props.data, 0);
        this.initShowHide(props.data, true);
        const columns = this.props.columns;
        columns.forEach((column) => {
            if (column.type === 'tree') {
                column.format = this.format;
            }
        });
    }

    rebuildData (data, level) {
        data.forEach((node) => {
            this.nodeMap[node.id] = node;
            this.data.push(node);
            node._level = level;
            if (node.children) {
                this.rebuildData(node.children, level + 1);
            }
        });
    }

    initShowHide (data, open) {
        data.forEach((node) => {
            if (!open) {
                node._show = false;
                node.children && this.initShowHide(node.children, false);
                return;
            }
            node._show = true;
            if (node.open) {
                node.children && this.initShowHide(node.children, true);
            } else {
                node.children && this.initShowHide(node.children, false);
            }
        });
    }

    format = (value, column, row) => {
        const paddingLeft = row._level * 24;
        const text = row[this.props.textField];
        const hasChildren = row.children && row.children.length;
        const open = row.open;
        const arrowClass = classNames('cm-tree-grid-arrow', {
            'cm-tree-grid-arrow-open': open
        });
        return <div style={{paddingLeft}}>
            <span className={arrowClass} onClick={this.openHide.bind(this, row)}></span>
            <span className='cm-tree-grid-cont'>
                <span className={`cm-tree-grid-icon ${open ? 'cm-tree-grid-icon-open' : ''} ${hasChildren ? 'cm-tree-grid-icon-branch' : 'cm-tree-grid-icon-leaf'}`}></span>
                <span className='cm-tree-grid-text'>{text}</span>
            </span>
        </div>;
    }

    openHide (row) {
        const item = this.nodeMap[row[this.props.valueField]];
        item.open = !item.open;
        if (item.open && item.children && item.children.length) {
            item.children.forEach((sub) => {
                sub._show = true;
                const row = this.table.getRow(sub[this.props.valueField]);
                if (row) {
                    row.display(true);
                }
            });
        }

        if (!item.open && item.children && item.children.length) {
            this.hideChildren(item);
        }
    }

    hideChildren (item) {
        item.open = false;
        if (item.children && item.children.length) {
            item.children.forEach((sub) => {
                sub._show = false;
                const row = this.table.getRow(sub[this.props.valueField]);
                if (row) {
                    row.display(false);
                }
                this.hideChildren(sub);
            });
        }
    }

    render () {
        const {className, style, itemStyle} = this.props;
        const others = omit(this.props, ['className', 'style']);
        others.style = itemStyle;
        const clazzName = classNames('cm-tree-grid', className);
        return (
            <div className={clazzName} style={style}>
                <Table ref={(f) => this.table = f} {...others} data={this.data} />
            </div>
        );
    }
}
export default TreeGrid;
