/**
 * @author cqb 2016-04-05.
 * @module DateRange
 */

import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import moment from 'moment';
import Dom from '../utils/Dom';
import clickAway from '../utils/ClickAway';
import Date from '../DateTime/Date';
import Button from '../Button/index';
import FormControl from '../FormControl/index';
import velocity from '../../lib/velocity';
import TimePicker from '../TimePicker/index';
import './DateRange.less';

/**
 * DateRange 类
 * @class DateRange
 * @constructor
 * @extend BaseComponent
 */
class DateRange extends BaseComponent {
    static displayName = 'DateRange';
    static defaultProps = {
        sep: '~',
        showTime: false,
        maxRange: 0,
        format: 'YYYY-MM-DD'
    };
    constructor (props) {
        super(props);

        this._selectedDate = [];
        const sep = props.sep;
        let start;
        let end;
        if (props.value) {
            const values = props.value.split(sep);
            start = moment(values[0]);
            end = moment(values[1]);
            
            this._selectedDate[0] = start;
            this._selectedDate[1] = end;
        } else {
            this._selectedDate[0] = moment();
            this._selectedDate[1] = moment();
        }

        this.maxRange = props.maxRange;
        this.isSibling = false;
        this._isSelecting = false;
        this.addState({
            visibility: false,
            start,
            end,
            startDate: props.startDate,
            endDate: props.endDate
        });
    }

    /**
     * 获取当前选中的值
     * @method getValue
     * @returns {Array} [start, end]
     */
    getValue () {
        if (this.state.start && this.state.end) {
            return [this.state.start.format(this.props.format), this.state.end.format(this.props.format)];
        } else {
            return '';
        }
    }

    setValue (value) {
        if (value) {
            const values = value.split(this.props.sep);
            const start = moment(values[0]);
            const end = moment(values[1]);
            this._selectedDate[0] = start;
            this._selectedDate[1] = end;
            this.setState({
                start,
                end
            }, () => {
                this.updateRange();
                this._selectDate();
            });
        } else {
            const start = moment();
            const end = moment();
            start.add(-1, 'month');

            const startDate = this.refs.startDate;
            const endDate = this.refs.endDate;

            this._selectedDate[0] = startDate;
            this._selectedDate[1] = endDate;

            this.checkIsSibling(start, end);

            this.setState({
                start: undefined,
                end: undefined
            }, () => {
                startDate.setState({
                    current: start
                });
        
                endDate.setState({
                    current: end
                });

                this.updateRange();
            });
        }
    }

    /**
     * ClickAway 点击别的地方的回调
     * @method componentClickAway
     */
    componentClickAway () {
        this.hide();
    }

    /**
     * 显示操作
     * @method show
     */
    show = () => {
        if (this.props.readOnly || this.props.disabled) {
            return;
        }

        if (this.state.visibility) {
            return false;
        }
        const ele = ReactDOM.findDOMNode(this.refs.datePicker);
        Dom.dom(ele).show();

        const container = Dom.closest(ele, '.cm-datetime');
        const offset = Dom.getOuterHeight(ele) + 5;
        const dropup = Dom.overView(container, offset);

        Dom.withoutTransition(container, () => {
            this.setState({ dropup });
            Dom.dom(ele).hide();
        });

        velocity(ele, 'fadeIn', {duration: 300});
        this.updateRange();
        if (!this.state.visibility) {
            this.setState({ visibility: true });
            this.bindClickAway();
        }
    }

    /**
     * 隐藏操作
     * @method show
     * @returns {boolean}
     */
    hide () {
        const ele = ReactDOM.findDOMNode(this.refs.datePicker);
        this._isSelecting = false;
        velocity(ele, 'fadeOut', {
            delay: 200,
            duration: 300,
            complete: () => {
                this.setState({ visibility: false });
                this.unbindClickAway();
            }
        });
    }

    /**
     * 选中开始日期回调
     */
    _selectStartDate = (value, date) => {
        if (!this._isSelecting) {
            if (this.props.onSelectStart) {
                this.props.onSelectStart(value, date);
            }
            this._isSelecting = true;
            this._selectedDate[0] = moment(value);
            this._selectedDate[1] = null;
            this.updateRange();
        } else {
            if (this._inMaxRange(value)) {
                this._isSelecting = false;
                this._selectedDate[1] = moment(value);
                this.updateRange();
                this._selectDate();
                this.hide();
            }
        }
    }

    /**
     * 选中结束日期回调
     */
    _selectEndDate = (value, date) => {
        if (!this._isSelecting) {
            if (this.props.onSelectEnd) {
                this.props.onSelectEnd(value, date);
            }
            this._isSelecting = true;
            this._selectedDate[0] = moment(value);
            this._selectedDate[1] = null;
            this.updateRange();
        } else {
            if (this._inMaxRange(value)) {
                this._isSelecting = false;
                this._selectedDate[1] = moment(value);
                this.updateRange();
                this._selectDate();
                this.hide();
            }
        }
    }
    /**
     * 更新选中的区域 高亮之
     */
    updateRange () {
        const startDate = this.refs.startDate;
        const endDate = this.refs.endDate;
        const startTime = this.refs.startTime;
        const endTime = this.refs.endTime;

        let selectedRange;
        
        if (this._selectedDate.length === 1) {
            this._selectedDate[0] = this.getRealDateTime(this._selectedDate[0], startTime);
            selectedRange = [this._selectedDate[0], this._selectedDate[0]];
        } else {
            this._selectedDate[0] = this.getRealDateTime(this._selectedDate[0], startTime);
            this._selectedDate[1] = this.getRealDateTime(this._selectedDate[1], endTime);
            
            selectedRange = [this._selectedDate[0], this._selectedDate[1]];
        }
        
        selectedRange.sort((a, b) => {
            return moment(a).toDate().getTime() - moment(b).toDate().getTime();
        });

        startDate.setState({
            selectedRange
        });
        endDate.setState({
            selectedRange
        });
    }

    /**
     * 获取真实的时间
     * 
     * @param {any} dateStr 
     * @param {any} timeRef 
     * @returns 
     * @memberof DateRange
     */
    getRealDateTime (dateStr, timeRef) {
        if (dateStr && timeRef) {
            let temp = moment(dateStr);
            const time = timeRef.getCurrent();
            temp.set('hour', time.get('hour'));
            temp.set('minute', time.get('minute'));
            temp.set('second', time.get('second'));

            if (this.props.endDate) {
                const endDate = moment(this.props.endDate);
                if (endDate.isBefore(temp)) {
                    temp = endDate;
                }
            }

            if (this.props.startDate) {
                const startDate = moment(this.props.startDate);
                if (temp.isBefore(startDate)) {
                    temp = startDate;
                }
            }

            return temp;
        } else {
            return dateStr;
        }
    }

    /**
     * 选择日期的时候显示选中的日期区域
     * @private
     */
    _selectDate () {
        const startTime = this.refs.startTime;
        const endTime = this.refs.endTime;
        this._selectedDate[0] = this.getRealDateTime(this._selectedDate[0], startTime);
        this._selectedDate[1] = this.getRealDateTime(this._selectedDate[1], endTime);

        this._selectedDate.sort((a, b) => {
            return moment(a).toDate().getTime() - moment(b).toDate().getTime();
        });
        
        this.setState({
            start: moment(this._selectedDate[0]),
            end: moment(this._selectedDate[1])
        });

        const startDate = this.refs.startDate;
        const endDate = this.refs.endDate;

        const startCurrent = moment(this._selectedDate[0]);
        const endCurrent = moment(this._selectedDate[1]);
        if (startCurrent.isSame(endCurrent, 'month') && startCurrent.isSame(endCurrent, 'year')) {
            if (startCurrent.isSame(startDate.state.current, 'month')) {
                endCurrent.set('date', 1);
                endCurrent.add(1, 'month');
            } else {
                startCurrent.set('date', 1);
                startCurrent.add(-1, 'month');
            }
        }
        
        startDate.setState({
            current: startCurrent
        });
        endDate.setState({
            current: endCurrent
        });

        if (this.props.onSelected) {
            this.props.onSelected(this._selectedDate[0], this._selectedDate[1]);
        }

        if (this.props.onChange) {
            const sep = this.props.sep;
            const start = moment(this._selectedDate[0]).format(this.props.format);
            const end = moment(this._selectedDate[1]).format(this.props.format);
            this.props.onChange(start + sep + end);
        }

        // this._selectedDate = [];
    }

    onChangeTime = () => {
        this.updateRange();
        this._selectDate();

        this.resetEndOutRange(this._selectedDate[0], this.refs.startTime);
        this.resetEndOutRange(this._selectedDate[1], this.refs.endTime);
        this.resetStartOutRange(this._selectedDate[0], this.refs.startTime);
        this.resetStartOutRange(this._selectedDate[1], this.refs.endTime);
    }
    
    resetEndOutRange (dateStr, ref) {
        if (dateStr && dateStr.isSame(this.props.endDate)) {
            const end = this.getNewDateTime(dateStr, ref.getCurrent());
            if (dateStr.isBefore(end)) {
                ref.setValue(dateStr.format('HH:mm:ss'));
            }
        }
    }

    resetStartOutRange (dateStr, ref) {
        if (dateStr && dateStr.isSame(this.props.startDate)) {
            const start = this.getNewDateTime(dateStr, ref.getCurrent());
            if (dateStr.isAfter(start)) {
                ref.setValue(dateStr.format('HH:mm:ss'));
            }
        }
    }

    getNewDateTime (dateStr, time) {
        if (dateStr && time) {
            const temp = moment(dateStr);
            temp.set('hour', time.get('hour'));
            temp.set('minute', time.get('minute'));
            temp.set('second', time.get('second'));

            return temp;
        }
        return null;
    }

    /**
     * mount的时候监听每个date的事件
     */
    componentDidMount () {
        let start = this.state.start;
        let end = this.state.end;
        if (!start) {
            start = moment();
            end = moment();
            start.add(-1, 'month');
        } else {
            start = moment(start);
            end = moment(end);
            if (start.format('YYYY-MM') == end.format('YYYY-MM')) {
                start.add(-1, 'month');
            }
        }

        const startDate = this.refs.startDate;
        const endDate = this.refs.endDate;

        this.checkIsSibling(start, end);

        startDate.setState({
            current: start
        });

        endDate.setState({
            current: end
        });

        this.updateRange();

        startDate.on('prev', () => {
            this.checkIsSibling();
        });
        startDate.on('next', () => {
            this.checkIsSibling();
        });
        startDate.on('selectMonth', () => {
            this.checkIsSibling();
        });

        endDate.on('prev', () => {
            this.checkIsSibling();
        });
        endDate.on('next', () => {
            this.checkIsSibling();
        });
        endDate.on('selectMonth', () => {
            this.checkIsSibling();
        });

        startDate.on('hoverDay', (d) => {
            if (this._isSelecting) {
                if (this._inMaxRange(d)) {
                    this._selectedDate[1] = d;
                    this.updateRange();
                } else {
                    this._selectMaxRange(d);
                }
            }
        });
        endDate.on('hoverDay', (d) => {
            if (this._isSelecting) {
                if (this._inMaxRange(d)) {
                    this._selectedDate[1] = d;
                    this.updateRange();
                } else {
                    this._selectMaxRange(d);
                }
            }
        });
    }

    _selectMaxRange (d) {
        const start = moment(this._selectedDate[0]);
        if (start.isBefore(d)) {
            this._selectedDate[1] = start.add(this.maxRange - 1, 'day');
        } else {
            this._selectedDate[1] = start.add(1 - this.maxRange, 'day');
        }

        this.updateRange();
    }

    _inMaxRange (d) {
        if (this.maxRange === 0) {
            return true;
        } else {
            const start = moment(this._selectedDate[0]);
            const arr = [start, moment(d)];
            arr.sort((a, b) => {
                return moment(a).toDate().getTime() - moment(b).toDate().getTime();
            });

            const temp = arr[0].add(this.maxRange - 1, 'day');
            return !temp.isBefore(arr[1]);
        }
    }

    /**
     * 检查月份是否相邻
     * @param start
     * @param end
     */
    checkIsSibling (start, end) {
        const startDate = this.refs.startDate;
        const endDate = this.refs.endDate;
        start = moment(start || startDate.state.current);
        start.set('date', 1);
        start.add(1, 'month');
        end = moment(end || endDate.state.current);

        let isSibling = false;
        if (start.get('month') == end.get('month') && start.get('year') == end.get('year')) {
            isSibling = true;
        }
        if (start.get('year') == end.get('year') && start.get('month') > end.get('month')) {
            const year = start.get('year');
            const month = start.get('month');

            end.set('year', year);
            end.set('month', month);
            end.set('date', 1);

            endDate.setCurrent(end);
            isSibling = true;
        }

        if (this.isSibling != isSibling) {
            this.isSibling = isSibling;

            window.setTimeout(() => {
                startDate.setState({
                    nextBtn: !isSibling
                });

                endDate.setState({
                    prevBtn: !isSibling
                });
            }, 0);
        }
    }

    selectShortCuts (fun) {
        if (fun) {
            const dates = fun();
            this._isSelecting = false;
            this._selectedDate[0] = dates[0];
            this._selectedDate[1] = dates[1];
            this.updateRange();
            this._selectDate();
            this.hide();
        }
    }

    clear = () => {
        this._selectedDate = [];
        this.updateRange();

        this.setState({
            start: null,
            end: null
        });

        this.hide();
    }

    renderTools () {
        const {clear} = this.props;
        if (clear) {
            return <span className='pull-right'>
                <Button theme='info' size='small' raised onClick={this.clear}>{window.RCMUI_I18N['DateRange.clear']}</Button>
            </span>;
        } else {
            return null;
        }
    }

    renderShortCuts () {
        const {shortcuts} = this.props;
        if (shortcuts) {
            return shortcuts.map(function (shortcut, index) {
                let callback = null;
                let name;
                if (typeof shortcut === 'string') {
                    name = shortcut;
                    callback = DateRange.SHORTCUTS[shortcut];
                } else {
                    name = shortcut.name;
                    callback = shortcut.dates;
                }

                if (callback) {
                    return (<a href='javascript:void(0)' className='date-range-shortcut' key={index}
                        onClick={this.selectShortCuts.bind(this, callback)}>{name}</a>);
                } else {
                    return null;
                }
            }, this);
        } else {
            return null;
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
            this.setValue(nextProps.value);
        }
    }

    /**
     * 渲染组件结构
     * @method render
     * @returns {XML}
     */
    render () {
        const className = classNames(
            this.props.className,
            'cm-datetime',
            'cm-dateRange',
            this.state.theme,
            {
                disabled: this.props.disabled || this.props.readOnly,
                dropup: this.state.dropup
            }
        );

        const sep = this.props.sep || '~';
        const start = this.state.start ? this.state.start.format(this.props.format) : '';
        const end = this.state.end ? this.state.end.format(this.props.format) : '';
        const f = this.props.format.split(' ')[1];
        const startTime = start.split(' ')[1];
        const endTime = end.split(' ')[1];
        const startName = this.props.startName || 'startDate';
        const endName = this.props.endName || 'endDate';
        const startText = (<span className='date-text'>
            <input type='hidden' name={startName} value={start} className={this.props.startClass}/>
            {start}&nbsp;</span>);
        const endText = (<span className='date-text'>
            <input type='hidden' name={endName} value={end} className={this.props.endClass}/>{end}&nbsp;</span>);

        const startProps = {
            dateOnly: true,
            value: start,
            completion: false,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        };
        const endProps = {
            dateOnly: true,
            value: end,
            completion: false,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        };

        const shortcuts = this.renderShortCuts();
        const tools = this.renderTools();
        const hasToolsCont = shortcuts || tools;

        return (<div ref='datetime' onClick={this.show} className={className} style={this.props.style || {}}>
            {startText}
            {start ? sep : ''}
            {endText}
            <i className='fa fa-calendar' />
            <div className='cm-datetime-wrap' ref='datePicker'
                style={{display: this.state.visibility ? 'block' : 'none'}}>
                {
                    hasToolsCont
                        ? <div className='tools-info'>
                            {shortcuts}
                            {tools}
                        </div>
                        : null
                }
                <Date ref='startDate' {...startProps} onSelectDate={this._selectStartDate} />
                <Date ref='endDate' {...endProps} onSelectDate={this._selectEndDate} />
                {this.props.showTime
                    ? <div className='cm-row mt-10 mb-5'>
                        <div className='cm-col-xs-12 text-center'>
                            <TimePicker format={f} ref='startTime' onChange={this.onChangeTime} size='small' value={startTime} />
                        </div>
                        <div className='cm-col-xs-12 text-center'>
                            <TimePicker format={f} ref='endTime' onChange={this.onChangeTime} size='small' value={endTime} />
                        </div>
                    </div>
                    : null
                }
            </div>
        </div>);
    }
}

clickAway(DateRange);

DateRange.SHORTCUTS = {
    '一周内' () {
        const end = moment();
        const start = moment();
        start.add(-6, 'day');

        return [start, end];
    },
    '一个月内' () {
        const end = moment();
        const start = moment();
        start.add(-1, 'month');

        return [start, end];
    },
    '三个月内' () {
        const end = moment();
        const start = moment();
        start.add(-3, 'month');

        return [start, end];
    },
    '半年内' () {
        const end = moment();
        const start = moment();
        start.add(-6, 'month');

        return [start, end];
    },
    '一年内' () {
        const end = moment();
        const start = moment();
        start.add(-1, 'year');

        return [start, end];
    },
    '一周后' () {
        const end = moment();
        const start = moment();
        end.add(6, 'day');

        return [start, end];
    },
    '一个月后' () {
        const end = moment();
        const start = moment();
        end.add(1, 'month');

        return [start, end];
    },
    '三个月后' () {
        const end = moment();
        const start = moment();
        end.add(3, 'month');

        return [start, end];
    },
    '半年后' () {
        const end = moment();
        const start = moment();
        end.add(6, 'month');

        return [start, end];
    },
    '一年后' () {
        const end = moment();
        const start = moment();
        end.add(1, 'year');

        return [start, end];
    }
};

DateRange.propTypes = {
    /**
     * 默认值
     * @attribute value
     * @type {String}
     */
    value: PropTypes.string,
    /**
     * 分割符
     * @attribute sep
     * @type {String}
     */
    sep: PropTypes.string
};

FormControl.register(DateRange, 'daterange');

export default DateRange;
