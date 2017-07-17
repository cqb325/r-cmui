/**
 * @author cqb 2016-06-23.
 * @module Panel
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import grids from './utils/grids';
const getGrid = grids.getGrid;

/**
 * Panel 类
 * @class Panel
 * @constructor
 * @extend BaseComponent
 */
class Panel extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            title: props.title || '',
            content: props.content || ''
        });
    }

    /**
     * 设置标题
     * @param title
     */
    setTitle(title){
        this.setState({title});
    }

    /**
     * 设置内容
     * @param content
     */
    setContent(content){
        this.setState({content});
    }

    /**
     * 设置内容和标题
     * @param title
     * @param content
     */
    setTitleAndContent(title, content){
        this.setState({title, content});
    }

    renderHeader(){
        let tools = this.props.tools;
        let align = tools ? tools.align || 'right' : '';

        let toolsCont = null;
        if (tools) {
            let components = tools.components;

            if (components && components.length) {
                let className = classNames('cm-panel-tools', align);

                let comps = components.map(function(comp, index){
                    let nextProps = Object.assign({key: comp.props.key || index + ''}, comp.props);
                    return React.cloneElement(comp, nextProps);
                });
                toolsCont = (
                    <span key='tools' className={className}>
                        {comps}
                    </span>
                );
            }
        }

        let text = <span key='text' className='cm-panel-head-text'>{this.state.title}</span>;
        if (toolsCont) {
            if (align === 'right') {
                return [text, toolsCont];
            } else {
                return [toolsCont, text];
            }
        } else {
            return text;
        }
    }

    renderFooter(){
        let tools = this.props.footers;
        let toolsCont = null;
        if (tools) {
            let components = tools.components;

            if (components && components.length) {
                let className = classNames('cm-panel-footer-tools');

                let comps = components.map(function(comp, index){
                    let nextProps = Object.assign({key: comp.props.key || index + ''}, comp.props);
                    return React.cloneElement(comp, nextProps);
                });
                toolsCont = (
                    <div className='cm-panel-footer'>
                        <span className={className}>
                            {comps}
                        </span>
                    </div>
                );
            }
        }

        return toolsCont;
    }

    /**
     *
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){
        if (this.props.content !== nextProps.content || this.props.title !== nextProps.title) {
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
    renderContent(){
        if (this.state.content && this.state.content.substring && this.state.content.substring(0, 1) === '<') {
            return (
                <div dangerouslySetInnerHTML={{__html: this.state.content}} />
            );
        } else {
            return this.state.content;
        }
    }

    render(){
        let {className, style, grid} = this.props;

        className = classNames('cm-panel', className, getGrid(grid));

        let headContent = this.renderHeader();
        return (
            <div className={className} style={style}>
                <div className='cm-panel-title'>
                    {headContent}
                </div>
                <div className='cm-panel-content'>
                    {this.renderContent() || this.props.children}
                </div>
                {this.renderFooter()}
            </div>
        );
    }
}

Panel.propTypes = {
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
    style: PropTypes.object
};

export default Panel;
