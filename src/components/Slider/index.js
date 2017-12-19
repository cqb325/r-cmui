import React from 'react';
import BaseComponent from '../core/BaseComponent';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import Dom from '../utils/Dom';
import Events from '../utils/Events';
import FormControl from '../FormControl';

import './Slider.less';
import '../Tooltip/Tooltip.less';

class Slider extends BaseComponent {
    displayName = 'Slider';

    static defaultProps = {
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        range: false,
        vertical: false
    };

    state = {
        leftHover: false,
        rightHover: false,
        snap: 1,
        value: this.props.value
    };

    /**
     * 记录可拖拽点的值
     */
    leftRight = this.props.range ? [this.props.value[0],this.props.value[1]] : [this.props.min, this.props.value];

    /**
     * 记录上次的值
     */
    lastValue = this.props.range ? [this.props.value[0],this.props.value[1]] : [this.props.min, this.props.value];

    /**
     * 是否正在拖拽
     */
    isDragging = false;

    /**
     * 拖拽开始
     */
    onMouseDown (align) {
        if (this.props.disabled) {
            return;
        }
        this.setState({[`${align}Hover`]: true});
        this[`${align}-dragging`] = true;
        if (this.props.onMouseDown) {
            this.props.onMouseDown();
        }
    }

    /**
     * 拖拽结束
     */
    onStop (align) {
        this.setState({leftHover: false, rightHover: false});
        this[`${align}-dragging`] = false;
        if (this.props.onStop) {
            this.props.onStop();
        }
    }

    /**
     * 左侧拖拽
     */
    onDragLeft = (event, data) => {
        const value = this.leftRight;
        value[0] = this.calculateValue(this.props.vertical ? data.y : data.x);
        const val = value[0] <= value[1] ? [value[0], value[1]] : [value[1], value[0]];
        this.setState({value: val}, () => {
            if (this.lastValue[0] !== value[0]) {
                if (this.props.onChange) {
                    this.props.onChange(this.state.value);
                }
            }
            this.lastValue[0] = value[0];
        });
    }

    /**
     * 右侧拖拽
     */
    onDragRight = (event, data) => {
        const value = this.leftRight;
        value[1] = this.calculateValue(this.props.vertical ? data.y : data.x);
        const val = this.props.range
            ? value[0] <= value[1] ? [value[0], value[1]] : [value[1], value[0]]
            : value[1];
        this.setState({value: val}, () => {
            if (this.lastValue[1] !== value[1]) {
                if (this.props.onChange) {
                    this.props.onChange(this.state.value);
                }
            }
            this.lastValue[1] = value[1];
        });
    }

    /**
     * 点击变更
     */
    clickToChange = (event) => {
        if (Dom.dom(event.target).hasClass('cm-slider-handle')) {
            return;
        }
        const slider = Dom.closest(event.target, '.cm-slider');
        const offset = Dom.dom(slider).offset();
        const x = this.props.vertical ? event.pageY - offset.top : event.pageX - offset.left;

        const value = this.state.value;
        let val = this.calculateValue(x);
        const nearLeft = Math.abs(value[1] - val) > Math.abs(value[0] - val);
        const isRevert = this.leftRight[0] > this.leftRight[1];
        if (nearLeft) {
            if (isRevert) {
                this.leftRight[1] = val;
            } else {
                this.leftRight[0] = val;
            }
        } else {
            if (isRevert) {
                this.leftRight[0] = val;
            } else {
                this.leftRight[1] = val;
            }
        }

        val = this.props.range
            ? nearLeft ? [val, value[1]] : [value[0], val]
            : val;
        this.setState({value: val}, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.value);
            }
        });
    }

    /**
     * 计算当前拖拽点的值
     * @param {*} x 
     */
    calculateValue (x) {
        const allW = this.props.vertical ? Dom.dom(this.rail).height() : Dom.dom(this.rail).width();
        x = this.props.vertical ? allW - x : x;

        const v = this.toFixed(x / allW * (this.props.max - this.props.min) + this.props.min);
        return v;
    }

    /**
     * 计算当前值对应的位置
     */
    calculateLeftRight () {
        const val = this.leftRight;
        const value = this.props.range ? this.state.value : [this.props.min, this.state.value];

        if (this.rail) {
            const allW = this.props.vertical ? Dom.dom(this.rail).height() : Dom.dom(this.rail).width();

            const trackWidth = Math.abs(val[1] - val[0]) / (this.props.max - this.props.min) * allW;
            let trackLeft = (value[0] - this.props.min) / (this.props.max - this.props.min) * allW;
            trackLeft = this.props.vertical ? allW - trackLeft : trackLeft;
            let handleRight = (value[1] - this.props.min) / (this.props.max - this.props.min) * allW;
            handleRight = this.props.vertical ? allW - handleRight : handleRight;

            return {trackLeft, trackWidth, handleRight};
        }

        return {trackLeft: 0, trackWidth: 0, handleRight: 0};
    }

    /**
     * 格式化数据
     * @param {*} num 
     */
    toFixed (num) {
        let r;
        try {
            r = this.props.step.toString().split('.')[1].length;
        } catch (e) {
            r = 0;
        }
        const m = Math.pow(10, r);
        return Math.round(num * m) / m;
    }

    /**
     * 显示tip
     */
    showTip (align) {
        this.setState({[`${align}Hover`]: true});
    }

    /**
     * 隐藏tip
     */
    hideTip = () => {
        if (!this['left-dragging']) {
            this.setState({leftHover: false});
        }
        if (!this['right-dragging']) {
            this.setState({rightHover: false});
        }
    }

    /**
     * tip格式化
     */
    getTip (flag) {
        const v = this.props.range ? this.leftRight[flag] : this.state.value;
        if (this.props.tipFormatter && typeof this.props.tipFormatter === 'function') {
            return this.props.tipFormatter(v, this);
        }
        if (this.props.tipFormatter === null) {
            return null;
        }
        return v;
    }

    renderSteps () {
        if (this.props.marks) {
            const marks = [];
            const range = this.props.range ? this.state.value : [this.props.min, this.state.value];
            for (const val in this.props.marks) {
                const left = `${((val - this.props.min) / (this.props.max - this.props.min)) * 100}%`;
                const style = this.props.vertical ? {bottom: left} : {left};
                const isActive = val >= range[0] && val <= range[1];
                const clazzName = classNames('cm-slider-step', {
                    'cm-slider-step-active': isActive
                });
                marks.push(<span className={clazzName} key={val} style={style}></span>);
            }
            return marks;
        }
        return null;
    }

    renderMarkers () {
        if (this.props.marks) {
            const marks = [];
            for (const val in this.props.marks) {
                const mark = this.props.marks[val];
                const text = typeof mark === 'string' ? mark : mark.label;
                const left = `${((val - this.props.min) / (this.props.max - this.props.min)) * 100}%`;
                const style = Object.assign(this.props.vertical ? {bottom: left} : {left}, mark.style);
                marks.push(<span className='cm-slider-mark' key={val} style={style}>{text}</span>);
            }
            return marks;
        }
        return null;
    }

    updateSnap () {
        const allW = this.props.vertical ? Dom.dom(this.rail).height() : Dom.dom(this.rail).width();
        const snap = allW / (this.props.max - this.props.min) * this.props.step;

        this.setState({snap});
    }

    componentDidMount () {
        this.updateSnap();

        Events.on(window, 'resize', this.onResize);
    }

    onResize = () => {
        this.updateSnap();
    }

    componentWillUnmount () {
        Events.off(window, 'resize', this.onResize);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
            this.setState({value: nextProps.value});
        }
    }

    setValue (value) {
        this.leftRight = this.props.range ? [value[0], value[1]] : [this.props.min, value];
        this.lastValue = this.props.range ? [value[0], value[1]] : [this.props.min, value];
        this.setState({value});
    }

    getValue () {
        return this.state.value;
    }

    render () {
        const {className, style, range, vertical} = this.props;
        const clazzName = classNames('cm-slider', className, {
            'cm-slider-hover': this.state.hover,
            'cm-slider-disabled': this.props.disabled,
            'cm-slider-vertical': vertical
        });

        const {trackLeft, trackWidth, handleRight} = this.calculateLeftRight();
        const isRevert = this.leftRight[0] > this.leftRight[1];

        const trackStyle = vertical ? {top: handleRight, height: trackWidth} : {left: trackLeft, width: trackWidth};
        const leftPos = vertical 
            ? {x: 0, y: isRevert ? handleRight : trackLeft}
            : {x: isRevert ? handleRight : trackLeft, y: 0};
        const rightPos = vertical 
            ? {x: 0, y: isRevert ? trackLeft : handleRight}
            : {x: isRevert ? trackLeft : handleRight, y: 0};

        return (
            <div className={clazzName} style={style} onMouseDown={this.clickToChange}>
                <div className='cm-slider-rail' ref={(f) => this.rail = f}></div>
                <div className='cm-slider-track' style={trackStyle}></div>
                <div className='cm-slider-steps'>
                    {this.renderSteps()}
                </div>
                {
                    range 
                        ? <Draggable axis={vertical ? 'y' : 'x'} bounds='parent' 
                            onMouseDown={this.onMouseDown.bind(this, 'left')}
                            onStop={this.onStop.bind(this, 'left')}
                            disabled={this.props.disabled}
                            onDrag={this.onDragLeft}
                            position={leftPos}
                            grid={[this.state.snap, this.state.snap]}
                        >
                            <div className='cm-slider-handle' tabIndex='0' 
                                onMouseEnter={this.showTip.bind(this, 'left')}
                                onMouseLeave={this.hideTip}
                            >
                                <div className='cm-tooltip visible top black' 
                                    style={{left: '50%', top: -5, display: this.state.leftHover ? 'block' : 'none'}}>
                                    <div className='cm-tooltip-body'>
                                        <div className='cm-tooltip-arrow'></div>
                                        <div className='cm-tooltip-inner'>{this.getTip(0)}</div>
                                    </div>
                                </div>
                            </div>
                        </Draggable> : null
                }
                <Draggable axis={vertical ? 'y' : 'x'} bounds='parent' 
                    onMouseDown={this.onMouseDown.bind(this, 'right')}
                    onStop={this.onStop.bind(this, 'right')}
                    disabled={this.props.disabled}
                    onDrag={this.onDragRight}
                    position={rightPos}
                    grid={[this.state.snap, this.state.snap]}
                >
                    <div className='cm-slider-handle' tabIndex='0' ref={(f) => this.handle = f} 
                        onMouseEnter={this.showTip.bind(this, 'right')}
                        onMouseLeave={this.hideTip}
                    >
                        <div className='cm-tooltip visible top black' 
                            style={{left: '50%', top: -5, display: this.state.rightHover ? 'block' : 'none'}}>
                            <div className='cm-tooltip-body'>
                                <div className='cm-tooltip-arrow'></div>
                                <div className='cm-tooltip-inner'>{this.getTip(1)}</div>
                            </div>
                        </div>
                    </div>
                </Draggable>

                <div className='cm-slider-marks'>
                    {this.renderMarkers()}
                </div>
            </div>
        );
    }
}

FormControl.register(Slider, 'slider');

export default Slider;
