import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';
import classNames from 'classnames';
import moment from 'moment';
import ScrollDateTimeComp from './ScrollDateTime';
import FormControl from '../FormControl/index';
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
        size: 'small'
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
        this.comp.setValue(value);
    }

    /**
     * 获取值
     * @method getValue
     * @return {String} 当前值
     */
    getValue () {
        return this.comp.getValue();
    }

    /**
     * 设置开始时间
     * @param {*} startDate 
     */
    setStartDate (startDate) {
        this.comp.setStartDate(startDate);
    }

    /**
     * 设置结束时间
     * @param {*} endDate 
     */
    setEndDate (endDate) {
        this.comp.setEndDate(endDate);
    }

    onClickToday = () => {
        window.setTimeout(() => {
            this.onChange(this.comp.getValue());
        }, 0);
        this.hide();
    }

    onClickClear = () => {
        this.hide();
    }

    onChange = (v) => {
        this.setState({value: v}, () => {
            if (this.props.onChange) {
                this.props.onChange(v);
            }
        });
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
                    <ScrollDateTimeComp onClickToday={this.onClickToday} onClickClear={this.onClickClear} {...this.props} ref={(f) => this.comp = f} onChange={this.onChange}/>
                </div>
            </div>
        );
    }
}

clickAway(ScrollDateTime);

FormControl.register(ScrollDateTime, 'scrollDateTime');

export default ScrollDateTime;
