import React from 'react';
import Clock from './Clock';
import ClockRange from './ClockRange';
import Animation from './Animation';
import moment from 'moment';

import './TimeLine.less';

let timelineWheelDelta = 1e12;

const timelineMouseMode = {
    none : 0,
    scrub : 1,
    slide : 2,
    zoom : 3,
    touchOnly : 4
};
const timelineTouchMode = {
    none : 0,
    scrub : 1,
    slideZoom : 2,
    singleTap : 3,
    ignore : 4
};

const timelineTicScales = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 30.0, 60.0, // 1min
    120.0, // 2min
    300.0, // 5min
    600.0, // 10min
    900.0, // 15min
    1800.0, // 30min
    3600.0, // 1hr
    7200.0, // 2hr
    14400.0, // 4hr
    21600.0, // 6hr
    43200.0, // 12hr
    86400.0, // 24hr
    172800.0, // 2days
    345600.0, // 4days
    604800.0, // 7days
    1296000.0, // 15days
    2592000.0, // 30days
    5184000.0, // 60days
    7776000.0, // 90days
    15552000.0, // 180days
    31536000.0, // 365days
    63072000.0, // 2years
    126144000.0, // 4years
    157680000.0, // 5years
    315360000.0, // 10years
    630720000.0, // 20years
    1261440000.0, // 40years
    1576800000.0, // 50years
    3153600000.0, // 100years
    6307200000.0, // 200years
    12614400000.0, // 400years
    15768000000.0, // 500years
    31536000000.0 // 1000years
];

function createMouseDownCallback (timeline) {
    return function (e) {
        if (timeline._mouseMode !== timelineMouseMode.touchOnly) {
            if (e.button === 0) {
                timeline._mouseMode = timelineMouseMode.scrub;
                if (timeline._scrubElement) {
                    timeline._scrubElement.style.backgroundPosition = '-16px 0';
                }
                timeline._onMouseMove(e);
            } else {
                timeline._mouseX = e.clientX;
                if (e.button === 2) {
                    timeline._mouseMode = timelineMouseMode.zoom;
                } else {
                    timeline._mouseMode = timelineMouseMode.slide;
                }
            }
        }
        e.preventDefault();
    };
}

function createMouseUpCallback (timeline) {
    return function () {
        timeline._mouseMode = timelineMouseMode.none;
        if (timeline._scrubElement) {
            timeline._scrubElement.style.backgroundPosition = '0px 0px';
        }
        timeline._timelineDrag = 0;
        timeline._timelineDragLocation = undefined;
    };
}

function createMouseMoveCallback (timeline) {
    return function (e) {
        let dx;
        if (timeline._mouseMode === timelineMouseMode.scrub) {
            e.preventDefault();
            const x = e.clientX - timeline._topDiv.getBoundingClientRect().left;

            if (x < 0) {
                timeline._timelineDragLocation = 0;
                timeline._timelineDrag = -0.01 * timeline._timeBarSecondsSpan;
            } else if (x > timeline._topDiv.clientWidth) {
                timeline._timelineDragLocation = timeline._topDiv.clientWidth;
                timeline._timelineDrag = 0.01 * timeline._timeBarSecondsSpan;
            } else {
                timeline._timelineDragLocation = undefined;
                timeline._setTimeBarTime(x, x * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth);
            }
        } else if (timeline._mouseMode === timelineMouseMode.slide) {
            dx = timeline._mouseX - e.clientX;
            timeline._mouseX = e.clientX;
            if (dx !== 0) {
                const dsec = dx * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth;
                const s = moment(timeline._startJulian).add(dsec, 'seconds');
                const e = moment(timeline._endJulian).add(dsec, 'seconds');
                timeline.zoomTo(s, e);
            }
        } else if (timeline._mouseMode === timelineMouseMode.zoom) {
            dx = timeline._mouseX - e.clientX;
            timeline._mouseX = e.clientX;
            if (dx !== 0) {
                timeline.zoomFrom(Math.pow(1.01, dx));
            }
        }
    };
}

function createMouseWheelCallback (timeline) {
    return function (e) {
        let dy = e.wheelDeltaY || e.wheelDelta || (-e.detail);
        timelineWheelDelta = Math.max(Math.min(Math.abs(dy), timelineWheelDelta), 1);
        dy /= timelineWheelDelta;
        timeline.zoomFrom(Math.pow(1.05, -dy));
    };
}

class TimeLine extends React.Component {
    displayName = 'TimeLine';

    constructor (props) {
        super(props);

        this._endJulian = undefined;
        this._epochJulian = undefined;
        this._lastXPos = undefined;
        this._scrubElement = undefined;
        this._startJulian = undefined;
        this._timeBarSecondsSpan = undefined;
        
        this._mainTicSpan = -1;
        this._mouseMode = timelineMouseMode.none;
        this._touchMode = timelineTouchMode.none;
        this._touchState = {
            centerX : 0,
            spanX : 0
        };
        this._mouseX = 0;
        this._timelineDrag = 0;
        this._timelineDragLocation = undefined;
        this._lastHeight = undefined;
        this._lastWidth = undefined;

        this._trackList = [];
        this._highlightRanges = [];
    }

    componentDidMount () {
        this._context = this._trackListEle.getContext('2d');

        this._scrubJulian = this._clock.currentTime;

        this.animation.setClock(this._clock);

        this.zoomTo(this._clock.startTime, this._clock.stopTime);

        this._onMouseDown = createMouseDownCallback(this);
        this._onMouseUp = createMouseUpCallback(this);
        this._onMouseMove = createMouseMoveCallback(this);
        this._onMouseWheel = createMouseWheelCallback(this);

        const timeBarEle = this._timeBarEle;
        document.addEventListener('mouseup', this._onMouseUp, false);
        document.addEventListener('mousemove', this._onMouseMove, false);
        timeBarEle.addEventListener('mousedown', this._onMouseDown, false);
        timeBarEle.addEventListener('DOMMouseScroll', this._onMouseWheel, false); // Mozilla mouse wheel
        timeBarEle.addEventListener('mousewheel', this._onMouseWheel, false);

        this.updateFromClock();

        this.start();
    }

    componentWillUnmount () {
        document.removeEventListener('mouseup', this._onMouseUp, false);
        document.removeEventListener('mousemove', this._onMouseMove, false);

        const timeBarEle = this._timeBarEle;
        timeBarEle.removeEventListener('mousedown', this._onMouseDown, false);
        timeBarEle.removeEventListener('DOMMouseScroll', this._onMouseWheel, false); // Mozilla mouse wheel
        timeBarEle.removeEventListener('mousewheel', this._onMouseWheel, false);
    }

    updateFromClock = () => {
        if (this.animation) {
            if (!this.animation.isAnimation()) {
                return;
            }
        }
        this._scrubJulian = this._clock.currentTime;
        
        const scrubElement = this._scrubElement;
        if (this._scrubElement) {
            const seconds = this._scrubJulian.diff(this._startJulian) / 1000;
            const xPos = Math.round(seconds * this._topDiv.clientWidth / this._timeBarSecondsSpan);

            if (this._lastXPos !== xPos) {
                this._lastXPos = xPos;

                scrubElement.style.left = `${xPos - 8}px`;
                this._needleEle.style.left = `${xPos}px`;
            }
        }
        if (this._timelineDragLocation) {
            this._setTimeBarTime(this._timelineDragLocation, this._timelineDragLocation * this._timeBarSecondsSpan / this._topDiv.clientWidth);
            const s = moment(this._startJulian).add(this._timelineDrag, 'seconds');
            const e = moment(this._endJulian).add(this._timelineDrag, 'seconds');
            this.zoomTo(s, e);
        }

        if (this.props.onTimeChange) {
            this.props.onTimeChange(this._scrubJulian);
        }

        if (this.animation) {
            this.animation.updateTime(this._scrubJulian);
        }
    }

    zoomFrom (amount) {
        let centerSec = this._scrubJulian.diff(this._startJulian) / 1000;
        if ((amount > 1) || (centerSec < 0) || (centerSec > this._timeBarSecondsSpan)) {
            centerSec = this._timeBarSecondsSpan * 0.5;
        } else {
            centerSec += (centerSec - this._timeBarSecondsSpan * 0.5);
        }
        const centerSecFlip = this._timeBarSecondsSpan - centerSec;
        const s = moment(this._startJulian).add(centerSec - (centerSec * amount), 'seconds');
        const e = moment(this._endJulian).add((centerSecFlip * amount) - centerSecFlip, 'seconds');
        this.zoomTo(s, e);
    }

    _setTimeBarTime (xPos, seconds) {
        xPos = Math.round(xPos);
        this._scrubJulian = moment(this._startJulian).add(seconds, 'seconds');
        if (this._scrubElement) {
            const scrubX = xPos - 8;
            this._scrubElement.style.left = `${scrubX.toString()}px`;
            this._needleEle.style.left = `${xPos.toString()}px`;
        }

        const evt = document.createEvent('Event');
        evt.initEvent('settime', true, true);
        evt.clientX = xPos;
        evt.timeSeconds = seconds;
        evt.timeJulian = this._scrubJulian;
        evt.clock = this._clock;
        this._topDiv.dispatchEvent(evt);
    }

    zoomTo (startTime, stopTime) {
        if (!startTime) {
            throw new Error('startTime is required.');
        }
        if (!stopTime) {
            throw new Error('stopTime is required');
        }
        if (stopTime.isBefore(startTime)) {
            throw new Error('Start time must come before end time.');
        }

        this._startJulian = startTime;
        this._endJulian = stopTime;
        this._timeBarSecondsSpan = stopTime.diff(startTime) / 1000;

        // If clock is not unbounded, clamp timeline range to clock.
        if (this._clock && (this._clock.clockRange !== ClockRange.UNBOUNDED)) {
            const clockStart = this._clock.startTime;
            const clockEnd = this._clock.stopTime;
            const clockSpan = clockEnd.diff(clockStart) / 1000;
            const startOffset = clockStart.diff(this._startJulian) / 1000;
            const endOffset = clockEnd.diff(this._endJulian) / 1000;

            if (this._timeBarSecondsSpan >= clockSpan) {
                // if new duration longer than clock range duration, clamp to full range.
                this._timeBarSecondsSpan = clockSpan;
                this._startJulian = this._clock.startTime;
                this._endJulian = this._clock.stopTime;
            } else if (startOffset > 0) {
                // if timeline start is before clock start, shift right
                this._endJulian.add(startOffset, 'seconds');
                this._startJulian = clockStart;
                this._timeBarSecondsSpan = this._endJulian.diff(this._startJulian) / 1000;
            } else if (endOffset < 0) {
                // if timeline end is after clock end, shift left
                this._startJulian = this._startJulian.add(endOffset, 'seconds');
                this._endJulian = clockEnd;
                this._timeBarSecondsSpan = this._endJulian.diff(this._startJulian) / 1000;
            }
        }

        this._makeTics();

        const evt = document.createEvent('Event');
        evt.initEvent('setzoom', true, true);
        evt.startJulian = this._startJulian;
        evt.endJulian = this._endJulian;
        evt.epochJulian = this._epochJulian;
        evt.totalSpan = this._timeBarSecondsSpan;
        evt.mainTicSpan = this._mainTicSpan;
        this._topDiv.dispatchEvent(evt);
    }

    _makeTics () {
        const timeBar = this._timeBarEle;

        const seconds = this._scrubJulian.diff(this._startJulian) / 1000;
        const xPos = Math.round(seconds * this._topDiv.clientWidth / this._timeBarSecondsSpan);
        let scrubX = xPos - 8, tic;
        const widget = this;

        this._needleEle.style.left = `${xPos.toString()}px`;

        let tics = '';

        const minimumDuration = 0.01;
        const maximumDuration = 31536000000.0; // ~1000 years
        const epsilon = 1e-10;

        // If time step size is known, enter it here...
        let minSize = 0;

        let duration = this._timeBarSecondsSpan;
        if (duration < minimumDuration) {
            duration = minimumDuration;
            this._timeBarSecondsSpan = minimumDuration;
            this._endJulian = moment(this._startJulian).add(minimumDuration, 'seconds');
        } else if (duration > maximumDuration) {
            duration = maximumDuration;
            this._timeBarSecondsSpan = maximumDuration;
            this._endJulian = moment(this._startJulian).add(maximumDuration, 'seconds');
        }

        let timeBarWidth = this._timeBarEle.clientWidth;
        if (timeBarWidth < 10) {
            timeBarWidth = 10;
        }
        const startJulian = this._startJulian;

        // epsilonTime: a small fraction of one pixel width of the timeline, measured in seconds.
        const epsilonTime = Math.min((duration / timeBarWidth) * 1e-5, 0.4);

        // epochJulian: a nearby time to be considered "zero seconds", should be a round-ish number by human standards.
        let epochJulian;
        if (duration > 315360000) { // 3650+ days visible, epoch is start of the first visible century.
            epochJulian = moment(`${startJulian.format('YY')}00-01-01 00:00:00`);
        } else if (duration > 31536000) { // 365+ days visible, epoch is start of the first visible decade.
            epochJulian = moment(`${startJulian.format('YYY')}0-01-01 00:00:00`);
        } else if (duration > 86400) { // 1+ day(s) visible, epoch is start of the year.
            epochJulian = moment(`${startJulian.format('YYYY')}-01-01 00:00:00`);
        } else { // Less than a day on timeline, epoch is midnight of the visible day.
            epochJulian = moment(`${startJulian.format('YYYY-MM-DD')} 00:00:00`);
        }
        // startTime: Seconds offset of the left side of the timeline from epochJulian.
        let tmp = moment(epochJulian).add(epsilonTime, 'seconds');
        const startTime = this._startJulian.diff(tmp) / 1000;
        // endTime: Seconds offset of the right side of the timeline from epochJulian.
        let endTime = startTime + duration;
        this._epochJulian = epochJulian;

        function getStartTic (ticScale) {
            return Math.floor(startTime / ticScale) * ticScale;
        }

        function getNextTic (tic, ticScale) {
            return Math.ceil((tic / ticScale) + 0.5) * ticScale;
        }

        function getAlpha (time) {
            return (time - startTime) / duration;
        }

        function remainder (x, y) {
            // return x % y;
            return x - (y * Math.round(x / y));
        }

        // Width in pixels of a typical label, plus padding
        tmp = moment(this._endJulian).add(-minimumDuration, 'seconds');
        this._rulerEle.innerHTML = this.makeLabel(tmp);
        let sampleWidth = this._rulerEle.offsetWidth + 20;
        if (sampleWidth < 30) {
            // Workaround an apparent IE bug with measuring the width after going full-screen from inside an iframe.
            sampleWidth = 180;
        }

        const origMinSize = minSize;
        minSize -= epsilon;

        const renderState = {
            startTime,
            startJulian,
            epochJulian,
            duration,
            timeBarWidth,
            getAlpha
        };


        // this._highlightRanges.forEach((highlightRange) => {
        //     tics += highlightRange.render(renderState);
        // });
        

        // Calculate tic mark label spacing in the TimeBar.
        let mainTic = 0.0, subTic = 0.0, tinyTic = 0.0;
        // Ideal labeled tic as percentage of zoom interval
        let idealTic = sampleWidth / timeBarWidth;
        if (idealTic > 1.0) {
            // Clamp to width of window, for thin windows.
            idealTic = 1.0;
        }
        // Ideal labeled tic size in seconds
        idealTic *= this._timeBarSecondsSpan;
        let ticIndex = -1, smallestIndex = -1;

        let i, ticScaleLen = timelineTicScales.length;
        for (i = 0; i < ticScaleLen; ++i) {
            const sc = timelineTicScales[i];
            ++ticIndex;
            mainTic = sc;
            // Find acceptable main tic size not smaller than ideal size.
            if ((sc > idealTic) && (sc > minSize)) {
                break;
            }
            if ((smallestIndex < 0) && ((timeBarWidth * (sc / this._timeBarSecondsSpan)) >= this.smallestTicInPixels)) {
                smallestIndex = ticIndex;
            }
        }
        if (ticIndex > 0) {
            while (ticIndex > 0) // Compute sub-tic size that evenly divides main tic.
            {
                --ticIndex;
                if (Math.abs(remainder(mainTic, timelineTicScales[ticIndex])) < 0.00001) {
                    if (timelineTicScales[ticIndex] >= minSize) {
                        subTic = timelineTicScales[ticIndex];
                    }
                    break;
                }
            }

            if (smallestIndex >= 0) {
                while (smallestIndex < ticIndex) // Compute tiny tic size that evenly divides sub-tic.
                {
                    if ((Math.abs(remainder(subTic, timelineTicScales[smallestIndex])) < 0.00001) && (timelineTicScales[smallestIndex] >= minSize)) {
                        tinyTic = timelineTicScales[smallestIndex];
                        break;
                    }
                    ++smallestIndex;
                }
            }
        }

        minSize = origMinSize;
        if ((minSize > epsilon) && (tinyTic < 0.00001) && (Math.abs(minSize - mainTic) > epsilon)) {
            tinyTic = minSize;
            if (minSize <= (mainTic + epsilon)) {
                subTic = 0.0;
            }
        }

        let lastTextLeft = -999999, textWidth;
        if ((timeBarWidth * (tinyTic / this._timeBarSecondsSpan)) >= 3.0) {
            for (tic = getStartTic(tinyTic); tic <= endTime; tic = getNextTic(tic, tinyTic)) {
                tics += `<span class="cesium-timeline-ticTiny" style="left: ${Math.round(timeBarWidth * getAlpha(tic)).toString()}px;"></span>`;
            }
        }
        if ((timeBarWidth * (subTic / this._timeBarSecondsSpan)) >= 3.0) {
            for (tic = getStartTic(subTic); tic <= endTime; tic = getNextTic(tic, subTic)) {
                tics += `<span class="cesium-timeline-ticSub" style="left: ${Math.round(timeBarWidth * getAlpha(tic)).toString()}px;"></span>`;
            }
        }
        if ((timeBarWidth * (mainTic / this._timeBarSecondsSpan)) >= 2.0) {
            this._mainTicSpan = mainTic;
            endTime += mainTic;
            tic = getStartTic(mainTic);
            while (tic <= endTime) {
                const ticTime = moment(startJulian).add(tic - startTime, 'seconds');
                const ticLeft = Math.round(timeBarWidth * getAlpha(tic));
                const ticLabel = this.makeLabel(ticTime);
                this._rulerEle.innerHTML = ticLabel;
                textWidth = this._rulerEle.offsetWidth;
                if (textWidth < 10) {
                    // IE iframe fullscreen sampleWidth workaround, continued.
                    textWidth = sampleWidth;
                }
                const labelLeft = ticLeft - ((textWidth / 2) - 1);
                if (labelLeft > lastTextLeft) {
                    lastTextLeft = labelLeft + textWidth + 5;
                    tics += `<span class="cesium-timeline-ticMain" style="left: ${ticLeft.toString()}px;"></span>` + `<span class="cesium-timeline-ticLabel" style="left: ${labelLeft.toString() 
                    }px;">${ticLabel}</span>`;
                } else {
                    tics += `<span class="cesium-timeline-ticSub" style="left: ${ticLeft.toString()}px;"></span>`;
                }
                tic = getNextTic(tic, mainTic);
            }
        } else {
            this._mainTicSpan = -1;
        }

        tics += `<span class="cesium-timeline-icon16" style="left:${scrubX}px;bottom:0;background-position: 0px 0px;"></span>`;
        timeBar.innerHTML = tics;
        this._scrubElement = timeBar.lastChild;

        // Clear track canvas.
        this._context.clearRect(0, 0, this._trackListEle.width, this._trackListEle.height);

        renderState.y = 0;
        this._trackList.forEach((track) => {
            track.render(widget._context, renderState);
            renderState.y += track.height;
        });
    }

    makeLabel (time) {
        let millisecond = time.get('millisecond'), millisecondString = '';
        if ((millisecond > 0) && (this._timeBarSecondsSpan < 3600)) {
            millisecondString = Math.floor(millisecond).toString();
            while (millisecondString.length < 3) {
                millisecondString = `0${millisecondString}`;
            }
            millisecondString = `.${millisecondString}`;
        }

        return `${time.format('YYYY-MM-DD HH:mm:ss')}${millisecondString}`;
    }

    twoDigits (num) {
        return ((num < 10) ? (`0${num.toString()}`) : num.toString());
    }

    start () {
        const scope = this;
        function render () {
            scope._clock.tick();
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    onMultiplierChange = (multipier, step) => {
        if (this._clock) {
            this._clock.setStep(step);
            this._clock.setMultiplier(multipier);
        }
    }

    render () {
        return (
            <div ref={(f) => this.container = f} className='cm-timeline-wrap'>
                <Animation ref={(f) => this.animation = f} onMultiplierChange={this.onMultiplierChange}/>
                <div className='cm-timeline-main' ref={(f) => this._topDiv = f}
                    onContextMenu={() => { return false ; }}>
                    <div className='cesium-timeline-bar' ref={(f) => this._timeBarEle = f}></div>
                    <div className='cesium-timeline-trackContainer' ref={(f) => this._trackContainer = f}>
                        <canvas className='cesium-timeline-tracks' ref={(f) => this._trackListEle = f} width={10} height={1}>
                        </canvas>
                    </div>
                    <div className='cesium-timeline-needle' ref={(f) => this._needleEle = f}></div>
                    <span className='cesium-timeline-ruler' ref={(f) => this._rulerEle = f}></span>
                </div>
                
                <Clock ref={(f) => this._clock = f} onTick={this.updateFromClock}/>
            </div>
        );
    }
}
export default TimeLine;
