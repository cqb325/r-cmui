/**
 * @author cqb 2018-05-13.
 * @module ScrollTime
 */
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Scroller from './Scroller';
import PropTypes from 'prop-types';

class ScrollTime extends React.Component {
    displayName = 'ScrollTime';

    static defaultProps = {
        value: '',
        format: 'HH:mm:ss',
        minuteOnly: false,
        hourOnly: false,
        startTime: '',
        endTime: ''
    };

    static propTypes = {
        value: PropTypes.string,
        format: PropTypes.string,
        minuteOnly: PropTypes.bool,
        hourOnly: PropTypes.bool,
        onChange: PropTypes.func,
        startTime: PropTypes.any,
        endTime: PropTypes.any
    }

    static HEAD = {
        HOUR: '时',
        MINUTE: '分',
        SECOND: '秒'
    }

    constructor (props) {
        super(props);

        this.state = {
            value: this.props.value,
            current: this.props.value ? moment(this.props.value) : moment(),
            startTime: this.props.startTime,
            endTime: this.props.endTime
        };
    }

    renderHead () {
        let arr = [ScrollTime.HEAD.HOUR, ScrollTime.HEAD.MINUTE, ScrollTime.HEAD.SECOND];
        if (this.props.hourOnly) {
            arr = [ScrollTime.HEAD.HOUR];
        }
        if (this.props.minuteOnly) {
            arr = [ScrollTime.HEAD.HOUR, ScrollTime.HEAD.MINUTE];
        }
        return arr.map((item) => {
            return <div key={item} className='cm-scroll-date-head-item'>{item}</div>;
        });
    }

    changeHour = () => {
        if (this.state.startTime || this.state.endTime) {
            this.hour.setEdge(this.getMinHour(), this.getMaxHour(), () => {
                if (this.minute) {
                    this.minute.setEdge(this.getMinMinute(), this.getMaxMinute(), () => {
                        if (this.second) {
                            this.second.setEdge(this.getMinSecond(), this.getMaxSecond(), () => {
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
        } else {
            this.update();
        }
    }

    changeMinute = () => {
        if (this.state.startTime || this.state.endTime) {
            if (this.second) {
                const max = this.getMaxSecond();
                this.second.setEdge(this.getMinSecond(), max, () => {
                    this.update();
                });
            } else {
                this.update();
            }
        } else {
            this.update();
        }
    }

    update = () => {
        const hour = this.hour.getValue();
        let minute = 0;
        let second = 0;
        if (this.minute) {
            minute = this.minute.getValue();
        }
        if (this.second) {
            second = this.second.getValue();
        }

        const current = moment().set('hour', hour).set('minute', minute).set('second', second);
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
        if (this.props.hourOnly) {
            f = 'HH';
        }
        if (this.props.minuteOnly) {
            f = 'HH:mm';
        }
        return f;
    }

    getMaxHour () {
        if (this.state.endTime) {
            const end = moment(this.state.endTime, this.getFormat()).get('hour');
            return end;
        } else {
            return 23;
        }
    }

    getMinHour () {
        if (this.state.startTime) {
            return moment(this.state.startTime, this.getFormat()).get('hour');
        } else {
            return 0;
        }
    }

    getMaxMinute () {
        if (this.state.endTime) {
            const end = moment(this.state.endTime, this.getFormat());
            const hour = end.get('hour');
            const current = this.state.current;
            const chour = this.hour ? this.hour.getValue() : current.get('hour');
            if (hour === chour) {
                return end.get('minute');
            } else {
                return 59;
            }
        } else {
            return 59;
        }
    }

    getMinMinute () {
        if (this.state.startTime) {
            const end = moment(this.state.startTime, this.getFormat());
            const hour = end.get('hour');
            const current = this.state.current;
            const chour = this.hour ? this.hour.getValue() : current.get('hour');
            if (hour === chour) {
                return end.get('minute');
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    getMaxSecond () {
        if (this.state.endTime) {
            const end = moment(this.state.endTime, this.getFormat());
            const hour = this.hour ? this.hour.getValue() : this.state.current.get('hour');
            const minute = this.minute ? this.minute.getValue() : this.state.current.get('minute');
            const current = moment().set('hour', hour).set('minute', minute);
            if (end.format('HH:mm') === current.format('HH:mm')) {
                return end.get('second');
            } else {
                return 59;
            }
        } else {
            return 59;
        }
    }

    getMinSecond () {
        if (this.state.startTime) {
            const end = moment(this.state.startTime, this.getFormat());
            const hour = this.hour ? this.hour.getValue() : this.state.current.get('hour');
            const minute = this.minute ? this.minute.getValue() : this.state.current.get('minute');
            const current = moment().set('hour', hour).set('minute', minute);
            if (end.format('HH:mm') === current.format('HH:mm')) {
                return end.get('second');
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    renderScrollers () {
        const current = this.state.current;
        const hour = current.get('hour');
        const hourScroller = <Scroller ref={(f) => this.hour = f} key='hour' min={this.getMinHour()} max={this.getMaxHour()} value={hour} onChange={this.changeHour}/>;
        const minute = current.get('minute');
        const minuteScroller = <Scroller ref={(f) => this.minute = f} key='minute' min={this.getMinMinute()} max={this.getMaxMinute()} value={minute} onChange={this.changeMinute}/>;
        const secondScroller = <Scroller ref={(f) => this.second = f} key='second' min={this.getMinSecond()} max={this.getMaxSecond()} value={current.get('second')} onChange={this.update}/>;

        if (this.props.hourOnly) {
            return hourScroller;
        }

        if (this.props.minuteOnly) {
            return [hourScroller, minuteScroller];
        }

        return [hourScroller, minuteScroller, secondScroller];
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
     * 设置截止时间
     * @param {*} endTime 
     */
    setEndTime (endTime, callback) {
        const current = this.state.current;
        if (endTime) {
            const end = moment(endTime, this.getFormat());
            if (this.props.hourOnly) {
                if (current.get('hour') > end.get('hour')) {
                    current.set('hour', end.get('hour'));
                }
            } else if (this.props.minuteOnly) {
                if (current.format('HHmm') > end.format('HHmm')) {
                    current.set('hour', end.get('hour'));
                    current.set('minute', end.get('minute'));
                    if (this.minute) {
                        this.minute.setMax(end.get('minute'));
                    }
                }
            } else {
                if (current.format('HHmmss') > end.format('HHmmss')) {
                    current.set('hour', end.get('hour'));
                    current.set('minute', end.get('minute'));
                    current.set('second', end.get('second'));
                    if (this.minute) {
                        this.minute.setMax(end.get('minute'));
                    }
                    if (this.second) {
                        this.second.setMax(end.get('second'));
                    }
                }
            }
        }
        this.setState({
            value: current.format(this.getFormat()),
            current,
            endTime
        }, () => {
            callback ? callback() : false;
        });
    }

    /**
     * 设置起始时间
     * @param {*} startTime 
     */
    setStartTime (startTime, callback) {
        const current = this.state.current;
        if (startTime) {
            const end = moment(startTime, this.getFormat());
            if (this.props.hourOnly) {
                if (current.get('hour') < end.get('hour')) {
                    current.set('hour', end.get('hour'));
                }
            } else if (this.props.minuteOnly) {
                if (current.format('HHmm') < end.format('HHmm')) {
                    current.set('hour', end.get('hour'));
                    current.set('minute', end.get('minute'));
                    if (this.minute) {
                        this.minute.setMin(end.get('minute'));
                    }
                }
            } else {
                if (current.format('HHmmss') < end.format('HHmmss')) {
                    current.set('hour', end.get('hour'));
                    current.set('minute', end.get('minute'));
                    current.set('second', end.get('second'));
                    if (this.minute) {
                        this.minute.setMin(end.get('minute'));
                    }
                    if (this.second) {
                        this.second.setMin(end.get('second'));
                    }
                }
            }
        }
        this.setState({
            value: current.format(this.getFormat()),
            current,
            startTime
        }, () => {
            callback ? callback() : false;
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
export default ScrollTime;
