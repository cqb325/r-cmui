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
    static displayName = "Card";

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

    constructor(props) {
        super(props);

        this.addState({
            title: props.title || null,
            content: null
        });
    }

    /**
     * 设置标题
     * @param {[type]} title [description]
     */
    setTitle(title){
        this.setState({title});
    }

    /**
     * 设置内容
     * @param {[type]} content [description]
     */
    setContent(content){
        this.setState({content});
    }

    /**
     * 渲染头部
     * @method _renderHeader
     * @private
     */
    _renderHeader(){
        if (!this.props.title && !this.props.tools) {
            return null;
        }

        return (
            <div className='cm-card-head'>
                <h3 className='cm-card-head-title'>{this.state.title}</h3>
                <div className='cm-card-tools'>
                    {this.props.tools}
                </div>
            </div>
        );
    }

    componentWillReceiveProps(nextProps){
        let params = {};
        if (nextProps.title !== this.props.title) {
            params.title = nextProps.title;
        }
        if (nextProps.content !== this.props.content) {
            params.content = nextProps.content;
        }

        this.setState(params);
    }

    render(){
        let {className, style, border, loadding, children, bodyStyle} = this.props;
        className = classNames('cm-card', className, {
            'cm-card-bordered': border
        });

        let head = this._renderHeader();
        let content = null;
        if (loadding && !this.state.content) {
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
        } else {
            content = this.state.content || children;
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
