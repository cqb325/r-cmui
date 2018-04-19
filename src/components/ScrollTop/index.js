import React from 'react';
import classNames from 'classnames';

class ScrollTop extends React.Component {
    displayName = 'ScrollTop';

    static defaultProps = {
        showUnder: 10,
        duration: 250,
        topPosition: 0
    }

    state = {
        show: false
    };

    data = {
        startValue: 0,
        currentTime: 0, // store current time of animation
        startTime: null,
        rafId: null
    };

    handleScroll = () => {
        if (window.pageYOffset > this.props.showUnder) {
            if (!this.state.show) {
                this.setState({show: true});
            }
        } else {
            if (this.state.show) {
                this.setState({show: false});
            }
        }
    }

    /**
     * Stop Animation Frame
     */
    stopScrolling = () => {
        window.cancelAnimationFrame(this.data.rafId);
    }

    scrollStep = (timestamp) => {
        if (!this.data.startTime) {
            this.data.startTime = timestamp;
        }

        this.data.currentTime = timestamp - this.data.startTime;

        const position = this.easeOutCubic(
            this.data.currentTime,
            this.data.startValue,
            this.props.topPosition,
            this.props.duration
        );

        if (window.pageYOffset <= this.props.topPosition) {
            this.stopScrolling();
        } else {
            window.scrollTo(window.pageYOffset, position);
            this.data.rafId = window.requestAnimationFrame(this.scrollStep);
        }
    }

    easeOutCubic (t, b, _c, d) {
        const c = _c - b;
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }

    onClick = () => {
        this.stopScrolling();
        this.data.startValue = window.pageYOffset;
        this.data.currentTime = 0;
        this.data.startTime = null;
        this.data.rafId = window.requestAnimationFrame(this.scrollStep);
    }

    componentDidMount () {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('wheel', this.stopScrolling, false);
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('wheel', this.stopScrolling, false);
    }

    render () {
        const {className, style, children} = this.props;
        const css = Object.assign({
            position: 'fixed',
            bottom: 40,
            right: 30,
            zIndex: 2000,
            cursor: 'pointer',
            transitionDuration: '0.2s',
            transitionTimingFunction: 'linear',
            transitionDelay: '0s'
        }, style);

        css.opacity = (this.state.show ? 1 : 0);
        css.visibility = (this.state.show ? 'visible' : 'hidden');
        css.transitionProperty = 'opacity, visibility';

        const clazzName = classNames('cm-scroll-top', className);
        return (
            <div className={clazzName} style={css} onClick={this.onClick}>
                {children}
            </div>
        );
    }
}
export default ScrollTop;
