import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';
import moment from 'moment';
import ScrollDate from './ScrollDate';
import ScrollTime from './ScrollTime';
import Button from '../Button';

class ScrollDateTimeComp extends BaseComponent {
    displayName = 'ScrollDateTimeComp';

    static defaultProps = {
        value: '',
        format: '',
        view: 'ymdhms',
        startDate: '',
        endDate: ''
    }

    static propTypes = {
        value: PropTypes.string,
        format: PropTypes.string,
        view: PropTypes.oneOf(['ymdhms', 'ymdhm', 'ymdh', 'ymd', 'ym', 'y', 'hms', 'hm', 'h']),
        onChange: PropTypes.func,
        startDate: PropTypes.any,
        endDate: PropTypes.any
    }

    constructor (props) {
        super(props);

        this.format = '';
        this.f1 = '';
        this.f2 = '';
        this.initFormat(props);

        this.addState({
            visibility: false,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            value: this.props.value ? moment(this.props.value, this.format).format(this.format) : ''
        });
    }

    initFormat (props) {
        switch (props.view) {
            case 'ymdhms': {
                this.format = 'YYYY-MM-DD HH:mm:ss';
                this.f1 = 'YYYY-MM-DD';
                this.f2 = 'HH:mm:ss';
                break;
            }
            case 'ymdhm': {
                this.format = 'YYYY-MM-DD HH:mm';
                this.f1 = 'YYYY-MM-DD';
                this.f2 = 'HH:mm';
                break;
            }
            case 'ymdh': {
                this.format = 'YYYY-MM-DD HH';
                this.f1 = 'YYYY-MM-DD';
                this.f2 = 'HH';
                break;
            }
            case 'ymd': {
                this.format = 'YYYY-MM-DD';
                this.f1 = 'YYYY-MM-DD';
                this.f2 = '';
                break;
            }
            case 'ym': {
                this.format = 'YYYY-MM';
                this.f1 = 'YYYY-MM';
                this.f2 = '';
                break;
            }
            case 'y': {
                this.format = 'YYYY';
                this.f1 = 'YYYY';
                this.f2 = '';
                break;
            }
            case 'hms': {
                this.format = 'HH:mm:ss';
                this.f1 = '';
                this.f2 = 'HH:mm:ss';
                break;
            }
            case 'hm': {
                this.format = 'HH:mm';
                this.f1 = '';
                this.f2 = 'HH:mm';
                break;
            }
            case 'h': {
                this.format = 'HH';
                this.f1 = '';
                this.f2 = 'HH';
                break;
            }
            default : {
                this.format = 'YYYY-MM-DD HH:mm:ss';
                this.f1 = 'YYYY-MM-DD';
                this.f2 = 'HH:mm:ss';
            }
        }
    }

    /**
     * silence为true的话不触发onChange
     */
    changeDate = (value, silence) => {
        let v = value;
        if (this.scrollTime) {
            v += ` ${this.scrollTime.getValue()}`;
        }

        let finished = 0;
        let total = 1;
        const scrop = this;
        function hasFinished () {
            finished ++;
            if (finished === total) {
                const cv = scrop.getValue();
                if (v !== cv) {
                    scrop.setState({
                        value: cv
                    }, () => {
                        if (!silence && scrop.props.onChange) {
                            scrop.props.onChange(cv);
                        }
                    });
                } else {
                    if (!silence && scrop.props.onChange) {
                        scrop.props.onChange(cv);
                    }
                }
            }
        }

        if (this.state.endDate) {
            const end = moment(this.state.endDate, this.format).format(this.f1);
            if (end === value) {
                const te = this.f2 ? moment(this.state.endDate, this.format).format(this.f2) : '';
                if (this.scrollTime) {
                    total++;
                    this.scrollTime.setEndTime(te, () => {
                        hasFinished();
                    });
                }
            } else {
                if (this.scrollTime) {
                    total++;
                    this.scrollTime.setEndTime('', () => {
                        hasFinished();
                    });
                }
            }
        }
        if (this.state.startDate) {
            const start = moment(this.state.startDate, this.format).format(this.f1);
            if (start === value) {
                const ts = this.f2 ? moment(this.state.startDate, this.format).format(this.f2) : '';
                if (this.scrollTime) {
                    total++;
                    this.scrollTime.setStartTime(ts, () => {
                        hasFinished();
                    });
                }
            } else {
                if (this.scrollTime) {
                    total++;
                    this.scrollTime.setStartTime('', () => {
                        hasFinished();
                    });
                }
            }
        }

        this.setState({value: v}, () => {
            hasFinished();
        });
    }

    changeTime = (value) => {
        let v = value;
        if (this.scrollDate) {
            if (this.scrollDate.getValue()) {
                v = `${this.scrollDate.getValue()} ${v}`;
            } else {
                v = `${this.scrollDate.getScrollValue()} ${v}`;
            }
        }

        this.setState({value: v}, () => {
            if (this.props.onChange) {
                this.props.onChange(v);
            }
        });
    }

    renderDateTime () {
        switch (this.props.view) {
            case 'ymdhms': {
                return [<ScrollDate onChange={this.changeDate} ref={(f) => this.scrollDate = f} key='date'/>,<ScrollTime onChange={this.changeTime} ref={(f) => this.scrollTime = f} key='time'/>];
            }
            case 'ymdhm': {
                return [<ScrollDate onChange={this.changeDate} ref={(f) => this.scrollDate = f} key='date'/>,<ScrollTime onChange={this.changeTime} ref={(f) => this.scrollTime = f} key='time' minuteOnly/>];
            }
            case 'ymdh': {
                return [<ScrollDate onChange={this.changeDate} ref={(f) => this.scrollDate = f} key='date'/>,<ScrollTime onChange={this.changeTime} ref={(f) => this.scrollTime = f} key='time' hourOnly/>];
            }
            case 'ymd': {
                return <ScrollDate onChange={this.changeDate} ref={(f) => this.scrollDate = f} key='date'/>;
            }
            case 'ym': {
                return <ScrollDate onChange={this.changeDate} ref={(f) => this.scrollDate = f} key='date' monthOnly/>;
            }
            case 'y': {
                return <ScrollDate onChange={this.changeDate} ref={(f) => this.scrollDate = f} key='date' yearOnly/>;
            }
            case 'hms': {
                return <ScrollTime onChange={this.changeTime} ref={(f) => this.scrollTime = f} key='time'/>;
            }
            case 'hm': {
                return <ScrollTime onChange={this.changeTime} ref={(f) => this.scrollTime = f} key='time' minuteOnly/>;
            }
            case 'h': {
                return <ScrollTime onChange={this.changeTime} ref={(f) => this.scrollTime = f} key='time' hourOnly/>;
            }
            default : {
                return [<ScrollDate onChange={this.changeDate} ref={(f) => this.scrollDate = f} key='date'/>,<ScrollTime onChange={this.changeTime} ref={(f) => this.scrollTime = f} key='time'/>];
            }
        }
    }

    scrollTop () {
        if (this.scrollDate) {
            this.scrollDate.scrollTop();
        }
        if (this.scrollTime) {
            this.scrollTime.scrollTop();
        }
    }

    /**
     * 设置值
     * @method setValue
     * @param value {String} 当前值
     */
    setValue (value) {
        this.setState({
            value
        });
        if (value) {
            if (this.scrollDate) {
                const f = this.format.split(' ')[0];
                const date = moment(value, this.format).format(f);
                this.scrollDate.setValue(date);
                this.changeDate(date, true);
            }
            if (this.scrollTime) {
                const f = this.format.indexOf(' ') === -1 ? this.format : this.format.split(' ')[1];
                const time = moment(value, this.format).format(f);
                this.scrollTime.setValue(time);
            }
        }
    }

    /**
     * 获取值
     * @method getValue
     * @return {String} 当前值
     */
    getValue () {
        let d = '';
        let t = '';
        if (this.scrollDate) {
            d = this.scrollDate.getValue();
        }
        if (this.scrollTime) {
            t = this.scrollTime.getValue();
        }
        return `${d} ${t}`.trim();
    }

    getScrollValue () {
        let d = '';
        let t = '';
        if (this.scrollDate) {
            d = this.scrollDate.getScrollValue();
        }
        if (this.scrollTime) {
            t = this.scrollTime.getScrollValue();
        }
        return `${d} ${t}`.trim();
    }

    componentDidMount () {
        if (this.state.value) {
            this.setValue(this.state.value);
        }

        this.setStartDate(this.state.startDate);
        this.setEndDate(this.state.endDate);
    }

    selectToday = () => {
        const now = moment();
        this.setValue(now.format(this.format));
        if (this.props.onClickToday) {
            this.props.onClickToday();
        }
    }

    clear = () => {
        this.setValue('');
        this.hide();
        if (this.props.onChange) {
            this.props.onChange('');
        }
        if (this.props.onClickClear) {
            this.props.onClickClear();
        }
    }

    setStartDate (date) {
        let ds = '';
        let ts = '';

        this.setState({startDate: date});

        if (date) {
            ds = this.f1 ? moment(date, this.format).format(this.f1) : '';
            ts = this.f2 ? moment(date, this.format).format(this.f2) : '';
        }

        if (ds && this.scrollDate) {
            this.scrollDate.setStartDate(ds);
        }

        let dv = this.state.value ? this.f1 ? moment(this.state.value, this.format).format(this.f1) : '' : '';
        const sv = date ? this.f1 ? moment(date, this.format).format(this.f1) : '' : '';
        if (ts && this.scrollTime) {
            // 存在日期需要判断日期是否相等
            if (this.scrollDate) {
                if (!dv) {
                    dv = this.scrollDate.getScrollValue();
                }
                if (dv === sv) {
                    this.scrollTime.setStartTime(ts);
                } else {
                    this.scrollTime.setStartTime('');
                }
            } else { // 不存在日期 只存在时间
                this.scrollTime.setStartTime(ts);
            }
        } else {
            this.scrollTime ? this.scrollTime.setStartTime('') : false;
        }
    }

    setEndDate (date) {
        let de = '';
        let te = '';

        this.setState({endDate: date});

        if (date) {
            de = this.f1 ? moment(date, this.format).format(this.f1) : '';
            te = this.f2 ? moment(date, this.format).format(this.f2) : '';
        }

        if (de && this.scrollDate) {
            this.scrollDate.setEndDate(de);
        }

        let dv = this.state.value ? this.f1 ? moment(this.state.value, this.format).format(this.f1) : '' : '';
        const ev = date ? this.f1 ? moment(date, this.format).format(this.f1) : '' : '';
        if (te && this.scrollTime) {
            // 存在日期需要判断日期是否相等
            if (this.scrollDate) {
                if (!dv) {
                    dv = this.scrollDate.getScrollValue();
                }
                if (dv === ev) {
                    this.scrollTime.setEndTime(te);
                } else {
                    this.scrollTime.setEndTime('');
                }
            } else { // 不存在日期 只存在时间
                this.scrollTime.setEndTime(te);
            }
        } else {
            this.scrollTime ? this.scrollTime.setEndTime('') : false;
        }
    }

    render () {
        return (
            <div className='cm-scroll-datetime-comp'>
                {this.renderDateTime()}
                <div className='cm-scroll-datetime-tools'>
                    {this.props.today ? <Button theme='primary' className='mr-5 mt-10' onClick={this.selectToday}>{window.RCMUI_I18N['DateTime.today']}</Button> : null}
                    {this.props.clear ? <Button theme='primary' className='mr-5 mt-10' onClick={this.clear}>{window.RCMUI_I18N['DateTime.clear']}</Button> : null}
                </div>
            </div>
        );
    }
}

export default ScrollDateTimeComp;
