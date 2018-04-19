/**
 * @author cqb 2016-04-05.
 * @module Date
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import moment from 'moment';
import Clock from '../Clock/index';

/**
 * Date 类
 * @class Date
 * @constructor
 * @extend BaseComponent
 */
class Date extends BaseComponent {
    static displayName = 'Date';

    static defaultProps = {
        value: '',
        format: 'YYYY-MM-DD HH:mm:ss',
        maxRange: 0,
        startDate: '',
        endDate: '',
        prevBtn: true,
        nextBtn: true,
        hourStep: 1,
        minute: 1,
        secondStep: 1
    };

    constructor (props) {
        super(props);

        const current = props.value ? moment(props.value, props.format) : moment();

        this.format = props.format;
        let stage = 1;
        let minStage = 0;
        let maxStage = 3;
        if (props.timeOnly) {
            maxStage = 0;
            stage = minStage;
        }
        if (props.dateOnly) {
            minStage = 1;
            stage = minStage;
        }
        if (props.monthOnly) {
            minStage = 2;
            stage = minStage;
        }
        if (props.yearOnly) {
            minStage = 3;
            stage = minStage;
        }
        this.minStage = minStage;
        this.maxStage = maxStage;

        this.addState({
            stage,
            value: props.value,
            current,
            startDate: props.startDate,
            endDate: props.endDate,
            prevBtn: props.prevBtn,
            nextBtn: props.nextBtn,
            selectedRange: []
        });
    }

    setMonthOnly () {
        this.minStage = 2;
        this.maxStage = 3;

        this.setState({
            stage: 2
        });
    }

    setYearOnly () {
        this.minStage = 3;
        this.maxStage = 3;

        this.setState({
            stage: 3
        });
    }

    setDateOnly () {
        this.minStage = 1;
        this.maxStage = 3;

        this.setState({
            stage: 1
        });
    }

    setTimeOnly () {
        this.minStage = 0;
        this.maxStage = 0;

        this.setState({
            stage: 0
        });
    }

    /**
     * 获取当前的时间
     */
    getCurrent () {
        return this.state.current;
    }

    /**
     * 设置current
     * @param current
     */
    setCurrent (current) {
        this.setState({current});
    }

    setStage (stage) {
        this.setState({stage});
    }

    getStage () {
        return this.state.stage;
    }

    /**
     * 格式化值
     * @method formatValue
     * @param value {String} 日期的值
     * @returns {String} 格式化后的日期
     */
    formatValue (value) {
        if (this.props.format) {
            return moment(value).format(this.props.format);
        }
    }

    /**
     * 日期选择回调 触发selectDate事件
     * @method dayChange
     * @param date {Object} moment对象
     */
    dayChange (date) {
        const value = this.formatValue(date);
        if (!date.isSame(this.state.current, 'month')) {
            this.emit('selectMonth', date.get('month'));
        }
        this.setState({
            value,
            current: date
        });

        this.valueChange(value, date.toDate());

        if (this.minStage === 0) {
            setTimeout(() => {
                this.setState({
                    stage: 0
                });
            }, 0);
        } else {
            this.emit('hide');
        }
    }

    valueChange (value, date) {
        this.emit('selectDate', value, date);
        if (this.props.onSelectDate) {
            this.props.onSelectDate(value, date);
        }
    }

    /**
     * 选择年份 触发selectYear事件
     * @method yearChange
     * @param year {String} 选择的年份
     */
    yearChange (year) {
        const current = this.state.current;
        current.set({year, date: 1});
        let state;
        if (this.minStage === 3) {
            const value = this.formatValue(current);
            state = {
                value,
                current
            };

            this.valueChange(value, current.toDate());

            this.emit('hide');
        } else {
            state = {
                stage: 2,
                current
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
    monthChange (month) {
        const current = this.state.current;
        current.set({month, date: 1});

        let state;
        if (this.minStage === 2) {
            const value = this.formatValue(current);
            state = {
                value: this.formatValue(current),
                current
            };

            this.valueChange(value, current.toDate());

            this.emit('hide');
        } else {
            state = {
                stage: 1,
                current
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
    timeChange = (time) => {
        const current = this.state.current;
        current.set({'hour': time.get('hour'), minute: time.get('minute'), second: time.get('second')});

        const value = this.formatValue(current);
        setTimeout(() => {
            this.setState({
                current,
                value
            });
        }, 0);

        this.valueChange(value, current.toDate());
        this.emit('selectTime', value, current.toDate());
    }

    hoverDay (d) {
        this.emit('hoverDay', d);
    }

    /**
     * 改变当前日历显示状态
     * @method stageChange
     * @param stage {String} 显示的状态，包含datetime date time month year
     */
    stageChange (stage) {
        if (stage < this.minStage || stage > this.maxStage) {
            return;
        }
        if (this.state.stage === stage) {
            stage = 1;
        }
        window.setTimeout(() => {
            this.setState({stage});
        }, 0);
    }

    /**
     * 前一个月
     * @method prev
     */
    prev = () => {
        const stage = this.state.stage;
        let d;
        if (stage === 1) {
            d = this.state.current.add(-1, 'month');
        }
        if (stage === 2) {
            d = this.state.current.add(-1, 'year');
        }
        d = moment(d);
        this.setState({current: d});
        if (this.props.onPrev) {
            this.props.onPrev(d);
        }
        this.emit('prev', d);
    }

    /**
     * 后一个月
     * @method prev
     */
    next = () => {
        const stage = this.state.stage;
        let d;
        if (stage === 1) {
            d = this.state.current.add(1, 'month');
        }
        if (stage === 2) {
            d = this.state.current.add(1, 'year');
        }
        d = moment(d);
        if (this.props.onNext) {
            this.props.onNext(d);
        }
        this.emit('next', d);
    }

    /**
     * 渲染要显示的日期，如果设置了startDate或endDate需要进行过滤
     * @method renderDays
     * @return {Array} 日期元素结构
     */
    renderDays () {
        const value = this.state.value;
        const current = moment(this.state.current);
        const year = current.year();
        const month = current.month();
        const first = moment(current.set('date', 1));
        first.set('hour', 0);
        first.set('minute', 0);
        first.set('second', 0);
        const end = moment(first).add(1, 'months').add(-1, 'days');
        const min = 1 - first.weekday();
        const max = (Math.ceil((end.get('date') - min + 1) / 7) * 7);
        const days = [];
        const lines = [];
        let lineLength = 0;

        // 当前视窗需要渲染的日期
        for (let date, i = 0; i < max; i++) {
            const temp = moment(first);
            date = temp.add(i + min - 1, 'days');
            days.push(date);
        }

        lineLength = days.length / 7;

        // 当天
        let isToday = value
            ? (year === moment(value).get('year') && month === moment(value).get('month'))
            : false;

        const startDate = this.state.startDate;
        const endDate = this.state.endDate;

        const selectedRange = this.state.selectedRange;
        let rangeStart;
        let rangeEnd;

        if (selectedRange && selectedRange.length) {
            rangeStart = moment(selectedRange[0]);
            rangeEnd = moment(selectedRange[1]);
            isToday = false;
        }

        const completion = this.props.completion === undefined ? true : this.props.completion;
        for (let i = 0; i < lineLength; i++) {
            const line = [];
            for (let j = 0; j < 7; j++) {
                const index = i * 7 + j;
                const d = days[index];

                // 日期过滤
                let disabled = (startDate && d.isBefore(moment(startDate)));
                disabled = disabled || ((endDate && d.isAfter(moment(endDate))));

                let rangeSelect = false;
                let isRangeStart = false;
                let isRangeEnd = false;
                if (rangeStart
                    && (rangeStart.isBefore(d) || (rangeStart.isSame(d, 'day')
                    && rangeStart.isSame(d, 'month') && rangeStart.isSame(d, 'year')))
                    && (d.isBefore(rangeEnd) || (rangeEnd.isSame(d, 'day')
                    && rangeEnd.isSame(d, 'month') && rangeEnd.isSame(d, 'year')))) {
                    rangeSelect = true;

                    if (rangeStart.isSame(d, 'day') && rangeStart.isSame(d, 'month') && rangeStart.isSame(d, 'year')) {
                        isRangeStart = true;
                    }
                    if (rangeEnd.isSame(d, 'day') && rangeEnd.isSame(d, 'month') && rangeEnd.isSame(d, 'year')) {
                        isRangeEnd = true;
                    }
                }

                const className = classNames(
                    'day',
                    {
                        disabled,
                        gray: d.get('month') !== month,
                        today: isToday && moment(value).get('date') === d.get('date')
                            && moment(value).get('month') === d.get('month'),
                        rangeSelect,
                        'cm-date-range-start': isRangeStart,
                        'cm-date-range-end': isRangeEnd
                    }
                );

                if (!completion && d.get('month') !== month) {
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
    renderYears () {
        const current = moment(this.state.current);
        const year = current.get('year');

        const ret = [];
        for (let i = year - 12; i < year + 13; i++) {
            const className = classNames('year', {
                'active': i === year
            });
            ret.push(<button type='button' onClick={() => { this.yearChange(i); }} key={i}
                className={className}>{i}</button>);
        }

        const lines = [];
        for (let i = 0; i < 5; i++) {
            const line = [];
            for (let j = 0; j < 5; j++) {
                const index = i * 5 + j;
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
    renderMonths () {
        const current = moment(this.state.current);
        const year = current.get('year');
        const month = current.get('month');

        const startDate = this.state.startDate;
        const endDate = this.state.endDate;

        const ret = [];
        const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        for (let i = 0; i < 12; i++) {
            let disabled = false;
            if (startDate) {
                if (startDate.get('year') > year) {
                    disabled = true;
                }
                if (startDate.get('year') === year) {
                    if (startDate.get('month') > i) {
                        disabled = true;
                    }
                }
            }
            if (endDate) {
                if (endDate.get('year') < year) {
                    disabled = true;
                }
                if (endDate.get('year') === year) {
                    if (endDate.get('month') < i) {
                        disabled = true;
                    }
                }
            }
            const className = classNames('month', {
                disabled,
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
    timeClose = () => {
        if (this.maxStage !== 0) {
            window.setTimeout(() => {
                this.setState({
                    stage: 1
                });
            }, 0);
        }
    }

    /**
     * 渲染时钟
     * @method renderClock
     * @returns {XML}
     */
    renderClock () {
        let f = this.props.format.split(' ');
        if (f.length === 2) {
            f = f[1];
        } else {
            f = 'HH:mm:ss';
        }
        return (
            <Clock ref='clock'
                value={this.state.current.format('HH:mm:ss')}
                format={f}
                hourStep={this.props.hourStep}
                minuteStep={this.props.minuteStep}
                secondStep={this.props.secondStep}
                onChange={this.timeChange}
                onTimeClose={this.timeClose} />
        );
    }

    /**
     * 清除显示的日期
     * @method clear
     */
    clear () {
        this.setState({
            value: null
        });

        if (this.props.onSelectDate) {
            this.props.onSelectDate('');
        }
        this.emit('selectDate', '');
    }

    /**
     * 清除显示的日期
     * @method today
     */
    today () {
        const time = moment(this.state.value);
        const today = moment();
        if (this.view === 'datetime') {
            const hour = time.get('hour');
            const minute = time.get('minute');
            const second = time.get('second');
            today.set('hour', hour);
            today.set('minute', minute);
            today.set('second', second);
        }

        this.setState({
            value: today,
            current: moment(today)
        });

        if (this.props.onSelectDate) {
            this.props.onSelectDate(today.format(this.props.format));
        }
        this.emit('selectDate', moment(today).toDate());
    }

    /**
     * 获取星期文案
     * @method _getWeek
     * @returns {Array} 星期结构
     * @private
     */
    _getWeek () {
        return ['日', '一', '二', '三', '四', '五', '六'].map((w, i) => {
            return <div key={i} className='week'>{w}</div>;
        });
    }

    /**
     * 获取日历的头部
     * @method _getHeader
     * @returns {XML} 头部结构
     * @private
     */
    _getHeader (now) {
        // 时间状态没有head
        if (this.state.stage === 0) {
            return '';
        }

        const prev = (this.state.stage === 3 || !this.state.prevBtn)
            ? null
            : <a className='prev' onClick={this.prev}>{'<'}</a>;
        const next = (this.state.stage === 3 || !this.state.nextBtn)
            ? null
            : <a className='next' onClick={this.next}>{'>'}</a>;
        const month = this.state.stage > 1
            ? null
            : <a className='month' onClick={() => { this.stageChange(2); }}>
                {now.format('MM')}
            </a>;
        const year = this.state.stage >= 3
            ? null
            : <a className='year' onClick={() => { this.stageChange(3); }}>
                {now.format('YYYY')}
            </a>;
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
    _getFooter () {
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
    _getView () {
        switch (this.state.stage) {
            case 1: {
                // 星期结构
                const weeks = this._getWeek();
                const cont = this.renderDays();
                return (
                    <div className='inner'>
                        <div className='cm-date-week-line'>{weeks}</div>
                        <ul className='cm-date-lines'>{cont}</ul>
                    </div>
                );
            }
            case 3: {
                const cont = this.renderYears();
                return (
                    <div className='inner'>
                        <ul className='cm-date-lines cm-date-year-line'>{cont}</ul>
                    </div>
                );
            }
            case 2: {
                const cont = this.renderMonths();
                return (
                    <div className='inner'>
                        <ul className='cm-date-lines cm-date-month-line'>{cont}</ul>
                    </div>
                );
            }
            case 0: {
                const cont = this.renderClock();
                return (
                    <div className='inner'>
                        <ul className='cm-date-lines'>{cont}</ul>
                    </div>
                );
            }
            default : {
                return null;
            }
        }
    }

    /**
     * 设置开始时间
     * @method setStartDate
     * @param start {String/moment} 要设置的时间值
     */
    setStartDate (start) {
        this.setState({
            startDate: moment(start)
        });
    }

    /**
     * 设置开始时间
     * @method setEndDate
     * @param end {String/moment} 要设置的时间值
     */
    setEndDate (end) {
        this.setState({
            endDate: moment(end)
        });
    }

    /**
     * 设置值
     * @method setValue
     * @param value {String} 当前值
     */
    setValue (value) {
        this.setState({
            value: value || '',
            current: value ? moment(value) : moment()
        });
    }

    /**
     * 获取值
     * @method getValue
     * @return {String} 当前值
     */
    getValue () {
        return this.state.value;
    }

    componentWillReceiveProps () {
        // if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
        //     this.setValue(nextProps.value);
        // }
    }

    /**
     * 渲染组件结构
     * @method render
     * @returns {XML}
     */
    render () {
        let {className, style} = this.props;
        className = classNames(
            className,
            'cm-date-picker'
        );

        const now = moment(this.state.current);

        const header = this._getHeader(now);

        const view = this._getView();

        const footer = this._getFooter();

        return (
            <div className={className} style={style}>
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
