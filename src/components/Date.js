/**
 * @author cqb 2016-04-05.
 * @module Date
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import moment from 'moment';
import Clock from './Clock';

/**
 * Date 类
 * @class Date
 * @constructor
 * @extend BaseComponent
 */
class Date extends BaseComponent {
    constructor (props) {
        super(props);

        let stages = {
            'time': 0,
            'date': 1,
            'month': 2,
            'year': 3
        };

        this.view = props.view || 'datetime';
        let stage = this.view !== 'datetime' ? props.view : 'date';
        let minStage = 0;
        let maxStage = 3;
        if (props.timeOnly){
            this.view = stage = 'time';
            maxStage = 0;
        }
        if (props.dateOnly){
            minStage = 1;
            this.view = 'date';
        }
        if (props.monthOnly){
            this.view = stage = 'month';
            minStage = 2;
        }
        if (props.yearOnly){
            this.view = stage = 'year';
            minStage = 3;
        }
        this.minStage = minStage;
        this.maxStage = maxStage;

        this.maxRange = props.maxRange || 0;
        let current = moment();
        let format = props.format;
        if (props.value) {
            if (!format) {
                if (stages[stage] === 0) {
                    format = 'HH:mm:ss';
                    current = moment(props.value, format);
                } else {
                    current = moment(props.value);
                }
            } else {
                current = moment(props.value, format);
            }
        }

        this.addState({
            stage: stages[stage],
            value: props.value,
            format: format,
            current: current,
            startDate: props.startDate ? moment(props.startDate) : false,
            endDate: props.endDate ? moment(props.endDate) : false,
            prevBtn: props.prevBtn || true,
            nextBtn: props.nextBtn || true,
            selectedRange: []
        });
    }

    setMonthOnly(){
        this.minStage = 2;
        this.maxStage = 3;

        this.setState({
            stage: 2
        });
    }

    setYearOnly(){
        this.minStage = 3;
        this.maxStage = 3;

        this.setState({
            stage: 3
        });
    }

    setDateOnly(){
        this.minStage = 1;
        this.maxStage = 3;

        this.setState({
            stage: 1
        });
    }

    setTimeOnly(){
        this.minStage = 0;
        this.maxStage = 0;

        this.setState({
            stage: 0
        });
    }

    setFormat(format){
        if (this.state.format !== format) {
            this.setState({
                format
            });
        }
    }

    /**
     * 获取当前的时间
     */
    getCurrent(){
        return this.state.current;
    }

    /**
     * 设置current
     * @param current
     */
    setCurrent(current){
        this.setState({current});
    }

    show(){
        // let today = moment();
        //
        // this.setState({
        //     current: moment(this.state.value) || today
        // });
    }

    /**
     * 格式化值
     * @method formatValue
     * @param value {String} 日期的值
     * @returns {String} 格式化后的日期
     */
    formatValue(value){
        if (this.state.format){
            return moment(value).format(this.state.format);
        }

        let view = this.view;
        let format = null;
        if (view === 'datetime'){
            format = 'YYYY-MM-DD HH:mm:ss';
        }
        if (view === 'date'){
            format = 'YYYY-MM-DD';
        }
        if (view === 'time'){
            format = 'HH:mm:ss';
        }

        if (view === 'month'){
            format = 'YYYY-MM-01';
        }
        if (view === 'year'){
            format = 'YYYY-01-01';
        }
        return format ? moment(value).format(format) : '';
    }

    /**
     * 日期选择回调 触发selectDate事件
     * @method dayChange
     * @param date {Object} moment对象
     */
    dayChange(date){
        let value = this.formatValue(date);
        if (!date.isSame(this.state.current, 'month')){
            this.emit('selectMonth', date.get('month'));
        }
        this.setState({
            value: value,
            current: date
        });

        this.valueChange(value, date.toDate());

        if (this.minStage === 0){
            setTimeout(() => {
                this.setState({
                    stage: 0
                });
            }, 0);
        } else {
            this.emit('hide');
        }
    }

    valueChange(value, date){
        this.emit('selectDate', value, date);
        if (this.props.onSelectDate){
            this.props.onSelectDate(value, date);
        }
    }

    /**
     * 选择年份 触发selectYear事件
     * @method yearChange
     * @param year {String} 选择的年份
     */
    yearChange(year) {
        var current = this.state.current;
        current.set({'year': year, date: 1});
        let state;
        if (this.minStage === 3){
            let value = this.formatValue(current);
            state = {
                value: value,
                current: current
            };

            this.valueChange(value, current.toDate());

            this.emit('hide');
        } else {
            state = {
                stage: 2,
                current: current
            };
        }
        setTimeout(() => {
            this.setState(state);
            this.emit('selectYear', year);
        }, 0);
    }

    /**
     * 月份选择，触发selectMonth事件
     * @method monthChange
     * @param month {String} 选择的年份
     */
    monthChange(month) {
        let current = this.state.current;
        current.set({'month': month, date: 1});

        let state;
        if (this.minStage === 2){
            let value = this.formatValue(current);
            state = {
                value: this.formatValue(current),
                current: current
            };

            this.valueChange(value, current.toDate());

            this.emit('hide');
        } else {
            state = {
                stage: 1,
                current: current
            };
        }
        setTimeout(() => {
            this.setState(state);
            this.emit('selectMonth', month);
        }, 0);
    }

    /**
     * 时刻变化，触发selectTime事件
     * @method timeChange
     * @param time{String} 选择的时刻
     */
    timeChange(time){
        time = time.time;
        let current = this.state.current;
        current.set({'hour': time.get('hour'), minute: time.get('minute'), second: time.get('second')});

        let value = this.formatValue(current);
        setTimeout(() => {
            this.setState({
                current: current,
                value: value
            });
        }, 0);

        this.valueChange(value, current.toDate());
        this.emit('selectTime', value, current.toDate());
    }

    hoverDay(d){
        this.emit('hoverDay', d);
    }

    /**
     * 改变当前日历显示状态
     * @method stageChange
     * @param stage {String} 显示的状态，包含datetime date time month year
     */
    stageChange(stage){
        if (stage < this.minStage || stage > this.maxStage){
            return;
        }
        if (this.state.stage === stage){
            stage = 1;
        }
        window.setTimeout(()=>{
            this.setState({stage});
        }, 0);
    }

    /**
     * 前一个月
     * @method prev
     */
    prev(){
        let stage = this.state.stage;
        let d;
        if (stage === 1) {
            d = this.state.current.add(-1, 'month');
        }
        if (stage === 2){
            d = this.state.current.add(-1, 'year');
        }
        this.setState({current: d});
        this.emit('selectPrev', d);
    }

    /**
     * 后一个月
     * @method prev
     */
    next() {
        let stage = this.state.stage;
        let d;
        if (stage === 1) {
            d = this.state.current.add(1, 'month');
        }
        if (stage === 2){
            d = this.state.current.add(1, 'year');
        }
        this.setState({current: d});
        this.emit('selectNext', d);
    }

    /**
     * 渲染要显示的日期，如果设置了startDate或endDate需要进行过滤
     * @method renderDays
     * @return {Array} 日期元素结构
     */
    renderDays(){
        let value = this.state.value;
        let current = moment(this.state.current);
        let year = current.year();
        let month = current.month();
        let first = moment(current.set('date', 1));
        let end = moment(first).add(1, 'months').add(-1, 'days');
        let min = 1 - first.weekday();
        let max = (Math.ceil((end.get('date') - min + 1) / 7) * 7);
        let days = [];
        let lines = [];
        let lineLength = 0;

        // 当前视窗需要渲染的日期
        for (let date, i = 0; i < max; i++) {
            let temp = moment(first);
            date = temp.add(i + min - 1, 'days');
            days.push(date);
        }

        lineLength = days.length / 7;

        // 当天
        let isToday = value
            ? (year === moment(value).get('year') && month === moment(value).get('month'))
            : false;

        let startDate = this.state.startDate;
        let endDate = this.state.endDate;

        let selectedRange = this.state.selectedRange;
        let rangeStart;
        let rangeEnd;

        if (selectedRange && selectedRange.length){
            rangeStart = moment(selectedRange[0]);
            rangeEnd = moment(selectedRange[1]);
            isToday = false;
        }

        let completion = this.props.completion === undefined ? true : this.props.completion;
        for (let i = 0; i < lineLength; i++){
            let line = [];
            for (let j = 0; j < 7; j++){
                let index = i * 7 + j;
                let d = days[index];

                // 日期过滤
                let disabled = (startDate && moment(d.format(startDate._f)).diff(startDate) < 0);
                disabled = disabled || ((endDate && moment(d.format(endDate._f)).diff(endDate) > 0));

                let rangeSelect = false;
                let isRangeStart = false;
                let isRangeEnd = false;
                if (rangeStart &&
                    (rangeStart.isBefore(d) || (rangeStart.isSame(d, 'day') &&
                    rangeStart.isSame(d, 'month') && rangeStart.isSame(d, 'year'))) &&
                    (d.isBefore(rangeEnd) || (rangeEnd.isSame(d, 'day') &&
                    rangeEnd.isSame(d, 'month') && rangeEnd.isSame(d, 'year')))){
                    rangeSelect = true;

                    if (rangeStart.isSame(d, 'day') && rangeStart.isSame(d, 'month') && rangeStart.isSame(d, 'year')){
                        isRangeStart = true;
                    }
                    if (rangeEnd.isSame(d, 'day') && rangeEnd.isSame(d, 'month') && rangeEnd.isSame(d, 'year')){
                        isRangeEnd = true;
                    }
                }

                let className = classNames(
                    'day',
                    {
                        disabled: disabled,
                        gray: d.get('month') !== month,
                        today: isToday && moment(value).get('date') === d.get('date') &&
                            moment(value).get('month') === d.get('month'),
                        rangeSelect: rangeSelect,
                        'cm-date-range-start': isRangeStart,
                        'cm-date-range-end': isRangeEnd
                    }
                );

                if (!completion && d.get('month') !== month){
                    line.push(<button type='button' key={index} className='day empty' />);
                } else {
                    line.push(<button type='button' onClick={() => {
                        this.dayChange(d);
                    }} onMouseOver={() => {
                        this.hoverDay(d);
                    }} key={index} className={className}><span>{d.get('date')}</span></button>);
                }
            }
            lines.push(<li key={i} className='cm-date-line'>{line}</li>);
        }
        return lines;
    }

    /**
     * 构建需要渲染的年份
     * @method renderYears
     * @returns {Array} 年份渲染结构
     */
    renderYears() {
        let current = moment(this.state.current);
        let year = current.get('year');

        let ret = [];
        for (let i = year - 12; i < year + 13; i++){
            let className = classNames('year', {
                'active': i === year
            });
            ret.push(<button type='button' onClick={() => { this.yearChange(i); }} key={i}
                className={className}>{i}</button>);
        }

        let lines = [];
        for (let i = 0; i < 5; i++){
            let line = [];
            for (let j = 0; j < 5; j++) {
                let index = i * 5 + j;
                line.push(ret[index]);
            }
            lines.push(<div className='cm-date-line' key={i}>{line}</div>);
        }

        return lines;
    }

    /**
     * 构建需要渲染的月份
     * @method renderMonths
     * @returns {Array} 月份渲染结构
     */
    renderMonths() {
        let current = moment(this.state.current);
        let year = current.get('year');
        let month = current.get('month');

        let startDate = this.state.startDate;
        let endDate = this.state.endDate;

        let ret = [];
        let months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        for (let i = 0; i < 12; i++){
            let disabled = false;
            if (startDate){
                if (startDate.get('year') > year){
                    disabled = true;
                }
                if (startDate.get('year') === year){
                    if (startDate.get('month') > i){
                        disabled = true;
                    }
                }
            }
            if (endDate){
                if (endDate.get('year') < year){
                    disabled = true;
                }
                if (endDate.get('year') === year){
                    if (endDate.get('month') < i){
                        disabled = true;
                    }
                }
            }
            let className = classNames('month', {
                disabled: disabled,
                active: i === month
            });
            ret.push(<button type='button' onClick={() => { this.monthChange(i); }} key={i} className={className}>
                {months[i]}</button>);
        }

        return ret;
    }

    /**
     * 关闭时钟
     * @method timeClose
     */
    timeClose() {
        if (this.view !== 'time') {
            window.setTimeout(()=>{
                this.setState({
                    stage: 1
                });
            });
        }
    }

    /**
     * 渲染时钟
     * @method renderClock
     * @returns {XML}
     */
    renderClock(){
        return (
            <Clock ref='clock' view={this.view}
                value={this.state.current}
                onChange={this.timeChange.bind(this)}
                onTimeClose={this.timeClose.bind(this)} />
        );
    }

    /**
     * 清除显示的日期
     * @method clear
     */
    clear() {
        this.setState({
            value: null
        });
    }

    /**
     * 清除显示的日期
     * @method today
     */
    today() {
        let time = moment(this.state.value);
        let today = moment();
        if (this.view === 'datetime'){
            let hour = time.get('hour');
            let minute = time.get('minute');
            let second = time.get('second');
            today.set('hour', hour);
            today.set('minute', minute);
            today.set('second', second);
        }

        this.setState({
            value: today,
            current: moment(today)
        });

        this.emit('selectDate', moment(today).toDate());
    }

    /**
     * 获取星期文案
     * @method _getWeek
     * @returns {Array} 星期结构
     * @private
     */
    _getWeek() {
        return ['日', '一', '二', '三', '四', '五', '六'].map(function (w, i) {
            return <div key={i} className='week'>{w}</div>;
        });
    }

    /**
     * 获取日历的头部
     * @method _getHeader
     * @returns {XML} 头部结构
     * @private
     */
    _getHeader(now) {
        if (this.state.stage === 0){
            return '';
        }
        let prev = (this.state.stage === 3 || !this.state.prevBtn)
            ? null
            : (<a className='prev' onClick={this.prev.bind(this)}>{'<'}</a>);
        let next = (this.state.stage === 3 || !this.state.nextBtn)
            ? null
            : (<a className='next' onClick={this.next.bind(this)}>{'>'}</a>);
        let month = this.state.stage > 1 ? null : (<a className='month' onClick={() => { this.stageChange(2); }}>
            {now.format('MM')}
        </a>);
        let year = this.state.stage >= 3 ? null : (<a className='year' onClick={() => { this.stageChange(3); }}>
            {now.format('YYYY')}
        </a>);
        return (
            <div style={this.props.style} className='date-picker-header'>
                {prev}
                {year}
                {month}
                {next}
            </div>
        );
    }

    /**
     * 日历footer结构
     * @method _getFooter
     * @returns {XML} footer结构
     * @private
     */
    _getFooter() {
        if (this.state.stage === 1 && this.props.tools) {
            return (
                <div className='date-picker-footer'>
                    <a className='clear' onClick={this.clear.bind(this)}>
                        清除
                    </a>
                    <a className='today-btn' onClick={this.today.bind(this)}>
                        今天
                    </a>
                </div>
            );
        } else {
            return '';
        }
    }

    /**
     * 根据日历的显示状态构建显示结构
     * @method _getView
     * @returns {XML} 显示结构
     * @private
     */
    _getView() {
        switch (this.state.stage){
            case 1:{
                // 星期结构
                let weeks = this._getWeek();
                let cont = this.renderDays();
                return (
                    <div className='inner'>
                        <div className='cm-date-week-line'>{weeks}</div>
                        <ul className='cm-date-lines'>{cont}</ul>
                    </div>
                );
            }
            case 3: {
                let cont = this.renderYears();
                return (
                    <div className='inner'>
                        <ul className='cm-date-lines cm-date-year-line'>{cont}</ul>
                    </div>
                );
            }
            case 2: {
                let cont = this.renderMonths();
                return (
                    <div className='inner'>
                        <ul className='cm-date-lines cm-date-month-line'>{cont}</ul>
                    </div>
                );
            }
            case 0: {
                let cont = this.renderClock();
                return (
                    <div className='inner'>
                        <ul className='cm-date-lines'>{cont}</ul>
                    </div>
                );
            }
        }
    }

    /**
     * 设置开始时间
     * @method setStartDate
     * @param start {String/moment} 要设置的时间值
     */
    setStartDate(start) {
        this.setState({
            startDate: moment(start)
        });
    }

    /**
     * 设置开始时间
     * @method setEndDate
     * @param end {String/moment} 要设置的时间值
     */
    setEndDate(end) {
        this.setState({
            endDate: moment(end)
        });
    }

    /**
     * 设置值
     * @method setValue
     * @param value {String} 当前值
     */
    setValue(value) {
        this.setState({
            value: value,
            current: moment(value)
        });
    }

    /**
     * 获取值
     * @method getValue
     * @return {String} 当前值
     */
    getValue() {
        return this.state.value;
    }

    /**
     * 渲染组件结构
     * @method render
     * @returns {XML}
     */
    render() {
        let className = classNames(
            this.props.className,
            'date-picker'
        );

        let now = moment(this.state.current);

        let header = this._getHeader(now);

        let view = this._getView();

        let footer = this._getFooter();

        return (
            <div className={className} style={this.props.style}>
                {header}
                {view}
                {footer}
            </div>
        );
    }
}

Date.propTypes = {
    /**
     * 自定义class
     * @attribute className
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * 自定义样式
     * @attribute style
     * @type {Object}
     */
    style: PropTypes.object,
    /**
     * 禁用
     * @attribute disabled
     * @type {Boolean}
     */
    disabled: PropTypes.bool,
    /**
     * 只读
     * @attribute readOnly
     * @type {Boolean}
     */
    readOnly: PropTypes.bool,
    /**
     * 默认值
     * @attribute value
     * @type {string/moment}
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)]),
    /**
     * 显示状态 'datetime','date','time'
     * @attribute view
     * @type {string}
     */
    view: PropTypes.oneOf(['datetime', 'date', 'time']),
    /**
     * 格式化
     * @attribute format
     * @type {string}
     */
    format: PropTypes.string,
    /**
     * 开始时间
     * @attribute startDate
     * @type {string/moment}
     */
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)]),
    /**
     * 结束时间
     * @attribute endDate
     * @type {string/moment}
     */
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)]),
    /**
     * 只显示时刻
     * @attribute timeOnly
     * @type {Boolean}
     */
    timeOnly: PropTypes.bool,
    /**
     * 只显示日期
     * @attribute dateOnly
     * @type {Boolean}
     */
    dateOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * 只显示月份
     * @attribute monthOnly
     * @type {Boolean}
     */
    monthOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * 只显示年份
     * @attribute yearOnly
     * @type {Boolean}
     */
    yearOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * 最小视图
     * @attribute minStage
     * @type {Number}
     */
    minStage: PropTypes.number,
    /**
     * 最大视图
     * @attribute maxStage
     * @type {Number}
     */
    maxStage: PropTypes.number,
    /**
     * 是否显示前一按钮
     * @attribute prevBtn
     * @type {Boolean}
     */
    prevBtn: PropTypes.bool,
    /**
     * 是否显示后一月按钮
     * @attribute nextBtn
     * @type {Boolean}
     */
    nextBtn: PropTypes.bool
};

export default Date;
