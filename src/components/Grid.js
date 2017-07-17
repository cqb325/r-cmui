/**
 * @author cqb 2017-04-27.
 * @module Grid
 */

import React from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './core/BaseComponent';
import Dom from './utils/Dom';
import Draggable from 'Draggable';
const DraggableCore = Draggable.DraggableCore;
import Events from './utils/Events';

/**
 * Grid 类
 * @class Grid
 * @extend BaseComponent
 */
class Grid extends BaseComponent {
    constructor(props) {
        super(props);

        this.data = props.data;
        let data = this.rebuildData(props.data);
        this.scrollDelta = props.scrollDelta || 40;
        this.addState({
            data: data || [],
            columns: props.columns,
            pagination: props.pagination || false,
            pageNum: props.pageNum || 1,
            pageSize: props.pageSize || 10,
            columnWidth: []
        });
    }

    rebuildData(data){
        return data;
    }

    renderColGroups(){
        let cols = this.state.columns.map(function(column, index){
            return (<col key={index} style={{width: column.width}} />);
        });
        return (
            <colgroup>
                {cols}
            </colgroup>
        );
    }

    renderHeader(){
        let ths = this.renderHeadRow();
        return (
            <div className='cm-grid-head-wrap'>
                <div className='cm-grid-head'>
                    {ths}
                </div>
            </div>
        );
    }

    /**
     * 列 resize
     * @param column
     * @param index
     * @param event
     * @param obj
     */
    resizeColumn(column, index, event, obj){
        let columnWidth = this.state.columnWidth;
        let width = Math.max(columnWidth[index] + obj.deltaX, 50);
        columnWidth[index] = width;
        this.setState({
            columnWidth: columnWidth
        });

        this.updateSpacer();
    }

    /**
     * 排序
     * @param column
     */
    sortColumn(column){
        let data = this.state.data;
        if (column.__sort === 'desc' || column.__sort === undefined) {
            data.sort(function(a, b) {
                if (column.sortType === 'local') {
                    return a[column.name].localeCompare(b[column.name]);
                } else {
                    let aVal = a[column.name];
                    if (aVal.replace) {
                        aVal = parseFloat(aVal.replace(/[^0-9\.]+/g, ''));
                    }
                    let bVal = b[column.name];
                    if (bVal.replace) {
                        bVal = parseFloat(bVal.replace(/[^0-9\.]+/g, ''));
                    }
                    return aVal - bVal;
                }
            });
            column.__sort = 'asc';
        } else {
            data.sort(function(a, b){
                if (column.sortType === 'local') {
                    return b[column.name].localeCompare(a[column.name]);
                } else {
                    let aVal = a[column.name];
                    if (aVal.replace) {
                        aVal = parseFloat(aVal.replace(/[^0-9\.]+/g, ''));
                    }
                    let bVal = b[column.name];
                    if (bVal.replace) {
                        bVal = parseFloat(bVal.replace(/[^0-9\.]+/g, ''));
                    }
                    return bVal - aVal;
                }
            });
            column.__sort = 'desc';
        }

        this.setState({data: data});
    }

    renderHeadRow(){
        return this.state.columns.map((column, index)=>{
            let width = this.state.columnWidth[index];
            let style = {};
            if (width != undefined) {
                style.width = width;
            }
            return (<div key={index} className='cm-grid-column'
                style={style} data-column={column.name} data-index={index}>
                <span className='cm-grid-head-text'>
                    {column.text}
                    {column.sort
                        ? <span className='cm-grid-sort' onClick={this.sortColumn.bind(this, column)} />
                        : null
                    }
                </span>
                {column.resize ? <DraggableCore axis='x' onDrag={this.resizeColumn.bind(this, column, index)}>
                    <span className='cm-grid-resize' />
                </DraggableCore> : null}
            </div>);
        });
    }

    renderRows(){
        return this.state.data.map((row, rowIndex)=>{
            let cells = this.state.columns.map((col, colIndex)=>{
                let width = this.state.columnWidth[colIndex];
                let style = {};
                if (width != undefined) {
                    style.width = width;
                }
                return (
                    <div key={colIndex} style={style} className='cm-grid-cell' data-row={rowIndex} data-cell={colIndex}>
                        {row[col.name]}
                    </div>
                );
            });
            return (
                <div key={rowIndex} className='cm-grid-row' data-row={rowIndex}>
                    {cells}
                </div>
            );
        });
    }

    renderBody(){
        let rows = this.renderRows();
        return (
            <div className='cm-grid-body-wrap'>
                <div className='cm-grid-body'>
                    {rows}
                </div>
            </div>
        );
    }

    componentDidMount(){
        this._isMounted = true;
        let ele = ReactDOM.findDOMNode(this);
        let head = Dom.dom(Dom.query('.cm-grid-head-wrap', ele));
        let sc = Dom.dom(Dom.query('.cm-grid-scroll', ele));
        sc.css({
            top: head.height() + 'px'
        });
        let body = Dom.dom(Dom.queryAll('.cm-grid-body', ele));
        let box = Dom.dom(Dom.query('.cm-grid-box', ele));
        let spacer = Dom.dom(ReactDOM.findDOMNode(this.refs.spacer));
        spacer.css({height: body.height() + 'px'});
        let spacerWidth = spacer.width();
        let width = box.width();
        if (spacerWidth < width) {
            let scrollWidth = width - spacerWidth;
            let content = Dom.dom(ReactDOM.findDOMNode(this.refs.content));
            content.css('right', scrollWidth + 'px');
        }


        Events.on(ele, 'mousewheel', (e)=>{
            let delta = e.wheelDelta;
            if (delta > 0) {
                this.scrollUp();
            } else {
                this.scrollDown();
            }
        });

        this.onSpacerScroll();

        setTimeout(()=>{
            this.updateAllWidth();
            this.updateSpacer();
        }, 0);
    }

    /**
     * spacer滚动条滚动的回调
     */
    onSpacerScroll(){
        let ele = ReactDOM.findDOMNode(this);
        let body = Dom.dom(Dom.query('.cm-grid-body', ele));
        let scroll = Dom.query('.cm-grid-scroll-box', ele);
        let head = Dom.dom(Dom.query('.cm-grid-head', ele));
        Events.on(scroll, 'scroll', ()=>{
            body.css('top', -scroll.scrollTop + 'px');
            body.css('left', -scroll.scrollLeft + 'px');
            head.css('left', -scroll.scrollLeft + 'px');
        });
    }

    /**
     * 更新spacer
     */
    updateSpacer(){
        let allWidth = 0;
        this.state.columnWidth.forEach(function(w){
            allWidth += w;
        });
        let spacer = Dom.dom(ReactDOM.findDOMNode(this.refs.spacer));
        spacer.css({ width: allWidth + 'px' });
        let scrollWidthHeight = this.getScrollWidthHeight();
        let content = Dom.dom(ReactDOM.findDOMNode(this.refs.content));
        content.css('right', scrollWidthHeight.w + 'px');
        content.css('bottom', scrollWidthHeight.h + 'px');
    }

    /**
     * 获取滚动条宽度和高度
     */
    getScrollWidthHeight(){
        let spacer = Dom.dom(ReactDOM.findDOMNode(this.refs.spacer));
        let spacerWidth = spacer.width();
        let spacerHeight = spacer.height();

        spacer.css({height: '100%'});
        let height1 = spacer.height();
        spacer.css({width: '1px', height: '100%'});
        let clientHeight = spacer.height();
        spacer.css({width: 'auto', height: spacerHeight + 'px'});
        let width1 = spacer.width();
        spacer.css({height: '1px'});
        let clientWidth = spacer.width();

        spacer.css({height: spacerHeight + 'px', width: spacerWidth + 'px'});

        return {w: clientWidth - width1, h: clientHeight - height1};
    }

    /**
     * 获取表body的宽度
     * @returns {*}
     */
    getBodyWidth(){
        let ele = ReactDOM.findDOMNode(this);
        let row = Dom.query('.cm-grid-row:first-child', ele);
        if (row) {
            let cells = Dom.dom(Dom.queryAll('.cm-grid-cell', row));
            let width = 0;
            cells.each(function(cell){
                width += Dom.dom(cell).width();
            });

            return width;
        }

        return '100%';
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    scrollUp(){
        let ele = ReactDOM.findDOMNode(this);
        let scroll = Dom.query('.cm-grid-scroll-box', ele);
        let body = Dom.dom(Dom.query('.cm-grid-body', ele));
        let top = scroll.scrollTop;
        top = Math.max(top - 40, 0);
        scroll.scrollTop = top;
        body.css('top', -top + 'px');
    }

    scrollDown(){
        let ele = ReactDOM.findDOMNode(this);
        let scroll = Dom.query('.cm-grid-scroll-box', ele);
        let body = Dom.dom(Dom.query('.cm-grid-body', ele));
        let top = scroll.scrollTop;
        top = top + 40;
        scroll.scrollTop = top;
        top = scroll.scrollTop;
        body.css('top', -top + 'px');
    }

    /**
     * 计算每列可能的最大宽度
     * @returns {Array}
     */
    calculateWidth(){
        let ele = ReactDOM.findDOMNode(this);
        let columnEles = Dom.dom(Dom.queryAll('.cm-grid-column', ele));
        let max = [];
        if (this.props.fixed) {
            let content = Dom.dom(Dom.query('.cm-grid-scroll-content', ele));
            let allWidth = content.width();
            let colWidth = allWidth / columnEles.length;
            columnEles.each(()=>{
                max.push(colWidth);
            });
            return max;
        }

        columnEles.each((col)=>{
            max.push(Dom.dom(col).width() + 1);
        });

        let rowEles = Dom.dom(Dom.queryAll('.cm-grid-row', ele));
        if (rowEles.length) {
            this.calculateWidthByRow(rowEles[0], max);
            this.calculateWidthByRow(rowEles[rowEles.length - 1], max);
            this.calculateWidthByRow(rowEles[Math.ceil(rowEles.length / 2)], max);
        }

        return max;
    }

    /**
     * 计算一行中每列的最大宽度
     * @param row
     * @param max
     */
    calculateWidthByRow(row, max){
        let cellEles = Dom.dom(Dom.queryAll('.cm-grid-cell', row));
        cellEles.each((cell, index)=>{
            let cellWidth = Dom.dom(cell).width() + 1;
            if (max[index] < cellWidth) {
                max[index] = cellWidth;
            }
        });
    }

    /**
     * 更新所有的宽度
     */
    updateAllWidth(){
        let max = this.calculateWidth();
        if (this._isMounted) {
            this.setState({
                columnWidth: max
            });
        }
    }

    render(){
        return (
            <div className='cm-grid-wrap'>
                <div className='cm-grid-box'>
                    {this.renderHeader()}
                    <div className='cm-grid-scroll'>
                        <div className='cm-grid-scroll-box'>
                            <div className='cm-grid-scroll-spacer' ref='spacer' />
                        </div>
                        <div className='cm-grid-scroll-content' ref='content'>
                            {this.renderBody()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Grid;
