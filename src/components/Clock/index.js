/**
 * @author cqb 2016-04-05.
 * @module Clock
 */

import React from 'react';
import BaseComponent from '../core/BaseComponent';
import moment from 'moment';
import TimePicker from '../TimePicker/index';
import './Clock.less';

/**
 * Clock 类
 * @class Clock
 * @constructor
 * @extend BaseComponent
 */
class Clock extends BaseComponent {
    static displayName = "Clock";

    static defaultProps = {
        value: '00:00:00',
        format: 'HH:mm:ss',
        hourStep: 1,
        minute: 1,
        secondStep: 1
    }
    constructor(props) {
        super(props);

        let arr = props.value.split(':');
        let time = moment();
        time.set('hour', parseInt(arr[0], 10));
        time.set('minute', parseInt(arr[1], 10));
        time.set('second', parseInt(arr[2], 10));

        this.state = {
            current: time
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ current: moment(nextProps.value) });
        }
    }

    /**
     * 渲染时刻
     * @method _renderNumbers
     * @returns {Array} 时刻元素列表
     * @private
     */
    _renderNumbers() {
        let ret = [];
        let radius = 130;
        let r = Math.PI / 6;
        for (let i = 1; i <= 12; i++) {
            let x = Math.sin(r * i);
            let y = Math.cos(r * i);
            let fx = 8 / radius / 2;
            let fy = 8 / radius / 2;
            let style = {
                left: (radius * (0.5 + x / 2 - fx)) + 'px',
                top: (radius * (0.5 - y / 2 - fy)) + 'px'
            };
            ret.push(<span key={i} style={style}>{i}</span>);
        }

        return ret;
    }

    /**
     * 构建指针
     * @method _renderHands
     * @returns {XML} 指针结构
     * @private
     */
    _renderHands() {
        let current = this.state.current;
        let hour = current.get('hour');
        let minute = current.get('minute');
        let second = current.get('second');
        let sr = -90 + 6 * second;
        let mr = -90 + 6 * (minute + second / 60);
        let hr = -90 + 30 * (hour + minute / 60 + second / 3600);


        let secondStyle = {
            'transform': 'rotateZ(' + sr + 'deg)',
            'msTransform': 'rotate(' + sr + 'deg)'
        };
        let minuteStyle = {
            'transform': 'rotateZ(' + mr + 'deg)',
            'msTransform': 'rotate(' + mr + 'deg)'
        };
        let hourStyle = {
            'transform': 'rotateZ(' + hr + 'deg)',
            'msTransform': 'rotate(' + hr + 'deg)'
        };
        return (
            <div className='click-hands'>
                <div className='hourHand' style={hourStyle} />
                <div className='minuteHand' style={minuteStyle} />
                <div className='secondHand' style={secondStyle} />
            </div>
        );
    }

    /**
     * 设置值
     * @method setValue
     * @param value {moment} moment对象
     */
    setValue(value){
        this.setState({
            current: value
        });
        if (this.props.onChange) {
            this.props.onChange(value);
        }

        this.emit('change', value);
    }

    /**
     * 关闭
     * @method close
     */
    close() {
        if (this.props.onTimeClose) {
            this.props.onTimeClose();
        }
    }

    /**
     * 获取当前的时刻
     * @method getTime
     * @returns {String} 当前的时刻
     */
    getTime() {
        return this.state.current.format('HH:mm:ss');
    }

    onChange = (v, time)=>{
        this.setValue(moment(time));
    }

    /**
     * 渲染
     * @method render
     * @returns {XML}
     */
    render() {
        let nums = this._renderNumbers();
        let hands = this._renderHands();
        let current = this.state.current;
        let value = current.format(this.props.format);

        let close = this.props.view === 'time' ? ''
            : (<div className='clock-close' onClick={this.close.bind(this)}>
                <span className='fa-stack text-center'>
                    <i className='fa fa-circle-o fa-stack-2x' />
                    <i className='fa fa-close fa-stack-1x' />
                </span>
            </div>);

        return (
            <div className='clock-container'>
                {close}
                <div className='clock-face'>
                    <div className='clock-numbers'>
                        {nums}
                    </div>
                    {hands}
                </div>
                <div className='spinners'>
                    <TimePicker
                        format={this.props.format}
                        value={value}
                        onChange={this.onChange}
                        hourStep={this.props.hourStep}
                        minuteStep={this.props.minuteStep}
                        secondStep={this.props.secondStep}
                    />
                </div>
            </div>
        );
    }
}

export default Clock;
