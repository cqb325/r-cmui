import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Events from '../utils/Events';

/**
 * ScrollBar组件
 */
class Scrollbar extends React.Component {
    displayName = 'Scrollbar';

    static defaultProps = {
        type: 'vertical',
        barSize: 8,
        thumbSize: 30,
        minThumbSize: 0,
        scrollOffset: 0
    }

    static propTypes = {
        type: PropTypes.oneOf(['vertical', 'horizontal']),
        barSize: PropTypes.number,
        thumbSize: PropTypes.number,
        scrollOffset: PropTypes.number,
        style: PropTypes.object,
        onChange: PropTypes.func
    }

    state = {
        scrollOffset: this.props.scrollOffset
    }

    componentDidMount () {
        Events.on(document, 'mouseup', this.onMouseUp);
        Events.on(this.thumb, 'mousedown', this.onMouseDown);
    }

    componentWillUnmount () {
        Events.off(document, 'mouseup', this.onMouseUp);
        Events.off(this.thumb, 'mousedown', this.onMouseDown);
    }

    onMouseUp = () => {
        Events.off(document, 'mousemove', this.onMouseMove);
    }

    onMouseMove = (e) => {
        let y2;
        let max;
        const thumbSize = Math.max(this.props.minThumbSize, this.props.thumbSize);
        const all = this.track.getBoundingClientRect().height;
        const delta = this.props.minThumbSize ? (all - this.props.thumbSize) / (all - this.props.minThumbSize) : 1;

        if (this.props.type === 'vertical') {
            y2 = e.pageY;
            max = this.track.getBoundingClientRect().height - thumbSize;
        } else {
            y2 = e.pageX;
            max = this.track.getBoundingClientRect().width - thumbSize;
        }
        let top = this.thumbOffsetTop + y2 - this.lastY;
        top = Math.max(0, top);
        top = Math.min(max, top);

        this.setState({
            scrollOffset: top
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(top * delta);
            }
        });
    }

    onMouseDown = (e) => {
        e.preventDefault();
        let tmp;
        if (this.thumb.style.webkitTransform) {
            tmp = this.thumb.style.webkitTransform.replace('translate(', '').replace(')', '').replace(/px/g, '');
        }
        if (this.thumb.style.mozTransform) {
            tmp = this.thumb.style.mozTransform.replace('translate(', '').replace(')', '').replace(/px/g, '');
        }
        if (this.thumb.style.msTransform) {
            tmp = this.thumb.style.msTransform.replace('translate(', '').replace(')', '').replace(/px/g, '');
        }
        tmp = tmp.split(',');
        if (this.props.type === 'vertical') {
            tmp = parseFloat(tmp[1].trim());
        } else {
            tmp = parseFloat(tmp[0].trim());
        }
        this.thumbOffsetTop = tmp;
        if (this.props.type === 'vertical') {
            this.lastY = e.pageY;
        } else {
            this.lastY = e.pageX;
        }
        Events.on(document, 'mousemove', this.onMouseMove);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.scrollOffset !== this.props.scrollOffset && nextProps.scrollOffset !== this.state.scrollOffset) {
            let delta = 1;
            if (this.props.minThumbSize) {
                const all = this.track.getBoundingClientRect().height;
                delta = (all - this.props.minThumbSize) / (all - this.props.thumbSize);
            }
            this.setState({
                scrollOffset: nextProps.scrollOffset * delta
            });
        }
    }

    render () {
        let {className, style, type, thumbSize} = this.props;
        className = classNames(className, 'cm-scrollbar', {
            [`cm-scrollbar-${type}`]: type
        });
        const scrollOffset = this.state.scrollOffset;
        const newStyle = Object.assign({}, style || {});
        const thumbStyle = {};
        if (type === 'vertical') {
            newStyle.width = this.props.barSize;
            thumbStyle.height = Math.max(thumbSize, this.props.minThumbSize);
            thumbStyle.transform = `translate(0, ${scrollOffset}px)`;
        } else {
            newStyle.height = this.props.barSize;
            thumbStyle.width = Math.max(thumbSize, this.props.minThumbSize);
            thumbStyle.transform = `translate(${scrollOffset}px, 0)`;
        }
        return <div className={className} style={newStyle}>
            <div className='cm-scrollbar-track' ref={(f) => this.track = f}>
                <div className='cm-scrollbar-thumb' style={thumbStyle} ref={(f) => this.thumb = f}></div>
            </div>
        </div>;
    }
}

export default Scrollbar;
