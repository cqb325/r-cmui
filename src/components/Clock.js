/**
 * @author cqb 2016-04-05.
 * @module Clock
 */

import React from 'react';
import BaseComponent from './core/BaseComponent';
import moment from 'moment';

/**
 * Clock 类
 * @class Clock
 * @constructor
 * @extend BaseComponent
 */
class Clock extends BaseComponent {
    constructor(props) {
        super(props);

        let current = props.value ? moment(props.value) : '';
        if (current === '') {
            current = moment();
            current.set('hour', 0);
            current.set('minute', 0);
            current.set('second', 0);
        }

        this.state = {
            current: current
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
            'transform': 'rotateZ(' + sr + 'deg)'
        };
        let minuteStyle = {
            'transform': 'rotateZ(' + mr + 'deg)'
        };
        let hourStyle = {
            'transform': 'rotateZ(' + hr + 'deg)'
        };
        if (this.isLtIE9()) {
            this._calcFilter(sr, secondStyle, 52);
            this._calcFilter(mr, minuteStyle, 42);
            this._calcFilter(hr, hourStyle, 32);
        }
        return (
            <div className='click-hands'>
                <div className='hourHand' style={hourStyle} />
                <div className='minuteHand' style={minuteStyle} />
                <div className='secondHand' style={secondStyle} />
            </div>
        );
    }

    /**
     * 计算IE9以下的filter和位置
     * @method _calcFilter
     * @param deg {Number} 需要旋转的度数
     * @param style {Object} 样式对象
     * @param width {Number} 指针旋转的半径
     * @private
     */
    _calcFilter(deg, style, width) {
        let rad = deg * (Math.PI / 180);
        let m11 = Math.cos(rad);
        let m12 = -1 * Math.sin(rad);
        let m21 = Math.sin(rad);
        let m22 = m11;

        let dx = m11;
        let dy = m21;
        if (deg > 270) {
            deg = deg - 360;
        }
        if (deg < 0 && deg >= -90) {
            dx = 0;
            dy = m21 * width;
        } else if (deg >= 0 && deg <= 90) {
            dx = -8 * m11;
            dy = -m21 * 2;
        } else if (deg > 90 && deg <= 180) {
            dx = width * m11;
            dy = -1;
        } else if (deg > 180 && deg <= 270) {
            dx = width * m11;
            dy = m21 * width;
        }
        style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' +
            m11 + ',M12=' + m12 + ',M21=' + m21 + ',M22=' + m22 + ',SizingMethod="auto expand")';
        style['marginTop'] = dy + 'px';
        style['marginLeft'] = dx + 'px';
    }

    /**
     * 设置值
     * @method setValue
     * @param value {moment} moment对象
     */
    setValue(value){
        let d = {time: value};
        if (this.props.onChange) {
            this.props.onChange(d);
        }
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
     * 添加一小时
     * @method addHour
     */
    addHour() {
        let current = this.state.current;
        current.add(1, 'hour');

        this.setValue(current);
    }

    /**
     * 减少一小时
     * @method subHour
     */
    subHour(){
        let current = this.state.current;
        current.add(-1, 'hour');

        this.setValue(current);
    }

    /**
     * 添加一分钟
     * @method addMinute
     */
    addMinute() {
        let current = this.state.current;
        current.add(1, 'minute');

        this.setValue(current);
    }

    /**
     * 减少一分钟
     * @method subMinute
     */
    subMinute() {
        let current = this.state.current;
        current.add(-1, 'minute');

        this.setValue(current);
    }

    /**
     * 添加一秒
     * @method addSecond
     */
    addSecond() {
        let current = this.state.current;
        current.add(1, 'second');

        this.setValue(current);
    }

    /**
     * 减少一秒
     * @method subSecond
     */
    subSecond() {
        let current = this.state.current;
        current.add(-1, 'second');

        this.setValue(current);
    }

    /**
     * 获取当前的时刻
     * @method getTime
     * @returns {String} 当前的时刻
     */
    getTime() {
        return this.state.current.format('HH:mm:ss');
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
        let hour = current.get('hour');
        let minute = current.get('minute');
        let second = current.get('second');

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
                    <div className='hourSpinner spinner'>
                        <span className='spinner-value'>{hour}</span>
                        <span className='spinner-plus' onClick={this.addHour.bind(this)}>
                            <i className='fa fa-angle-up' />
                        </span>
                        <span className='spinner-subs' onClick={this.subHour.bind(this)}>
                            <i className='fa fa-angle-down' />
                        </span>
                    </div>
                    <div className='minuteSpinner spinner'>
                        <span className='spinner-value'>{minute}</span>
                        <span className='spinner-plus' onClick={this.addMinute.bind(this)}>
                            <i className='fa fa-angle-up' />
                        </span>
                        <span className='spinner-subs' onClick={this.subMinute.bind(this)}>
                            <i className='fa fa-angle-down' />
                        </span>
                    </div>
                    <div className='secondSpinner spinner'>
                        <span className='spinner-value'>{second}</span>
                        <span className='spinner-plus' onClick={this.addSecond.bind(this)}>
                            <i className='fa fa-angle-up' />
                        </span>
                        <span className='spinner-subs' onClick={this.subSecond.bind(this)}>
                            <i className='fa fa-angle-down' />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Clock;
