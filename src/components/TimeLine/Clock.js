import moment from 'moment';
import React from 'react';
import ClockRange from './ClockRange';
import ClockStep from './ClockStep';

class Clock extends React.Component {
    displayName = 'Clock';

    static defaultProps = {

    };

    constructor (props) {
        super(props);
        let startTime = props.startTime;
        const startTimeUndefined = startTime === undefined;

        let stopTime = props.stopTime;
        const stopTimeUndefined = stopTime === undefined;

        let currentTime = props.currentTime;
        const currentTimeUndefined = currentTime === undefined;

        if (startTimeUndefined && stopTimeUndefined && currentTimeUndefined) {
            currentTime = moment();
            startTime = moment();
            stopTime = moment().add(1, 'days');
        } else if (startTimeUndefined && stopTimeUndefined) {
            startTime = moment(currentTime);
            stopTime = moment(currentTime).add(1, 'days');
        } else if (startTimeUndefined && currentTimeUndefined) {
            startTime = moment(stopTime).add(-1, 'days');
            currentTime = moment(startTime);
        } else if (currentTimeUndefined && stopTimeUndefined) {
            currentTime = moment(startTime);
            stopTime = moment(startTime).add(1, 'days');
        } else if (currentTimeUndefined) {
            currentTime = moment(startTime);
        } else if (stopTimeUndefined) {
            stopTime = moment(currentTime).add(1, 'days');
        } else if (startTimeUndefined) {
            startTime = moment(currentTime);
        }

        if (startTime.isAfter(stopTime)) {
            throw new Error('startTime must come before stopTime.');
        }

        this.startTime = startTime;

        this.stopTime = stopTime;

        this.currentTime = currentTime;

        this.multiplier = props.multiplier || 1.0;

        this.clockStep = props.clockStep || ClockStep.SYSTEM_CLOCK;

        this.clockRange = props.clockRange || ClockRange.UNBOUNDED;

        this.canAnimate = props.canAnimate || true;

        this.shouldAnimate = props.shouldAnimate || true;

        this._lastSystemTime = this.getSysTimestamp();
    }

    setMultiplier (multiplier) {
        this.multiplier = multiplier;
    }

    setStep (step) {
        this.clockStep = step;
    }

    /**
     * 获取系统timestamp
     */
    getSysTimestamp () {
        let getTimestamp;
        if (typeof performance !== 'undefined' && performance.now) {
            getTimestamp = function () {
                return performance.now();
            };
        } else {
            getTimestamp = function () {
                return Date.now();
            };
        }
        return getTimestamp();
    }

    tick () {
        const currentSystemTime = this.getSysTimestamp();
        let currentTime = moment(this.currentTime);
        const startTime = this.startTime;
        const stopTime = this.stopTime;
        const multiplier = this.multiplier;

        if (this.canAnimate && this.shouldAnimate) {
            if (this.clockStep === ClockStep.SYSTEM_CLOCK) {
                currentTime = moment();
            } else {
                if (this.clockStep === ClockStep.TICK_DEPENDENT) {
                    currentTime.add(multiplier, 'seconds');
                } else {
                    const milliseconds = currentSystemTime - this._lastSystemTime;
                    currentTime.add(multiplier * (milliseconds / 1000.0), 'seconds');
                }

                if (this.clockRange === ClockRange.CLAMPED) {
                    if (currentTime.isBefore(startTime)) {
                        currentTime = moment(startTime);
                    } else if (currentTime.isAfter(stopTime)) {
                        currentTime = moment(stopTime);
                    }
                } else if (this.clockRange === ClockRange.LOOP_STOP) {
                    if (currentTime.isBefore(startTime)) {
                        currentTime = moment(startTime);
                    }
                    while (currentTime.isAfter(stopTime)) {
                        currentTime = startTime.add(stopTime.diff(currentTime) / 1000.0, 'seconds');
                    }
                }
            }
        }

        this.currentTime = currentTime;
        this._lastSystemTime = currentSystemTime;
        if (this.props.onTick && typeof this.props.onTick === 'function') {
            this.props.onTick(this);
        }
        return currentTime;
    }

    render () {
        return (
            <div style={{display: 'none'}}>
            </div>
        );
    }
}
export default Clock;
