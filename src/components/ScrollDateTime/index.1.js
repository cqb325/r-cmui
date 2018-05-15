import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import BaseComponent from '../core/BaseComponent';
import ScrollDate from './ScrollDate';
import ScrollTime from './ScrollTime';
import Button from '../Button';

import Dom from '../utils/Dom';
import clickAway from '../utils/ClickAway';
import velocity from '../../lib/velocity';

import './ScrollDateTime.less';

class ScrollDateTime extends BaseComponent {
    displayName = 'ScrollDateTime';

    static defaultProps = {
        value: '',
        format: '',
        view: 'ymdhms',
        startDate: '',
        endDate: '',
        size: ''
    }

    static propTypes = {
        value: PropTypes.string,
        format: PropTypes.string,
        view: PropTypes.oneOf(['ymdhms', 'ymdhm', 'ymdh', 'ymd', 'ym', 'y', 'hms', 'hm', 'h']),
        onChange: PropTypes.func,
        startDate: PropTypes.any,
        endDate: PropTypes.any,
        size: PropTypes.oneOf(['', 'small'])
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

    changeDate = (value) => {
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
                        if (scrop.props.onChange) {
                            scrop.props.onChange(cv);
                        }
                    });
                } else {
                    if (scrop.props.onChange) {
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
                    this.scrollTime.setEndTime('');
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
                    this.scrollTime.setEndTime('');
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
            v = `${this.scrollDate.getValue()} ${v}`;
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

    /**
     * ClickAway 点击别的地方的回调
     * @method componentClickAway
     */
    componentClickAway () {
        this.hide();
    }

    show = () => {
        if (this.props.disabled) {
            return;
        }

        if (this.state.visibility) {
            return false;
        }

        const ele = this.wrap;
        Dom.dom(ele).show();
        const container = Dom.closest(ele, '.cm-scroll-datetime');
        const offset = Dom.getOuterHeight(ele) + 5;
        const dropup = Dom.overView(container, offset);

        Dom.withoutTransition(container, () => {
            this.setState({ dropup });
            Dom.dom(ele).hide();
        });

        velocity(ele, 'fadeIn', {duration: 300});

        if (!this.state.visibility) {
            this.setState({ visibility: true }, () => {
                this.bindClickAway();
            });
        }
    }

    /**
     * 隐藏操作
     * @method show
     * @returns {boolean}
     */
    hide () {
        const ele = this.wrap;
        velocity(ele, 'fadeOut', {
            delay: 100,
            duration: 200,
            complete: () => {
                this.setState({ visibility: false });
                this.unbindClickAway();
            }
        });
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
                this.changeDate(date);
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

    componentDidMount () {
        if (this.state.value) {
            this.setValue(this.state.value);
        }

        let ds = '';
        let ts = '';
        let de = '';
        let te = '';
        if (this.state.startDate) {
            ds = this.f1 ? moment(this.state.startDate, this.format).format(this.f1) : '';
            ts = this.f2 ? moment(this.state.startDate, this.format).format(this.f2) : '';
        }
        if (this.state.endDate) {
            de = this.f1 ? moment(this.state.endDate, this.format).format(this.f1) : '';
            te = this.f2 ? moment(this.state.endDate, this.format).format(this.f2) : '';
        }
        if (ds && this.scrollDate) {
            this.scrollDate.setStartDate(ds);
        }
        if (de && this.scrollDate) {
            this.scrollDate.setEndDate(de);
        }
        const dv = this.state.value ? this.f1 ? moment(this.state.value, this.format).format(this.f1) : '' : '';
        const sv = this.state.startDate ? this.f1 ? moment(this.state.startDate, this.format).format(this.f1) : '' : '';
        const ev = this.state.endDate ? this.f1 ? moment(this.state.endDate, this.format).format(this.f1) : '' : '';
        if (ts && this.scrollTime) {
            if (sv && dv === sv) {
                this.scrollTime.setStartTime(ts);
            }
        }
        if (te && this.scrollTime) {
            if (ev && dv === ev) {
                this.scrollTime.setEndTime(te);
            }
        }
    }

    selectToday = () => {
        const now = moment();
        this.setValue(now.format(this.format));
        this.hide();
    }

    clear = () => {
        this.setValue('');
        this.hide();
        if (this.props.onChange) {
            this.props.onChange('');
        }
    }

    render () {
        const {className, disabled, name, placeholder, style, size} = this.props;
        const clazzName = classNames(
            className,
            'cm-scroll-datetime',
            this.state.theme,
            {
                disabled,
                dropup: this.state.dropup,
                [`cm-scroll-datetime-${size}`]: size
            }
        );
        let text = this.state.value
            ? this.props.format ? moment(this.state.value, this.format).format(this.props.format) : this.state.value
            : '';
        text = text
            ? (<span className='cm-scroll-datetime-text'>
                <input type='hidden' name={name} defaultValue={this.state.value} />{text}
            </span>)
            : (<span className='cm-scroll-datetime-text'>
                <input type='hidden' name={name} defaultValue={this.state.value} />{placeholder}&nbsp;
            </span>);

        return (
            <div className={clazzName} style={style} onClick={this.show}>
                {text}
                <i className='fa fa-calendar' />
                <div className='cm-scroll-datetime-wrap' ref={(f) => this.wrap = f}>
                    {this.renderDateTime()}
                    <div className='cm-scroll-datetime-tools'>
                        {this.props.today ? <Button theme='primary' className='mr-5 mt-10' onClick={this.selectToday}>今天</Button> : null}
                        {this.props.clear ? <Button theme='primary' className='mr-5 mt-10' onClick={this.clear}>清除</Button> : null}
                    </div>
                </div>
            </div>
        );
    }
}

clickAway(ScrollDateTime);

export default ScrollDateTime;
