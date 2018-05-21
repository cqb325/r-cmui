/**
 * @author cqb 2017-03-10.
 * @module Slick
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import Dom from '../utils/Dom';
import velocity from '../../lib/velocity';
import './Slick.less';


/**
 * Slick 类
 * @class Slick
 * @constructor
 * @extend BaseComponent
 */
class Slick extends BaseComponent {
    static displayName = 'Slick';
    static defaultProps = {
        current: 0,
        layout: 'horizontal',
        autoPlay: false,
        delay: 3000
    };
    constructor (props) {
        super(props);

        this.addState({
            current: props.current,
            layout: props.layout,
            autoPlay: props.autoPlay,
            effect: props.effect
        });

        this.dots = null;

        this._width = 0, this._height = 0;
        this._stack = null;
        this._lastActiveIndex = 0;
    }

    getActive () {
        return this.state.current;
    }

    /**
     * 跳转到
     * @param index
     * @param callback
     */
    jumpTo (index, callback) {
        if (!callback) {
            callback = function () {};
        }
        if (this._isMounted) {
            this.setState({
                current: index
            });
        }

        if (this.props.onShow) {
            this.props.onShow(index);
        }

        this.emit('show', index);

        if (this.props.effect === 'slide') {
            this.slide(index, callback);
        } else if (this.props.effect === 'fade') {
            this.fade(index, callback);
        } else {
            this.slideNormal(index, callback);
        }

        this._lastActiveIndex = index;
    }

    /**
     * fade 特效
     * @param index
     * @param callback
     */
    fade (index, callback) {
        const ele = Dom.dom(ReactDOM.findDOMNode(this));
        const items = Dom.dom(Dom.queryAll('.cm-slick-item', ele[0]));
        if (this._lastActiveIndex !== index) {
            velocity(items[this._lastActiveIndex], 'fadeOut', { duration: 300 });
            velocity(items[index], 'fadeIn', {
                duration: 300,
                complete: () => {
                    callback(index);
                    if (this.props.onShown) {
                        this.props.onShown(index);
                    }
                    this.emit('shown', index);
                }
            });
        }
    }

    /**
     * velocity 特效
     * @param index
     * @param callback
     */
    slide (index, callback) {
        if (this.props.layout === 'vertical') {
            const top = -this._height * index;
            velocity(this._stack[0], {top}, {
                duration: 300,
                complete: () => {
                    callback(index);
                    if (this.props.onShown) {
                        this.props.onShown(index);
                    }
                    this.emit('shown', index);
                }
            });
        } else {
            const left = -this._width * index;
            velocity(this._stack[0], {left}, {
                duration: 300,
                complete: () => {
                    callback(index);
                    if (this.props.onShown) {
                        this.props.onShown(index);
                    }
                    this.emit('shown', index);
                }
            });
        }
    }

    /**
     * 直接跳转
     * @param index
     * @param callback
     */
    slideNormal (index, callback) {
        if (this.props.layout === 'vertical') {
            const top = -this._height * index;
            this._stack.css({
                top: `${top  }px`
            });
        } else {
            const left = -this._width * index;
            this._stack.css({
                left: `${left  }px`
            });
        }
        callback(index);
        if (this.props.onShown) {
            this.props.onShown(index);
        }
        this.emit('shown', index);
    }

    /**
     * 静默跳转
     * @param index
     * @param callback
     */
    slideNormalSilent (index) {
        if (this.props.layout === 'vertical') {
            const top = -this._height * index;
            this._stack.css({
                top: `${top  }px`
            });
        } else {
            const left = -this._width * index;
            this._stack.css({
                left: `${left  }px`
            });
        }
    }

    /**
     * 渲染子元素
     * @returns {*}
     */
    renderChildren () {
        this.dots = [];
        const cildren = this.props.children;
        return React.Children.map(cildren, (child, index) => {
            const active = this.state.current === index;
            if (child.props.name === 'Slick.Item') {
                let props = child.props;
                props = Object.assign({}, props, {
                    index,
                    active,
                    parent: this
                });
                this.dots.push(<li key={index}
                    className={active ? 'cm-click-dot-active' : ''}
                    onClick={this.jumpTo.bind(this, index, null)}>
                    <button>{index}</button>
                </li>);
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    /**
     * 将最后一个放到第一个前面
     * @param last
     */
    setLastToFirst (last) {
        if (this.props.layout === 'vertical') {
            last.css({
                position: 'absolute',
                top: `${-this._height  }px`,
                left: 0
            });
        } else {
            last.css({
                position: 'absolute',
                left: `${-this._width  }px`,
                top: 0
            });
        }
    }

    /**
     * 重置最后一个元素的样式
     */
    resetLastStyle (last) {
        last.css({
            position: 'static',
            top: 'auto',
            left: 'auto'
        });
    }

    /**
     * 播放
     */
    play () {
        const ele = Dom.dom(ReactDOM.findDOMNode(this));
        const items = Dom.dom(Dom.queryAll('.cm-slick-item', ele[0]));

        window.setInterval(() => {
            let current = this.state.current;
            if (this.props.effect === 'slide' && current === this.dots.length - 1) {
                const last = items.last();
                this.setLastToFirst(last);
                this.slideNormalSilent(-1);
            }
            current = (this.state.current + 1) % this.dots.length;

            this.jumpTo(current, () => {
                if (this.props.effect === 'slide' && current === 0) {
                    const last = items.last();
                    this.resetLastStyle(last);
                }
            });
        }, this.props.delay);
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    /**
     * 初始化大小和位置
     */
    componentDidMount () {
        this._isMounted = true;
        const ele = Dom.dom(ReactDOM.findDOMNode(this));
        this._width = ele.width();
        this._height = ele.height();
        const length = this.dots.length;
        const totalWidth = this._width * length;
        const totalHeight = this._height * length;

        this._stack = Dom.dom(Dom.query('.cm-slick-stack', ele[0]));
        const items = Dom.dom(Dom.queryAll('.cm-slick-item', ele[0]));
        const list = Dom.dom(Dom.queryAll('.cm-slick-list', ele[0]));
        if (this.props.effect === 'fade') {
            this._stack.css('height', '100%');
            this._stack.css('width', '100%');
            items.css({
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0,
                height: '100%',
                width: '100%'
            });
            items.at(this._lastActiveIndex).css({
                opacity: 1
            });
        } else {
            if (this.props.layout === 'vertical') {
                this._stack.css('height', `${totalHeight  }px`);
                this._stack.css('width', '100%');
                items.css({
                    height: `${this._height  }px`,
                    width: '100%'
                });
                list.css({
                    height: `${this._height  }px`,
                    width: '100%'
                });
            } else {
                this._stack.css('width', `${totalWidth  }px`);
                this._stack.css('height', '100%');
                list.css({
                    width: `${this._width  }px`,
                    height: '100%'
                });
                items.css({
                    width: `${this._width  }px`,
                    height: '100%'
                });
            }
        }

        if (this.state.autoPlay) {
            this.play();
        }
    }

    componentWillReceiveProps (nextProps) {
        const params = {};
        if (nextProps.current !== this.props.value) {
            params.current = nextProps.current;
        }
        if (nextProps.autoPlay !== this.props.autoPlay) {
            params.autoPlay = nextProps.autoPlay;
        }
        this.setState(params);
    }

    render () {
        let {className, style, layout} = this.props;

        className = classNames(className, 'cm-slick', {
            [`cm-slick-${layout}`]: layout
        });
        return (
            <div className={className} style={style}>
                <div className='cm-slick-slider'>
                    <div className='cm-slick-list'>
                        <div className='cm-slick-stack'>
                            {this.renderChildren()}
                        </div>
                    </div>
                    <ul className='cm-slick-dots'>
                        {this.dots}
                    </ul>
                </div>
            </div>
        );
    }
}

/**
 * Slick.Item 类
 * @class Slick.Item
 * @constructor
 * @extend BaseComponent
 */
class Item extends BaseComponent {
    static displayName = 'Item';

    static defaultProps = {
        name: 'Slick.Item'
    };

    constructor (props) {
        super(props);

        this.addState({

        });
    }

    render () {
        const className = classNames(this.props.className, 'cm-slick-item', {
            'cm-slick-active': this.props.active
        });
        return (
            <div className={className} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}

Slick.Item = Item;

export default Slick;
