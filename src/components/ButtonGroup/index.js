/**
 * @author cqb 2016-04-05.
 * @module ButtonGroup
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';

/**
 * Button 类
 * @class ButtonGroup
 * @constructor
 * @extend BaseComponent
 */
class ButtonGroup extends BaseComponent {
    static displayName = "ButtonGroup";

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
         * 当前激活的索引
         * @attribute current
         * @default 0
         * @type {Number} 索引
         */
        current: PropTypes.number
    }

    static defaultProps = {
        size: null,
        circle: false,
        current: 0
    }

    constructor(props) {
        super(props);

        this.buttons = [];

        this.addState({
            current: props.current
        });
    }

    /**
     * 获取激活的索引
     * @return {[type]} [description]
     */
    getActive(){
        return this.state.current;
    }

    /**
     * 获取当前激活的Button对象
     * @return {[type]} [description]
     */
    getActiveBtn(){
        return this.buttons[this.state.current];
    }

    /**
     * 设置激活状态
     * @param {[type]} current [description]
     */
    setActive(current){
        this.setState({
            current
        });
    }

    itemBind(button){
        this.buttons.push(button);
        button.on('click', ()=>{
            if (!button.getActive()) {
                this.buttons.forEach((btn)=> {
                    if (btn != button) {
                        btn.setActive(false);
                    } else {
                        if (this.props.onSelect) {
                            this.props.onSelect(btn);
                        }
                        this.emit('select', btn);
                        btn.setActive(true);
                    }
                });
            }
        });
    }

    renderButtons(){
        return React.Children.map(this.props.children, (child, index)=>{
            let componentName = child.type && child.type.displayName ? child.type.displayName : '';
            if (componentName === 'Button') {
                let props = Object.assign({}, child.props, {
                    'itemBind': this.itemBind.bind(this),
                    size: this.props.size,
                    active: this.state.current === index
                });
                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    /**
     * 渲染
     */
    render(){
        let {className, size, circle, style} = this.props;
        className = classNames(
            className,
            'cm-button-group',
            {
                [`cm-button-group-${size}`]: size,
                'cm-button-group-circle': circle
            }
        );

        var btns = this.renderButtons();
        return (
            <span className={className} style={style}>
                {btns}
            </span>
        );
    }
}

export default ButtonGroup;
