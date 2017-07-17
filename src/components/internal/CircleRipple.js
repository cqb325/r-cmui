/**
 * @author cqb 2016-04-17.
 * @module CircleRipple
 */

import React from 'react';
import ReactDOM from 'react-dom';
import autoPrefix from '../utils/autoPrefix';
import transitions from '../utils/transitions';
import shallowEqual from '../utils/shallowEqual';

/**
 * CircleRipple 类
 * @class CircleRipple
 * @extend React.Component
 */
class CircleRipple extends React.Component {
    static propTypes = {
        aborted: React.PropTypes.bool,
        color: React.PropTypes.string,
        opacity: React.PropTypes.number,
        style: React.PropTypes.object
    };

    static defaultProps = {
        opacity: 0.1,
        aborted: false
    };

    shouldComponentUpdate(nextProps) {
        return !shallowEqual(this.props, nextProps);
    }

    componentWillUnmount() {
        clearTimeout(this.enterTimer);
        // clearTimeout(this.leaveTimer);
    }

    componentWillAppear() {
        // this.initializeAnimation(callback);
    }

    componentWillEnter(callback) {
        this.initializeAnimation(callback);
    }

    componentDidAppear() {
        // this.animate();
    }

    componentDidEnter() {
        this.animate();
    }

    componentWillLeave(callback) {
        const style = ReactDOM.findDOMNode(this).style;
        style.opacity = 0;
        // If the animation is aborted, remove from the DOM immediately
        const removeAfter = this.props.aborted ? 0 : 2000;
        this.enterTimer = setTimeout(callback, removeAfter);
    }

    /**
     * 设置动画
     * @method animate
     */
    animate() {
        const style = ReactDOM.findDOMNode(this).style;
        const transitionValue = `${transitions.easeOut('2s', 'opacity')}, ${
            transitions.easeOut('1s', 'transform')}`;
        autoPrefix.set(style, 'transition', transitionValue);
        autoPrefix.set(style, 'transform', 'scale(1)');
    }

    /**
     * 初始化动画参数
     * @param callback
     */
    initializeAnimation(callback) {
        const style = ReactDOM.findDOMNode(this).style;
        style.opacity = this.props.opacity;
        autoPrefix.set(style, 'transform', 'scale(0)');
        this.leaveTimer = setTimeout(callback, 0);
    }

    render() {
        const {
            color,
            opacity,
            style
        } = this.props;

        const mergedStyles = Object.assign({
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            borderRadius: '50%',
            display: 'inline-block',
            backgroundColor: color,
            opacity: opacity
        }, style);

        return (
            <div style={mergedStyles} />
        );
    }
}

export default CircleRipple;
