import React from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

import './ResizeContent.less';

class ResizeContent extends React.Component {
    displayName = 'ResizeContent';

    static defaultProps = {
        height: 50,
        width: 200,
        minHeight: 20,
        maxHeight: false,
        minWidth: 50,
        maxWidth: false,
        direction: 'horizontal',
        align: 'bottom',
        handlerSize: 7,
        hiddenSize: 7,
        resizeable: true,
        padding: 0,
        visible: true,
        overHidden: false
    }

    static propTypes = {
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        minHeight: PropTypes.number,
        maxHeight: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        minWidth: PropTypes.number,
        maxWidth: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        direction: PropTypes.string,
        align: PropTypes.string,
        handlerSize: PropTypes.number,
        hiddenSize: PropTypes.number,
        padding: PropTypes.number,
        visible: PropTypes.bool,
        overHidden: PropTypes.bool,
        resizeable: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        contentStyle: PropTypes.object,
        headStyle: PropTypes.object,
        onResize: PropTypes.func,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        renderHead: PropTypes.func,
        title: PropTypes.any
    };

    constructor (props) {
        super(props);

        let {style} = this.props;
        const {direction, width, height} = this.props;
        style = style || {};
        if (direction === 'horizontal') {
            style.height = height;
        } else {
            style.width = width;
        }

        this.state = {
            pos: {x: 0, y: 0},
            style,
            visible: this.props.visible
        };
    }

    handleStop = (e, data) => {
        const {direction, align, minHeight, minWidth, maxHeight, maxWidth} = this.props;
        const style = JSON.parse(JSON.stringify(this.state.style));
        if (direction === 'horizontal') {
            if (align === 'bottom') {
                style.height = this.handlePercentSize(this.container, 'height', style.height, data.y);
            } else {
                style.height = this.handlePercentSize(this.container, 'height', style.height, -data.y);
            }
            style.height = Math.max(minHeight, style.height);
            style.height = maxHeight ? Math.min(maxHeight, style.height) : style.height;
        } else {
            if (align === 'left') {
                style.width = style.width - data.x;
            } else {
                style.width = style.width + data.x;
            }
            style.width = Math.max(minWidth, style.width);
            style.width = maxWidth ? Math.min(maxWidth, style.width) : style.width;
        }
        this.setState({
            style
        }, () => {
            if (this.props.onResize) {
                this.props.onResize();
            }
        });
    }

    handlePercentSize (ele, align, v, offset) {
        if (v.indexOf && v.indexOf('%') !== -1) {
            const rect = ele.getBoundingClientRect();
            const size = rect[align];
            const ret = size + offset;
            return ret;
        } else {
            return v + offset;
        }
    }

    componentWillReceiveProps (nextProps) {
        const params = {};
        if (nextProps.visible !== this.props.visible && nextProps.visible !== this.state.visible) {
            params.visible = nextProps.visible;
        }
        if (nextProps.height != this.props.height) {
            params.style = this.state.style;
            params.style.height = nextProps.height;
        }
        this.setState(params, () => {
            if (params.visible !== undefined) {
                if (params.visible) {
                    if (this.props.onOpen) {
                        this.props.onOpen();
                    }
                } else {
                    if (this.props.onClose) {
                        this.props.onClose();
                    }
                }
            }
        });
    }

    /**
     * 渲染内容
     */
    renderContent () {
        const {direction, align, handlerSize, overHidden, padding, resizeable, contentStyle} = this.props;
        const visible = this.state.visible;
        let contStyle = {};
        if (visible) {
            contStyle = {
                paddingLeft: padding,
                paddingRight: padding,
                paddingBottom: padding
            };
        }
        Object.assign(contStyle, contentStyle || {});
        if (overHidden) {
            contStyle.overflow = 'hidden';
        }
        const cont = <div key='cont' className='cm-resize-content-body' style={contStyle}
            ref={(f) => this.cont = f}>
            {this.props.children}
        </div>;
        const hstyle = {};
        if (direction === 'horizontal') {
            hstyle.height = handlerSize;
            hstyle.width = '100%';
        } else {
            hstyle.width = handlerSize;
            hstyle.height = '100%';
        }

        if (resizeable) {
            const handlerClass = classNames('cm-resize-content-drag-helper', {
                [`cm-resize-content-drag-${direction}`]: direction,
                'cm-resize-content-drag-disabled': !visible
            });
            const handler = <Draggable key='handler' 
                axis={direction === 'horizontal' ? 'y' : 'x'}
                position={this.state.pos}
                onStop={this.handleStop}
                disabled={!visible}
            ><div className={handlerClass} style={hstyle}>
                    <div className='cm-resize-content-drag-track'></div>
                </div></Draggable>;
            if (align === 'bottom' || align === 'right') {
                return [cont, handler];
            } else {
                return [handler, cont];
            }
        } else {
            return cont;
        }
    }

    /**
     * 渲染头部
     */
    renderHeader () {
        const {title, renderHead, align, handlerSize, headStyle} = this.props;
        const content = renderHead && typeof renderHead === 'function' ? renderHead(this) : title;
        const style = {};
        style[align] = handlerSize;
        Object.assign(style, headStyle || {});
        if (content) {
            return <div className='cm-resize-content-header' style={style}>
                {content}
            </div>;
        } else {
            return null;
        }
    }

    onTrackClick = (e) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (this.state.visible) {
            this.close();
        } else {
            this.open();
        }
    }

    open () {
        this.setState({visible: true}, () => {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
        });
    }

    close () {
        this.setState({visible: false}, () => {
            if (this.props.onClose) {
                this.props.onClose();
            }
        });
    }

    render () {
        const {style} = this.props;
        const {direction, hiddenSize, title, renderHead, className, align, flex} = this.props;
        const newStyle = Object.assign({}, style || {}, this.state.style);
        if (!this.state.visible) {
            if (direction === 'horizontal') {
                // 记住当前的大小
                this.lastSize = newStyle.height;
                newStyle.height = hiddenSize;
            } else {
                this.lastSize = newStyle.width;
                newStyle.width = hiddenSize;
            }
        } else {
            // 打开的时候初始化记住的大小
            if (this.lastSize) {
                if (direction === 'horizontal') {
                    newStyle.height = this.lastSize;
                } else {
                    newStyle.width = this.lastSize;
                }
                this.lastSize = null;
            }
        }
        const clazzName = classNames(className, 'cm-resize-content', {
            [`cm-resize-content-${direction}`]: direction,
            'cm-resize-content-hidden': !this.state.visible,
            [`cm-resize-content-align-${align}`]: align,
            'cm-resize-content-hasHeader': title || renderHead
        });
        return <div style={newStyle} className={clazzName} ref={(f) => this.container = f}>
            {this.renderHeader()}
            {this.renderContent()}
        </div>;
    }
}

export default ResizeContent;
