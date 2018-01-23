import React from 'react';
import Row from './Row';
import Events from '../utils/Events';
import PropTypes from 'prop-types';

class Body extends React.Component {
    displayName = 'Body';

    static propTypes = {
        selectMode: PropTypes.string,
        onSelectRow: PropTypes.func,
        onScrollX: PropTypes.func,
        data: PropTypes.array,
        total: PropTypes.number,
        pageSize: PropTypes.number,
        pageNum: PropTypes.number,
        columns: PropTypes.array,
        headHeight: PropTypes.number
    };

    state = {
        spacerWidth: 0,
        spacerHeight: 0
    };

    step = 50;
    lastSelectRows = [];
    lastSelectedCells = {row: [], cell: []};
    indexRows = {};

    pagesData = [];

    saveRow = (index, f) => {
        if (f) {
            this.indexRows[index] = f;
            if (f.isSelect()) {
                this.lastSelectRows.push(f);
            }
        }
    }

    /**
     * 选中某行的时候
     * 按住 ctrl键或者shift键可以多选
     */
    onSelectRow = (row, ctrl, shift) => {
        if (this.props.selectMode === 'row') {
            if (ctrl) {
                this.lastSelectRows.push(row);
            } else if (shift) {
                if (this.lastSelectRows.length === 0) {
                    this.lastSelectRows.push(row);
                } else {
                    for (let i = 0; i < this.lastSelectRows.length; i++) {
                        this.lastSelectRows[i].unSelect();
                    }
                    const start = this.lastSelectRows[this.lastSelectRows.length - 1].getRowIndex();
                    const end = row.getRowIndex();
                    const arr = [start, end].sort();
                    
                    for (let i = arr[0]; i <= arr[1]; i++) {
                        this.lastSelectRows.push(this.indexRows[i]);
                        this.indexRows[i].select();
                    }
                }
            } else {
                if (this.lastSelectRows.length) {
                    for (let i = 0; i < this.lastSelectRows.length; i++) {
                        if (this.lastSelectRows[i] !== row) {
                            this.lastSelectRows[i].unSelect();
                        }
                    }
                }
                this.lastSelectRows = [row];
            }

            if (this.props.onSelectRow) {
                this.props.onSelectRow(row);
            }
        }
    }

    /**
     * 选中的rows
     */
    getSelectedRows () {
        return this.lastSelectRows;
    }

    renderRows () {
        if (!this.props.data) {
            return null;
        }
        const data = this.props.data;
        const {pageNum, pageSize, total} = this.props;
        const start = (pageNum - 1) * pageSize;
        let end = pageNum * pageSize - 1;
        end = Math.min(end, total - 1);
        const showData = [];
        // 清空数据
        this.indexRows = {};
        this.lastSelectRows = [];
        for (let i = start; i <= end; i++) {
            const row = data[i];
            showData.push(
                <Row key={row.id} 
                    selectMode={this.props.selectMode}
                    columns={this.props.columns}
                    data={row}
                    rowIndex={i}
                    ref={(f) => { this.saveRow(i, f); }}
                    onSelectRow={this.onSelectRow}
                    onEnterCell={this.onEnterCell}
                    onSelectCell={this.onSelectCell}
                />
            );
        }
        return showData;
    }

    renderBody () {
        const rows = this.renderRows();
        return <div className='cm-grid-body-wrap' ref={(f) => this.bodyWrap = f}>
            <div className='cm-grid-body' ref={(f) => this.body = f} 
                onMouseUp={this.onMouseUp}
                onMouseLeave={this.onMouseUp}
            >
                {rows}
            </div>
        </div>;
    }

    onSelectCell = (rowIndex, cellIndex) => {
        if (this.props.selectMode === 'cell') {
            this.isDragging = true;
            this.unSelectCells();
            this.lastSelectedCells.row = [rowIndex, rowIndex];
            this.lastSelectedCells.cell = [cellIndex, cellIndex];
            this.selectCells();
        }
    }

    onEnterCell = (rowIndex, cellIndex) => {
        if (this.isDragging) {
            this.unSelectCells();
            this.lastSelectedCells.row[1] = rowIndex;
            this.lastSelectedCells.cell[1] = cellIndex;
            this.selectCells();
        }
    }

    onMouseUp = () => {
        if (this.isDragging) {
            this.isDragging = false;
        }
    }

    selectCells () {
        const r = this.lastSelectedCells.row;
        const c = this.lastSelectedCells.cell;
        const row = r[0] <= r[1] ? [r[0], r[1]] : [r[1], r[0]];
        const cell = c[0] <= c[1] ? [c[0], c[1]] : [c[1], c[0]];

        for (let i = row[0]; i <= row[1]; i++) {
            this.indexRows[i].selectCells(cell);
        }
    }

    unSelectCells () {
        if (this.lastSelectedCells.row.length) {
            const r = this.lastSelectedCells.row;
            const c = this.lastSelectedCells.cell;
            const row = r[0] <= r[1] ? [r[0], r[1]] : [r[1], r[0]];
            const cell = c[0] <= c[1] ? [c[0], c[1]] : [c[1], c[0]];

            for (let i = row[0]; i <= row[1]; i++) {
                this.indexRows[i].unSelectCells(cell);
            }
        }
    }

    componentWillUnmount () {
        this._isMounted = false;
        Events.off(this.content, 'mousewheel', this.wheel);
        Events.off(window, 'resize', this.windowResize);
        Events.off(this.box, 'scroll', this.spaceScroll);
    }

    componentDidMount () {
        this._isMounted = true;
        this.updateSize();
        this.onSpacerScroll();

        Events.on(this.content, 'mousewheel', this.wheel);
        Events.on(window, 'resize', this.windowResize);
    }

    windowResize = () => {
        this.updateScrollSize();
    }

    wheel = (e) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        const delta = e.wheelDelta;
        if (delta > 0) {
            this.scrollUp();
        } else {
            this.scrollDown();
        }
    }

    updateSize () {
        if (!this.body) {
            return;
        }
        const totalHeight = this.body.getBoundingClientRect().height;
        this.setState({
            spacerHeight: totalHeight
        }, () => {
            this.updateScrollSize();
        });
    }

    /**
     * 是否存在滚动条，存在重设content的长宽
     */
    updateScrollSize () {
        const spacerWidth = this.spacer.getBoundingClientRect().width;
        const spacerHeight = this.hspacer.getBoundingClientRect().height;
        const boxWidth = this.box.getBoundingClientRect().width;
        const boxHeight = this.hbox.getBoundingClientRect().height;
        let barwidth = 0;
        if (boxWidth > spacerWidth) {
            barwidth = boxWidth - spacerWidth;
            this.content.style.right = `${barwidth}px`;
        } else {
            this.content.style.right = '0';
        }
        if (boxHeight > spacerHeight) {
            this.content.style.bottom = `${boxHeight - spacerHeight}px`;
        } else {
            this.content.style.bottom = '0';
        }
    }

    /**
     * 向上滚动
     */
    scrollUp () {
        let top = this.box.scrollTop;
        top = Math.max(top - this.step, 0);
        this.box.scrollTop = top;
        this.body.style.top = `${-top}px`;
    }

    /**
     * 向下滚动
     */
    scrollDown () {
        let top = this.box.scrollTop;
        top = top + this.step;

        this.box.scrollTop = top;
        top = this.box.scrollTop;
        this.body.style.top = `${-top}px`;
    }

    onSpacerScroll () {
        Events.on(this.box, 'scroll', this.spaceScroll);
    }

    spaceScroll = () => {
        this.body.style.top = `${-this.box.scrollTop}px`;
        this.body.style.left = `${-this.box.scrollLeft}px`;
        if (this.props.onScrollX) {
            this.props.onScrollX(-this.box.scrollLeft);
        }
    }

    render () {
        if (!this.body) {
            window.setTimeout(() => {
                this.updateSize();
            }, 10);
        }
        let w = 0;
        this.props.columns.forEach((column) => {
            w += column.width;
        });
        return (
            <div className='cm-grid-scroll' style={{top: this.props.headHeight}}>
                <div className='cm-grid-scroll-box' ref={(f) => this.hbox = f}>
                    <div className='cm-grid-scroll-spacer-x' ref={(f) => this.hspacer = f} style={{width: w}}></div>
                </div>
                <div className='cm-grid-scroll-box' ref={(f) => this.box = f}>
                    <div className='cm-grid-scroll-spacer' ref={(f) => this.spacer = f} style={{height: this.state.spacerHeight}}></div>
                    <div style={{width: w, height: 1}}></div>
                </div>
                <div className='cm-grid-scroll-content' ref={(f) => this.content = f}>
                    {this.renderBody()}
                </div>
            </div>
        );
    }
}
export default Body;
