/**
 * @author cqb 2016-06-23.
 * @module Panel
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import grids from '../utils/grids';
const getGrid = grids.getGrid;
import Draggable from 'react-draggable';
import './Panel.less';

/**
 * Panel 类
 * @class Panel
 * @constructor
 * @extend BaseComponent
 */
class Panel extends BaseComponent {
    static displayName = 'Panel';

    static propTypes = {
        /**
         * 标题
         * @attribute title
         * @type {String}
         */
        title: PropTypes.string,
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
         * 按钮等
         * @attribute tools
         * @type {Any}
         */
        tools: PropTypes.any,
        /**
         * 按钮等
         * @attribute footers
         * @type {Any}
         */
        footers: PropTypes.any
    };

    static defaultProps = {
        tools: null,
        footers: null
    };

    constructor (props) {
        super(props);

        this.addState({
            title: props.title || '',
            content: props.content || '',
            position: props.position || {}
        });
    }

    /**
     * 设置标题
     * @param title
     */
    setTitle (title) {
        this.setState({title});
    }

    /**
     * 设置内容
     * @param content
     */
    setContent (content) {
        this.setState({content});
    }

    /**
     * 设置内容和标题
     * @param title
     * @param content
     */
    setTitleAndContent (title, content) {
        this.setState({title, content});
    }

    /**
     * title
     * @return {[type]} [description]
     */
    renderHeader () {
        const tools = this.props.tools;

        let toolsCont = null;
        if (tools) {
            toolsCont = (
                <span key='tools' className='cm-panel-tools'>
                    {tools}
                </span>
            );
        }

        const text = <span key='text' className='cm-panel-head-text'>{this.state.title}</span>;
        if (toolsCont) {
            return [text, toolsCont];
        } else {
            return text;
        }
    }

    /**
     * footer
     * @return {[type]} [description]
     */
    renderFooter () {
        const tools = this.props.footers;
        let toolsCont = null;
        if (tools) {
            toolsCont = (
                <div className='cm-panel-footer'>
                    <span className='cm-panel-footer-tools'>
                        {tools}
                    </span>
                </div>
            );
        }

        return toolsCont;
    }

    /**
     *
     * @param nextProps
     */
    componentWillReceiveProps (nextProps) {
        if (this.state.content !== nextProps.content || this.state.title !== nextProps.title) {
            this.setState({
                title: nextProps.title,
                content: nextProps.content
            });
        }
    }

    /**
     * 渲染内容
     * @returns {XML}
     */
    renderContent () {
        if (this.state.content && this.state.content.substring && this.state.content.substring(0, 1) === '<') {
            return (
                <div dangerouslySetInnerHTML={{__html: this.state.content}} />
            );
        } else {
            return this.state.content;
        }
    }

    setPosition (pos) {
        this.setState({
            position: pos
        });
    }

    onDragStop = (event, data) => {
        this.setState({
            position: {
                x: data.x,
                y: data.y
            }
        });
    }

    render () {
        let {className, style, grid} = this.props;

        className = classNames('cm-panel', className, getGrid(grid));

        const headContent = this.renderHeader();
        return (
            <Draggable
                bounds='.shadow-backdrop' 
                handle='.cm-panel-title'
                disabled={!this.props.draggable}
                position={this.state.position}
                onStop={this.onDragStop}
                cancel='.cm-panel-tools,.cm-panel-head-text'>
                <div className={className} style={style}>
                    <div className='cm-panel-title'>
                        {headContent}
                    </div>
                    <div className='cm-panel-content'>
                        {this.renderContent() || this.props.children}
                    </div>
                    {this.renderFooter()}
                </div>
            </Draggable>
        );
    }
}

export default Panel;
