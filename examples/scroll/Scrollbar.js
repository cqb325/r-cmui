import React from 'react';
import classNames from 'classnames';
import Events from '../../src/components/utils/Events';

class Scrollbar extends React.Component {
    displayName = 'Scrollbar';

    static defaultProps = {
        type: 'vertical',
        barSize: 8,
        thumbSize: 30,
        scrollOffset: 0
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
        if (this.props.type === 'vertical') {
            y2 = e.pageY;
            max = this.track.getBoundingClientRect().height - this.props.thumbSize;
        } else {
            y2 = e.pageX;
            max = this.track.getBoundingClientRect().width - this.props.thumbSize;
        }
        let top = this.thumbOffsetTop + y2 - this.lastY;
        top = Math.max(0, top);
        top = Math.min(max, top);

        this.setState({
            scrollOffset: top
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(top);
            }
        });
    }

    onMouseDown = (e) => {
        e.preventDefault();
        let tmp = this.thumb.style.webkitTransform.replace('translate(', '').replace(')', '').replace(/px/g, '');
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
            this.setState({
                scrollOffset: nextProps.scrollOffset
            });
        }
    }

    render () {
        let {className, style, type, thumbSize} = this.props;
        className = classNames(className, 'cm-scrollbar', {
            [`cm-scrollbar-${type}`]: type
        });
        const scrollOffset = this.state.scrollOffset;
        style = style || {};
        const thumbStyle = {};
        if (type === 'vertical') {
            style.width = this.props.barSize;
            thumbStyle.height = thumbSize;
            thumbStyle.transform = `translate(0, ${scrollOffset}px)`;
        } else {
            style.height = this.props.barSize;
            thumbStyle.width = thumbSize;
            thumbStyle.transform = `translate(${scrollOffset}px, 0)`;
        }
        return <div className={className} style={style}>
            <div className='cm-scrollbar-track' ref={(f) => this.track = f}>
                <div className='cm-scrollbar-thumb' style={thumbStyle} ref={(f) => this.thumb = f}></div>
            </div>
        </div>;
    }
}

export default Scrollbar;
