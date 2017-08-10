/**
 * @author cqb 2016-04-17.
 * @module TouchRipple
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Dom from '../utils/Dom';
import CircleRipple from './CircleRipple';
import update from 'immutability-helper';
import TransitionGroup from 'react-transition-group/TransitionGroup';
const Component = React.Component;

/**
 * 添加元素
 * @param array
 * @param obj
 * @returns {*}
 */
function push(array, obj) {
    const newObj = Array.isArray(obj) ? obj : [obj];
    return update(array, {$push: newObj});
}

/**
 * 删除元素
 * @param array
 * @returns {*}
 */
function shift(array) {
    return update(array, {$splice: [[0, 1]]});
}

/**
 * TouchRipple 类
 * @class TouchRipple
 * @extend Component
 */
class TouchRipple extends Component {
    static propTypes = {
        abortOnScroll: PropTypes.bool,
        centerRipple: PropTypes.bool,
        children: PropTypes.node,
        color: PropTypes.string,
        opacity: PropTypes.number,
        style: PropTypes.object
    };

    static defaultProps = {
        abortOnScroll: true
    };

    constructor(props, context) {
        super(props, context);
        // Touch start produces a mouse down event for compat reasons. To avoid
        // showing ripples twice we skip showing a ripple for the first mouse down
        // after a touch start. Note we don't store ignoreNextMouseDown in this.state
        // to avoid re-rendering when we change it.
        this.ignoreNextMouseDown = false;

        this.state = {
            // This prop allows us to only render the ReactTransitionGroup
            // on the first click of the component, making the inital render faster.
            hasRipples: false,
            nextKey: 0,
            ripples: []
        };
    }

    /**
     * 开始动画
     * @method start
     * @param event {Event} 事件对象
     * @param isRippleTouchGenerated
     */
    start(event, isRippleTouchGenerated) {
        if (this.ignoreNextMouseDown && !isRippleTouchGenerated) {
            this.ignoreNextMouseDown = false;
            return;
        }

        let ripples = this.state.ripples;

        // Add a ripple to the ripples array
        ripples = push(ripples, (
            <CircleRipple
                key={this.state.nextKey}
                style={!this.props.centerRipple ? this.getRippleStyle(event) : {}}
                color={this.props.color || 'rgba(255, 255, 255, .25)'}
                opacity={this.props.opacity || 1}
                touchGenerated={isRippleTouchGenerated}
            />
        ));

        this.ignoreNextMouseDown = isRippleTouchGenerated;
        this.setState({
            hasRipples: true,
            nextKey: this.state.nextKey + 1,
            ripples: ripples
        });
    }

    /**
     * 结束动画
     * @method end
     */
    end() {
        const currentRipples = this.state.ripples;
        this.setState({
            ripples: shift(currentRipples)
        });
        if (this.props.abortOnScroll) {
            this.stopListeningForScrollAbort();
        }
    }

    handleMouseDown(event) {
        // only listen to left clicks
        if (event.button === 0) {
            this.start(event, false);
        }
    }

    handleMouseUp = () => {
        this.end();
    };

    handleMouseLeave = () => {
        this.end();
    };

    handleTouchStart = (event) => {
        event.stopPropagation();
        // If the user is swiping (not just tapping), save the position so we can
        // abort ripples if the user appears to be scrolling.
        if (this.props.abortOnScroll && event.touches) {
            this.startListeningForScrollAbort(event);
            this.startTime = Date.now();
        }
        this.start(event, true);
    };

    handleTouchEnd = () => {
        this.end();
    };

    // Check if the user seems to be scrolling and abort the animation if so
    handleTouchMove = (event) => {
        // Stop trying to abort if we're already 300ms into the animation
        const timeSinceStart = Math.abs(Date.now() - this.startTime);
        if (timeSinceStart > 300) {
            this.stopListeningForScrollAbort();
            return;
        }

        // If the user is scrolling...
        const deltaY = Math.abs(event.touches[0].clientY - this.firstTouchY);
        const deltaX = Math.abs(event.touches[0].clientX - this.firstTouchX);
        // Call it a scroll after an arbitrary 6px (feels reasonable in testing)
        if (deltaY > 6 || deltaX > 6) {
            let currentRipples = this.state.ripples;
            const ripple = currentRipples[0];
            // This clone will replace the ripple in ReactTransitionGroup with a
            // version that will disappear immediately when removed from the DOM
            const abortedRipple = React.cloneElement(ripple, {aborted: true});
            // Remove the old ripple and replace it with the new updated one
            currentRipples = shift(currentRipples);
            currentRipples = push(currentRipples, abortedRipple);
            this.setState({ripples: currentRipples}, () => {
                // Call end after we've set the ripple to abort otherwise the setState
                // in end() merges with this and the ripple abort fails
                this.end();
            });
        }
    };

    startListeningForScrollAbort(event) {
        this.firstTouchY = event.touches[0].clientY;
        this.firstTouchX = event.touches[0].clientX;
        // Note that when scolling Chrome throttles this event to every 200ms
        // Also note we don't listen for scroll events directly as there's no general
        // way to cover cases like scrolling within containers on the page
        if (document.addEventListener) {
            document.body.addEventListener('touchmove', this.handleTouchMove);
        }
    }

    stopListeningForScrollAbort() {
        if (document.removeEventListener) {
            document.body.removeEventListener('touchmove', this.handleTouchMove);
        }
    }

    getRippleStyle(event) {
        const style = {};
        const el = ReactDOM.findDOMNode(this);
        const elHeight = el.parentNode.parentNode.offsetHeight;
        const elWidth = el.parentNode.parentNode.offsetWidth;
        const offset = Dom.offset(el.parentNode.parentNode);
        const isTouchEvent = event.touches && event.touches.length;
        const pageX = isTouchEvent ? event.touches[0].pageX : event.pageX;
        const pageY = isTouchEvent ? event.touches[0].pageY : event.pageY;
        const pointerX = pageX - offset.left;
        const pointerY = pageY - offset.top;
        const topLeftDiag = this.calcDiag(pointerX, pointerY);
        const topRightDiag = this.calcDiag(elWidth - pointerX, pointerY);
        const botRightDiag = this.calcDiag(elWidth - pointerX, elHeight - pointerY);
        const botLeftDiag = this.calcDiag(pointerX, elHeight - pointerY);
        const rippleRadius = Math.max(
            topLeftDiag, topRightDiag, botRightDiag, botLeftDiag
        );
        const rippleSize = rippleRadius * 2;
        const left = pointerX - rippleRadius;
        const top = pointerY - rippleRadius;

        style.height = `${rippleSize}px`;
        style.width = `${rippleSize}px`;
        style.top = `${top}px`;
        style.left = `${left}px`;

        return style;
    }

    calcDiag(a, b) {
        return Math.sqrt((a * a) + (b * b));
    }

    render() {
        const {children, style} = this.props;
        let {hasRipples, ripples} = this.state;

        let rippleGroup;

        const mergedStyles = Object.assign({
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden'
        }, style);
        if (hasRipples) {
            rippleGroup = (
                <TransitionGroup style={mergedStyles}>
                    {ripples}
                </TransitionGroup>
            );
        } else {
            ripples = push(ripples, (
                <CircleRipple
                    key={this.state.nextKey - 1}
                    color={this.props.color || 'rgba(255, 255, 255, .25)'}
                    opacity={0}
                    touchGenerated={false}
                    aborted
                />
            ));

            rippleGroup = (
                <TransitionGroup style={mergedStyles}>
                    {ripples}
                </TransitionGroup>
            );
        }

        return (
            <div
                onMouseUp={this.handleMouseUp}
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseLeave={this.handleMouseLeave}
                onTouchStart={this.handleTouchStart}
                onTouchEnd={this.handleTouchEnd}
                style={style}
            >
                {rippleGroup}
                {children}
            </div>
        );
    }
}

export default TouchRipple;
