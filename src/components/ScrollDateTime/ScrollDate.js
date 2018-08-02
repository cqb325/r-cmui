/**
 * @author cqb 2018-05-12.
 * @module ScrollDate
 */
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Scroller from './Scroller';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';

class ScrollDate extends BaseComponent {
    displayName = 'ScrollDate';

    static defaultProps = {
        value: '',
        format: 'YYYY-MM-DD',
        yearOnly: false,
        monthOnly: false,
        startDate: '',
        endDate: ''
    };

    static propTypes = {
        value: PropTypes.string,
        format: PropTypes.string,
        yearOnly: PropTypes.bool,
        monthOnly: PropTypes.bool,
        onChange: PropTypes.func,
        startDate: PropTypes.any,
        endDate: PropTypes.any
    }

    static HEAD = {
        YEAR: window.RCMUI_I18N['ScrollDateTime.year'],
        MONTH: window.RCMUI_I18N['ScrollDateTime.month'],
        DATE: window.RCMUI_I18N['ScrollDateTime.day']
    }

    constructor (props) {
        super(props);

        this.state = {
            value: this.props.value,
            current: this.props.value ? moment(this.props.value) : moment(),
            endDate: this.props.endDate,
            startDate: this.props.startDate
        };
    }

    renderHead () {
        let arr = [ScrollDate.HEAD.YEAR, ScrollDate.HEAD.MONTH, ScrollDate.HEAD.DATE];
        if (this.props.yearOnly) {
            arr = [ScrollDate.HEAD.YEAR];
        }
        if (this.props.monthOnly) {
            arr = [ScrollDate.HEAD.YEAR, ScrollDate.HEAD.MONTH];
        }
        return arr.map((item) => {
            return <div key={item} className='cm-scroll-date-head-item'>{item}</div>;
        });
    }

    changeYear = (year) => {
        this.year.setEdge(this.getMinYear(year), this.getMaxYear(year), () => {
            if (this.month) {
                this.month.setEdge(this.getMinMonth(), this.getMaxMonth(), () => {
                    if (this.date) {
                        this.date.setEdge(this.getMinDate(), this.getMaxDate(), () => {
                            this.update();
                        });
                    } else {
                        this.update();
                    }
                });
            } else {
                this.update();
            }
        });
    }

    changeMonth = () => {
        if (this.date) {
            const max = this.getMaxDate();
            this.date.setEdge(this.getMinDate(), max, () => {
                this.update();
            });
        } else {
            this.update();
        }
    }

    changeDate = () => {
        this.update();
    }

    update () {
        const year = this.year.getValue();
        let month = 1;
        let date = 1;
        if (this.month) {
            month = this.month.getValue();
        }
        if (this.date) {
            date = this.date.getValue();
        }

        const current = moment().set('year', year).set('month', month - 1).set('date', date);
        const f = this.getFormat();
        const value = current.format(f);
        if (value !== this.state.value) {
            this.setState({
                value, current
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange(value);
                }
            });
        }
    }

    getFormat () {
        let f = this.props.format;
        if (this.props.yearOnly) {
            f = 'YYYY';
        }
        if (this.props.monthOnly) {
            f = 'YYYY-MM';
        }
        return f;
    }

    getMaxYear (year) {
        if (this.state.endDate) {
            const end = moment(this.state.endDate).get('year');
            return Math.min(year + 10, end);
        } else {
            return year + 10;
        }
    }

    getMinYear (year) {
        if (this.state.startDate) {
            const end = moment(this.state.startDate).get('year');
            return Math.max(year - 10, end);
        } else {
            return year - 10;
        }
    }

    getMaxMonth () {
        if (this.state.endDate) {
            const end = moment(this.state.endDate);
            const year = end.get('year');
            const current = this.state.current;
            const cyear = this.year ? this.year.getValue() : current.get('year');
            const month = end.get('month');
            if (year === cyear) {
                return month + 1;
            } else {
                return 12;
            }
        } else {
            return 12;
        }
    }

    getMinMonth () {
        if (this.state.startDate) {
            const end = moment(this.state.startDate);
            const year = end.get('year');
            const current = this.state.current;
            const cyear = this.year ? this.year.getValue() : current.get('year');
            const month = end.get('month');
            if (year === cyear) {
                return month + 1;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    }

    getMaxDate (init) {
        if (this.state.endDate) {
            const end = moment(this.state.endDate);
            const year = init ? this.state.current.get('year') : this.year.getValue();
            const month = init ? this.state.current.get('month') + 1 : this.month.getValue();
            const current = moment().set('year', year).set('month', month - 1);
            if (end.format('YYYY-MM') === current.format('YYYY-MM')) {
                return end.get('date');
            } else {
                return this.getNormalMaxDate();
            }
        } else {
            return this.getNormalMaxDate();
        }
    }

    getNormalMaxDate () {
        const year = this.state.current.get('year');
        const month = this.month ? this.month.getValue() : 1;
        const current = moment().set('year', year).set('month', month - 1).set('date', 1);
        const max = current.add(1, 'months').add(-1, 'days').get('date');
        return max;
    }

    getMinDate (init) {
        if (this.state.startDate) {
            const end = moment(this.state.startDate);
            const year = init ? this.state.current.get('year') : this.year.getValue();
            const month = init ? this.state.current.get('month') + 1 : this.month.getValue();
            const current = moment().set('year', year).set('month', month - 1);
            if (end.format('YYYY-MM') === current.format('YYYY-MM')) {
                return end.get('date');
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    }

    renderScrollers () {
        const current = this.state.current;
        const year = current.get('year');
        const yearScroller = <Scroller className='cm-date-scroll-item-year' ref={(f) => this.year = f} key='year' min={this.getMinYear(year)} max={this.getMaxYear(year)} value={year} onChange={this.changeYear}/>;
        const month = current.get('month');
        const monthScroller = <Scroller ref={(f) => this.month = f} key='month' min={this.getMinMonth()} max={this.getMaxMonth()} value={month + 1} onChange={this.changeMonth}/>;
        const max = this.getMaxDate(true);
        const dateScroller = <Scroller ref={(f) => this.date = f} key='date' min={this.getMinDate(true)} max={max} value={current.get('date')} onChange={this.changeDate}/>;

        if (this.props.yearOnly) {
            return yearScroller;
        }

        if (this.props.monthOnly) {
            return [yearScroller, monthScroller];
        }

        return [yearScroller, monthScroller, dateScroller];
    }

    scrollTop () {
        if (this.year) {
            this.year.scrollTop();
        }
        if (this.month) {
            this.month.scrollTop();
        }
        if (this.date) {
            this.date.scrollTop();
        }
    }

    getValue () {
        return this.state.value;
    }

    /**
     * 滚轮显示的值
     */
    getScrollValue () {
        const current = this.state.current;
        return current.format(this.getFormat());
    }

    setValue (value) {
        if (value) {
            this.setState({
                value: value || '',
                current: value ? moment(value, this.getFormat()) : moment()
            });
        }
    }

    /**
     * 设置截止日期
     * @param {*} endDate 
     */
    setEndDate (endDate) {
        const current = this.state.current;
        const end = moment(endDate);
        if (this.props.yearOnly) {
            if (current.get('year') > end.get('year')) {
                current.set('year', end.get('year'));
            }
        } else if (this.props.monthOnly) {
            if (current.format('YYYYMM') > end.format('YYYYMM')) {
                current.set('year', end.get('year'));
                current.set('month', end.get('month'));
                if (this.month) {
                    this.month.setMax(end.get('month') + 1);
                }
            }
        } else {
            if (current.format('YYYYMMDD') > end.format('YYYYMMDD')) {
                current.set('year', end.get('year'));
                current.set('month', end.get('month'));
                current.set('date', end.get('date'));
                if (this.month) {
                    this.month.setMax(end.get('month') + 1);
                }
                if (this.date) {
                    this.date.setMax(end.get('date'));
                }
            }
        }
        this.setState({
            value: current.format(this.getFormat()),
            current,
            endDate
        });
    }

    /**
     * 设置起始日期
     * @param {*} startDate 
     */
    setStartDate (startDate) {
        const current = this.state.current;
        const start = moment(startDate);
        if (this.props.yearOnly) {
            if (current.get('year') < start.get('year')) {
                current.set('year', start.get('year'));
            }
        } else if (this.props.monthOnly) {
            if (current.format('YYYYMM') < start.format('YYYYMM')) {
                current.set('year', start.get('year'));
                current.set('month', start.get('month'));
                if (this.month) {
                    this.month.setMin(start.get('month') + 1);
                }
            }
        } else {
            if (current.format('YYYYMMDD') < start.format('YYYYMMDD')) {
                current.set('year', start.get('year'));
                current.set('month', start.get('month'));
                current.set('date', start.get('date'));
                if (this.month) {
                    this.month.setMin(start.get('month') + 1);
                }
                if (this.date) {
                    this.date.setMin(start.get('date'));
                }
            }
        }
        this.setState({
            value: current.format(this.getFormat()),
            current,
            startDate
        });
    }

    componentWillReceiveProps (nextProps) {
        const v = nextProps.value === 'undefined' ? '' : nextProps.value;
        if (v !== this.props.value && v !== this.state.value) {
            this.setValue(v);
        }
    }

    render () {
        const {className, style} = this.props;
        const clazzName = classNames(className, 'cm-scroll-date');
        return (
            <div className={clazzName} style={style}>
                <div className='cm-scroll-date-head cm-row'>
                    {this.renderHead()}
                </div>
                <div className='cm-scroll-date-body cm-row'>
                    {this.renderScrollers()}
                </div>
            </div>
        );
    }
}
export default ScrollDate;
