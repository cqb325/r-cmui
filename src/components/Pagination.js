/**
 * @author cqb 2016-04-20.
 * @module Pagination
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import FontIcon from './FontIcon';
import Button from './Button';
import Select from './Select';
import Input from './Input';
const Component = React.Component;


/**
 * PagePrev Component
 */
class PagePrev extends Component {
    render() {
        let className = classNames('prev', {
            disabled: this.props.current === 1
        });
        return (<li onClick={this.props.onClick} className={className}><a href='javascript:void(0)'>
            <FontIcon icon='angle-left' />
        </a></li>);
    }
}

/**
 * PageNext Component
 */
class PageNext extends Component {
    render() {
        let className = classNames('next', {
            disabled: this.props.disabled
        });

        return (<li onClick={this.props.onClick} className={className}><a href='javascript:void(0)'>
            <FontIcon icon='angle-right' />
        </a></li>);
    }
}

/**
 * PageItem Component
 */
class PageItem extends Component {
    render() {
        let className = classNames({
            active: this.props.active
        });
        return (<li onClick={this.props.onClick} className={className}>
            <a href='javascript:void(0)'>{this.props.currentIndex}</a>
        </li>);
    }
}

/**
 * 分页组件
 * @class Pagination
 * @extend BaseComponent
 */
class Pagination extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            current: props.current,
            _current: props.current,
            pageSize: props.pageSize,
            total: props.total,
            displayedPages: 5,
            displayInfo: this.props.displayInfo !== undefined ? this.props.displayInfo : true
        });
    }

    /**
     * 更新数据
     * @method update
     * @param data {Object} 分页数据
     */
    update(data) {
        let params = {};
        if (data.pageSize != undefined) {
            params.pageSize = data.pageSize;
        }
        if (data.displayedPages != undefined) {
            params.displayedPages = data.displayedPages;
        }
        if (data.total != undefined) {
            params.total = data.total;
        }

        if (data.current != undefined) {
            params.current = data.current;

            let size = data.pageSize || this.state.pageSize;
            let total = data.total || this.state.total;

            if (params.current > this._calcPage(size, total)) {
                this.setState(params);
                this._changePageSize(parseInt(size, 10), true);
                return;
            }
        }

        this.setState(params);
        if (this.refs.pageNum) {
            this.refs.pageNum.setValue(params.current);
        }
    }

    /**
     * 计算页数
     * @method _calcPage
     * @param p
     * @param total
     * @returns {number}
     * @private
     */
    _calcPage(p, total) {
        let pageSize = p;
        if (typeof pageSize === 'undefined') {
            pageSize = this.state.pageSize;
        }
        total = total || this.state.total;
        return Math.floor((total - 1) / pageSize) + 1;
    }

    /**
     * 页数是否合法
     * @method _isValid
     * @param page {Number} 页号
     * @returns {boolean} 是否合法
     * @private
     */
    _isValid(page) {
        return typeof page === 'number' && page >= 1;
    }

    /**
     * 选择每页显示个数
     * @method _selectPageSize
     * @private
     */
    _selectPageSize(value){
        this._changePageSize(parseInt(value, 10));
    }

    /**
     * 改变每页显示个数
     * @method _changePageSize
     * @param size {Number} 每页记录数
     * @param preventCallback {Boolean} 阻止回调
     * @private
     */
    _changePageSize(size, preventCallback) {
        let current = this.state.current;

        this.setState({
            pageSize: size
        });
        if (this.state.current > this._calcPage(size)) {
            current = this._calcPage(size) || 1;
            this.setState({
                current: current
            });
        }
        if (this.refs.pageNum) {
            this.refs.pageNum.setValue(current);
        }
        if (!preventCallback) {
            if (this.props.onShowSizeChange) {
                this.props.onShowSizeChange(current, size);
                this.emit('showSizeChange', current, size);
            } else {
                this.goToPage();
            }
        } else {
            this.goToPage();
        }
    }

    /**
     * 页号改变
     * @method _handleChange
     * @param p 当前页号
     * @returns {*}
     * @private
     */
    _handleChange(p) {
        let page = p;
        if (this._isValid(page) && page !== this.state.current) {
            if (page > this._calcPage()) {
                page = this._calcPage();
            }

            if (!('current' in this.props)) {
                this.setState({
                    current: page
                });
            }

            this.update({current: page});
            if (this.props.onChange) {
                this.props.onChange(page, this.state.pageSize);
            }
            this.emit('change', page, this.state.pageSize);

            if (this.refs.pageNum) {
                this.refs.pageNum.setValue(page);
            }

            return page;
        }

        return this.state.current;
    }

    /**
     * 跳转到第几页
     * @method goToPage
     */
    goToPage(){
        var page = parseInt(this.refs.pageNum.getValue(), 10);
        if (this._isValid(page) && page <= this._calcPage()) {
            this._handleChange(page);
        } else {
            window.setTimeout(()=>{
                page = this._calcPage();
                this.refs.pageNum.setValue(page);
                if (page !== this.state.current) {
                    this._handleChange(page);
                }
            }, 0);
        }
    }

    handlerInput(){
        // if(value > this._calcPage()){
        //     value = this._calcPage();
        // }
        // this.setState({
        //     _current: value
        // });
    }

    /**
     * 页数框按下enter键跳转
     * @param e
     */
    keyUp(e){
        if (e.keyCode === 13) {
            this.goToPage();
        }
    }

    /**
     * 前一页
     * @method _prev
     * @private
     */
    _prev() {
        if (this._hasPrev()) {
            this._handleChange(this.state.current - 1);
        }
    }

    /**
     * 后一页
     * @method _next
     * @private
     */
    _next() {
        if (this._hasNext()) {
            this._handleChange(this.state.current + 1);
        }
    }

    /**
     * 是否有前一页
     * @method _hasPrev
     * @returns {boolean}
     * @private
     */
    _hasPrev() {
        return this.state.current > 1;
    }

    /**
     * 是否存在后一页
     * @method _hasNext
     * @returns {boolean}
     * @private
     */
    _hasNext() {
        return this.state.current < this._calcPage();
    }

    /**
     * 跳到第一页
     * @method _jumpPrev
     * @private
     */
    _jumpPrev() {
        this._handleChange(Math.max(1, this.state.current - 5));
    }

    /**
     * 跳到后一页
     * @method _jumpNext
     * @private
     */
    _jumpNext() {
        this._handleChange(Math.min(this._calcPage(), this.state.current + 5));
    }

    /**
     * 获取中间显示的页号
     * @method _getInterval
     * @returns {{start: number, end: number}}
     * @private
     */
    _getInterval() {
        let state = this.state;
        let pages = this._calcPage();
        let displayedPages = state.displayedPages;
        let half = displayedPages / 2;
        return {
            start: Math.ceil(state.current > half
                ? Math.max(Math.min(state.current - half, (pages - displayedPages)), 0)
                : 0),
            end: Math.ceil(state.current > half ? Math.min(state.current + half, pages) : Math.min(half, pages))
        };
    }

    render(){
        let pages = this._calcPage();
        let pagerList = [];

        let current = this.state.current;
        let interval = this._getInterval();
        if (pages <= 9) {
            for (let i = 0; i < pages; i++) {
                let active = current === i + 1;
                pagerList.push((<PageItem key={i + 1} onClick={this._handleChange.bind(this, i + 1)}
                    active={active} currentIndex={i + 1} />));
            }
        } else {
            let edges = 2;
            let end = Math.min(edges, interval.start);
            for (let i = 0; i < end; i++) {
                pagerList.push(<PageItem key={i + 1} onClick={this._handleChange.bind(this, i + 1)}
                    currentIndex={i + 1} />);
            }
            if (edges < interval.start && (interval.start - edges !== 1)) {
                pagerList.push(<li key={'...1'} className='disabled'><span className='ellipse'>•••</span></li>);
            } else if (interval.start - edges === 1) {
                pagerList.push(<PageItem key={edges + 1} onClick={this._handleChange.bind(this, edges + 1)}
                    currentIndex={edges + 1} />);
            }

            for (let j = interval.start; j < interval.end; j++) {
                let active = current === j + 1;
                pagerList.push(<PageItem key={j + 1} onClick={this._handleChange.bind(this, j + 1)}
                    currentIndex={j + 1} active={active} />);
            }

            if (interval.end < pages && edges > 0) {
                if (pages - edges > interval.end && (pages - edges - interval.end !== 1)) {
                    pagerList.push(<li key={'...2'} className='disabled'><span className='ellipse'>•••</span></li>);
                } else if (pages - edges - interval.end === 1) {
                    pagerList.push(<PageItem key={interval.end + 1}
                        onClick={this._handleChange.bind(this, interval.end + 1)}
                        currentIndex={interval.end + 1} />);
                }
                let begin = Math.max(pages - edges, interval.end);
                for (let k = begin; k < pages; k++) {
                    pagerList.push(<PageItem key={k + 1} onClick={this._handleChange.bind(this, k + 1)}
                        currentIndex={k + 1} />);
                }
            }
        }

        let className = classNames('cm-pagination', this.state.theme, this.props.className, this.props.shape);
        return (
            <div className={className}>
                <ul style={{float: 'left'}} className='cm-pagination-num-list'>
                    <PagePrev current={current} onClick={this._prev.bind(this, null)} />
                    {pagerList}
                    <PageNext current={current} onClick={this._next.bind(this, null)} disabled={current === pages} />
                </ul>
                {this.state.displayInfo
                    ? <div className='pagination-info'>
                        <span className='page-code ml-5'>
                            <Select ref='pageSize' value={this.state.pageSize + ''}
                                onChange={this._selectPageSize.bind(this)}
                                style={{width: 65}} data={[
                                    {id: '10', text: '10/页'},
                                    {id: '50', text: '50/页'},
                                    {id: '100', text: '100/页'}
                                ]}
                            />
                        </span>
                        <span className='page-code mr-10'>
                            <span>到第</span>
                            <Input ref='pageNum' type='number' autoComplete='off' value={this.state.current}
                                onKeyUp={this.keyUp.bind(this)}
                                onChange={this.handlerInput.bind(this)}
                            />
                            <span>/{pages}页</span>
                        </span>
                        <Button theme='primary' flat onClick={this.goToPage.bind(this, null)}>确定</Button>
                    </div>
                    : null
                }
            </div>
        );
    }
}

Pagination.propTypes = {
    /**
     * 当前选中的页号
     * @attribute current
     * @type {number}
     */
    current: PropTypes.number,
    /**
     * 记录总数
     * @attribute total
     * @type {number}
     */
    total: PropTypes.number,
    /**
     * 每页记录数
     * @attribute pageSize
     * @type {number}
     */
    pageSize: PropTypes.number
};

export default Pagination;
