/**
 * @author cqb 2017-01-10.
 * @module Card
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseComponent from '../core/BaseComponent';
import './Card.less';

/**
 * Card 类
 * @class Card
 * @constructor
 * @extend BaseComponent
 */
class Card extends BaseComponent {
    static displayName = 'Card';

    static propTypes = {
        /**
         * 自定义class
         * @attribute className
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 自定义样式
         * @attribute style
         * @type {Object}
         */
        style: PropTypes.object,
        /**
         * 标题
         * @attribute title
         * @type {String/Object}
         */
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        /**
         * 工具栏
         * @attribute tools
         * @type {Array}
         */
        tools: PropTypes.array,
        /**
         * 是否有边框
         * @attribute border
         * @type {Boolean}
         */
        border: PropTypes.bool,
        /**
         * 是否预加载
         * @attribute loadding
         * @type {Boolean}
         */
        loadding: PropTypes.bool
    }

    static defaultProps = {
        title: null,
        tools: null,
        content: null,
        border: true,
        loadding: false
    }

    /**
     * 渲染头部
     * @method _renderHeader
     * @private
     */
    _renderHeader () {
        if (!this.props.title && !this.props.tools) {
            return null;
        }

        return (
            <div className='cm-card-head'>
                <h3 className='cm-card-head-title'>{this.props.title}</h3>
                <div className='cm-card-tools'>
                    {this.props.tools}
                </div>
            </div>
        );
    }

    render () {
        let {className, style, border, loadding, children, bodyStyle, noAnimation} = this.props;
        className = classNames('cm-card', className, {
            'cm-card-bordered': border,
            'cm-card-no-animation': noAnimation
        });

        const head = this._renderHeader();
        let content = this.props.content || children;
        if (loadding && !content) {
            content = (
                <div>
                    <p className='cm-card-loading-block' style={{width: '94%'}} />
                    <p>
                        <span className='cm-card-loading-block' style={{width: '28%'}} />
                        <span className='cm-card-loading-block' style={{width: '62%'}} />
                    </p>
                    <p>
                        <span className='cm-card-loading-block' style={{width: '22%'}} />
                        <span className='cm-card-loading-block' style={{width: '66%'}} />
                    </p>
                    <p>
                        <span className='cm-card-loading-block' style={{width: '56%'}} />
                        <span className='cm-card-loading-block' style={{width: '39%'}} />
                    </p>
                    <p>
                        <span className='cm-card-loading-block' style={{width: '21%'}} />
                        <span className='cm-card-loading-block' style={{width: '15%'}} />
                        <span className='cm-card-loading-block' style={{width: '40%'}} />
                    </p>
                </div>
            );
        }

        return (
            <div className={className} style={style}>
                {head}
                <div className='cm-card-body' style={bodyStyle}>
                    {content}
                </div>
            </div>
        );
    }
}

export default Card;
