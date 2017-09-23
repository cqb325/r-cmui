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

        let arr = props.value.split(':');
        let time = moment();
        time.set('hour', parseInt(arr[0], 10));
        time.set('minute', parseInt(arr[1], 10));
        time.set('second', parseInt(arr[2], 10));

        let value = time.format(props.format);
        this.hasHour = props.format.indexOf('H') > -1;
        this.hasMinute = props.format.indexOf('m') > -1;
        this.hasSecond = props.format.indexOf('s') > -1;

        this.addState({
            value: value,
            current: time
        });
    }

    hourChange = (v)=>{
        let time = this.state.current;
        v = time.set('hour', v).format(this.props.format);
        this.setState({value: v});

        this.emitChange(v, time);
    }

    minuteChange = (v)=>{
        let time = this.state.current;
        v = time.set('minute', v).format(this.props.format);
        this.setState({value: v});

        this.emitChange(v, time);
    }

    secondChange = (v)=>{
        let time = this.state.current;
        v = time.set('second', v).format(this.props.format);
        this.setState({value: v});

        this.emitChange(v, time);
    }

    emitChange(v, time){
        if(this.props.onChange){
            this.props.onChange(v, time);
        }

        this.emit('change', v, time);
    }

    renderTime(){
        let time = this.state.current;
        let hour = time.get('hour');
        let minute = time.get('minute');
        let second = time.get('second');
        let h = this.hasHour 
            ? <Spinner loop size={this.props.size} value={hour} key='hour' max={23} step={this.props.hourStep} onChange={this.hourChange}/>
            : null;
        let m = this.hasMinute
            ? <Spinner loop size={this.props.size} value={minute} key='munite' max={59} step={this.props.minuteStep} onChange={this.minuteChange} />
            : null;
        let s = this.hasSecond
            ? <Spinner loop size={this.props.size} value={second} key='second' max={59} step={this.props.secondStep} onChange={this.secondChange}/>
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