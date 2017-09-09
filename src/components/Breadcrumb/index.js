/**
 * @author cqb 2017-01-04.
 * @module Breadcrumb
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import './Breadcrumb.less';

/**
 * 面包屑类
 * @class Breadcrumb
 * @extends BaseComponent
 * @constructor
 */
class Breadcrumb extends BaseComponent {
    static displayName = "Breadcrumb";

    static propTypes = {
        /**
         * 自定义class
         * @attribute className
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 自定义style
         * @attribute style
         * @type {Object}
         */
        style: PropTypes.object,
        /**
         * 分隔符
         * @attribute separator
         * @type {String}
         */
        separator: PropTypes.string
    }

    static defaultProps = {
        separator: '/'
    }

    /**
     * 渲染子元素
     * @return {[type]} [description]
     */
    renderItems(){
        return React.Children.map(this.props.children, (child)=>{
            let componentName = child.type && child.type.displayName ? child.type.displayName : '';
            if (componentName === 'Item') {
                let props = Object.assign({
                    'separator': this.props.separator
                }, child.props);
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    render(){
        let className = classNames('cm-breadcrumb', this.props.className);
        return (
            <div className={className} style={this.props.style}>
                {this.renderItems()}
            </div>
        );
    }
}

/**
 * 面包屑项目
 * @class Breadcrumb.Item
 * @extends BaseComponent
 * @constructor
 */
class Item extends BaseComponent{
    static displayName = "Item";

    static propTypes = {
        /**
         * 自定义class
         * @attribute className
         * @type {String}
         */
        className: PropTypes.string,
        /**
         * 自定义style
         * @attribute style
         * @type {Object}
         */
        style: PropTypes.object,
        /**
         * 链接地址
         * @attribute link
         * @type {String}
         */
        link: PropTypes.string,
        /**
         * 分隔符
         * @attribute separator
         * @type {String}
         */
        separator: PropTypes.string
    }

    render(){
        let className = classNames('cm-breadcrumb-link', this.props.className);
        let link = this.props.link;
        let linkEle = link ? (<a className={className} href={this.props.link}>
            {this.props.children}
        </a>) : <span className={className}>{this.props.children}</span>;
        return (
            <span>
                {linkEle}
                <span className='cm-breadcrumb-separator'>{this.props.separator}</span>
            </span>
        );
    }
}

Breadcrumb.Item = Item;

export default Breadcrumb;
