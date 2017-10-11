/**
 * @author cqb 2016-04-05.
 * @module TimePicker
 */

import React from 'react';
import BaseComponent from '../core/BaseComponent';
import moment from 'moment';
import classNames from 'classnames';
import Spinner from '../Spinner/index';
import './TimePicker.less';

class TimePicker extends BaseComponent{
    static displayName = 'TimePicker';
    static defaultProps = {
        value: '00:00:00',
        hourStep: 1,
        minute: 1,
        secondStep: 1,
        format: 'HH:mm:ss'
    };

    constructor(props){
        super(props);

        this.hasHour = props.format.indexOf('H') > -1;
        this.hasMinute = props.format.indexOf('m') > -1;
        this.hasSecond = props.format.indexOf('s') > -1;

        let arr = props.value.split(':');
        let time = moment();
        this.hasHour ? time.set('hour', parseInt(arr[0], 10)) : time.set('hour', 0);
        this.hasMinute ? time.set('minute', parseInt(arr[1], 10)) : time.set('minute', 0);
        this.hasSecond ? time.set('second', parseInt(arr[2], 10)) : time.set('second', 0);
        time.set('millisecond', 0);

        let value = time.format(props.format);

        this.addState({
            value: value,
            current: time
        });
    }

    plusHour = (v, step)=>{
        this.timeChange(step, 'hour', 'plus');
    }

    subHour = (v, step)=>{
        this.timeChange(-step, 'hour', 'sub');
    }

    plusMinute = (v, step)=>{
        this.timeChange(step, 'minute', 'plus');
    }

    subMinute = (v, step)=>{
        this.timeChange(-step, 'minute', 'sub');
    }

    plusSecond = (v, step)=>{
        this.timeChange(step, 'second', 'plus');
    }

    subSecond = (v, step)=>{
        this.timeChange(-step, 'second', 'sub');
    }

    timeChange(step, type, op){
        let time = this.state.current;
        let v = time.add(step, type).format(this.props.format);
        this.setState({value: v, current: moment(time)}, ()=>{
            this.emitChange(v, time, type, op);
        });
    }

    emitChange(v, time, type, op){
        if(this.props.onChange){
            this.props.onChange(v, time, type, op);
        }

        this.emit('change', v, time, type, op);
    }

    getValue(){
        return this.state.value;
    }

    getCurrent(){
        return this.state.current;
    }

    setValue(value){
        let arr = value.split(':');
        let time = moment();
        arr[0] = arr[0] || 0;
        arr[1] = arr[1] || 0;
        arr[2] = arr[2] || 0;
        time.set('hour', arr[0]);
        time.set('minute', arr[1]);
        time.set('second', arr[2]);
        time.set('millisecond', 0);
        value = time.format(this.props.format);

        this.setState({
            value: value,
            current: time
        });
    }

    componentWillReceiveProps (nextProps) {
        let value = nextProps.value;
        if (value !== this.props.value && value !== this.state.value) {
            this.setValue(value);
        }
    }

    renderTime(){
        let time = this.state.current;
        let hour = time.get('hour');
        let minute = time.get('minute');
        let second = time.get('second');
        let h = this.hasHour
            ? <Spinner loop size={this.props.size} value={hour} key="hour" max={23} step={this.props.hourStep}
                onSub={this.subHour} onPlus={this.plusHour}
            />
            : null;
        let m = this.hasMinute
            ? <Spinner loop size={this.props.size} value={minute} key="munite" max={59} step={this.props.minuteStep}
                onSub={this.subMinute} onPlus={this.plusMinute}
            />
            : null;
        let s = this.hasSecond
            ? <Spinner loop size={this.props.size} value={second} key="second" max={59} step={this.props.secondStep}
                onSub={this.subSecond} onPlus={this.plusSecond}
            />
            : null;

        return [h, m, s];
    }

    render(){
        let {className, style} = this.props;
        className = classNames('cm-time-picker', className);
        return (
            <div className={className} style={style}>
                {this.renderTime()}
            </div>
        );
    }
}

export default TimePicker;
