import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import BaseComponent from '../core/BaseComponent';
import Button from '../Button';
import Dom from '../utils/Dom';
import clickAway from '../utils/ClickAway';
import velocity from '../../lib/velocity';
import ScrollDateTime from '../ScrollDateTime/ScrollDateTime';
import FormControl from '../FormControl/index';

import '../ScrollDateTime/ScrollDateTime.less';
import './ScrollRangeDateTime.less';

class ScrollRangeDateTime extends BaseComponent {
    displayName = 'ScrollRangeDateTime';

    static defaultProps = {
        value: '',
        format: '',
        view: 'ymdhms',
        startDate: '',
        endDate: '',
        sep: '~',
        size: 'small',
        clear: false,
        maxRange: 0
    }

    static propTypes = {
        value: PropTypes.string,
        format: PropTypes.string,
        sep: PropTypes.string,
        view: PropTypes.oneOf(['ymdhms', 'ymdhm', 'ymdh', 'ymd', 'ym', 'y', 'hms', 'hm', 'h']),
        onChange: PropTypes.func,
        startDate: PropTypes.any,
        endDate: PropTypes.any,
        size: PropTypes.string,
        maxRange: PropTypes.number
    }

    constructor (props) {
        super(props);

        this.format = '';
        this.f1 = '';
        this.f2 = '';
        this.initFormat(props);

        let start; let end;
        if (props.value) {
            const values = props.value.split(props.sep);
            start = moment(values[0], this.format);
            end = moment(values[1], this.format);
        }

        this.isSibling = false;
        this.addState({
            visibility: false,
            start,
            end,
            startDate: this.props.startDate,
            endDate: this.props.endDate
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

        const container = Dom.closest(ele, '.cm-scroll-range-datetime');
        const offset = Dom.getOuterHeight(ele) + 5;
        const dropup = Dom.overView(container, offset);

        Dom.withoutTransition(container, () => {
            this.setState({ dropup });
            Dom.dom(ele).hide();
        });

        velocity(ele, 'fadeIn', {duration: 300});
        // this.updateRange();
        if (!this.state.visibility) {
            this.setState({ visibility: true });
            this.bindClickAway();
        }
    }

    hide () {
        const ele = this.wrap;
        velocity(ele, 'fadeOut', {
            delay: 200,
            duration: 300,
            complete: () => {
                this.setState({ visibility: false });
                this.unbindClickAway();
            }
        });
    }
    
    changeStart = () => {
        const v = this.startComp.getScrollValue();
        const start = moment(v, this.format);
        this.endComp.setStartDate(v);
        window.setTimeout(() => {
            let end = moment(this.endComp.getScrollValue(), this.format);
            if (this.props.maxRange) {
                const off = this.getOffsetDays(start, end);
                if (off > this.props.maxRange) {
                    end = moment(start).add(this.props.maxRange, 'days');
                    this.endComp.setValue(end.format(this.format));
                }
            }
            this.setState({start, end}, () => {
                if (this.props.onChange) {
                    this.props.onChange(this.getValue());
                }
            });
        }, 0);
    }

    changeEnd = () => {
        const v = this.endComp.getScrollValue();
        this.startComp.setEndDate(v);
        const end = moment(v, this.format);

        window.setTimeout(() => {
            let start = moment(this.startComp.getScrollValue(), this.format);
            if (this.props.maxRange) {
                const off = this.getOffsetDays(start, end);
                if (off > this.props.maxRange) {
                    start = moment(end).add(-this.props.maxRange, 'days');
                    this.startComp.setValue(start.format(this.format));
                }
            }
            this.setState({start, end}, () => {
                if (this.props.onChange) {
                    this.props.onChange(this.getValue());
                }
            });
        }, 0);
    }

    getOffsetDays (start, end) {
        return end.diff(start, 'days');
    }

    getValue () {
        return this.state.start ? this.state.start.format(this.format) + this.props.sep + this.state.end.format(this.format) : '';
    }

    setValue (value) {
        let start; let end;
        if (value) {
            const values = value.split(this.props.sep);
            start = moment(values[0], this.format);
            end = moment(values[1], this.format);
        }
        this.setState({start, end});
    }

    componentDidMount () {
        if (this.state.start) {
            const startValue = this.state.start.format(this.format);
            const endValue = this.state.end.format(this.format);
            this.startComp.setValue(startValue);
            this.endComp.setValue(endValue);
        }
    }

    clear = () => {
        this.setValue('');
    }

    render () {
        const {className, disabled, style, size} = this.props;
        const clazzName = classNames(
            className,
            'cm-scroll-datetime',
            'cm-scroll-range-datetime',
            this.state.theme,
            {
                disabled,
                dropup: this.state.dropup,
                [`cm-scroll-datetime-${size}`]: size
            }
        );

        const start = this.state.start ? this.state.start.format(this.format) : '';
        const end = this.state.end ? this.state.end.format(this.format) : '';

        const startName = this.props.startName || 'startDate';
        const endName = this.props.endName || 'endDate';

        const startText = (<span className='cm-scroll-datetime-text'>
            <input type='hidden' name={startName} value={start} className={this.props.startClass}/>
            {start}&nbsp;</span>);
        const endText = (<span className='cm-scroll-datetime-text'>
            <input type='hidden' name={endName} value={end} className={this.props.endClass}/>{end}&nbsp;</span>);

        const startValue = start ? start : moment().format(this.format);
        const endValue = end ? end : moment().format(this.format);
        return (
            <div className={clazzName} style={style} onClick={this.show}>
                {startText}
                {start ? this.props.sep : ''}
                {endText}
                <i className='fa fa-calendar' />

                <div className='cm-scroll-datetime-wrap' ref={(f) => this.wrap = f}
                    style={{display: this.state.visibility ? 'inline-block' : 'none'}}>
                    <ScrollDateTime ref={(f) => this.startComp = f} onChange={this.changeStart} view={this.props.view} value={startValue} startDate={this.props.startDate} endDate={this.props.endDate} />
                    <ScrollDateTime ref={(f) => this.endComp = f} onChange={this.changeEnd} view={this.props.view} value={endValue} startDate={this.props.startDate} endDate={this.props.endDate} />
                    <div className='cm-scroll-datetime-tools'>
                        {this.props.clear ? <Button theme='primary' className='mr-5 mt-10' onClick={this.clear}>{window.RCMUI_I18N['DateTime.clear']}</Button> : null}
                    </div>
                </div>
            </div>
        );
    }
}

clickAway(ScrollRangeDateTime);

FormControl.register(ScrollRangeDateTime, 'scrollRangeDateTime');

export default ScrollRangeDateTime;
