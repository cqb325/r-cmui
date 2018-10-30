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
    static displayName = 'ButtonGroup';

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
        size: 'default',
        circle: false,
        current: 0
    }

    constructor (props) {
        super(props);

        this.buttonsMap = {};

        this.addState({
            current: props.current
        });
    }

    /**
     * 获取激活的索引
     * @return {[type]} [description]
     */
    getActive () {
        const btn = this.getActiveBtn();
        if (btn) {
            return btn._index;
        }
        return -1;
    }

    /**
     * 获取当前激活的Button对象
     * @return {[type]} [description]
     */
    getActiveBtn () {
        for (const k in this.buttonsMap) {
            const btn = this.buttonsMap[k];
            if (btn.isActive()) {
                return btn;
            }
        }
        return null;
    }

    /**
     * 设置激活状态
     * @param {[type]} current [description]
     */
    setActive (current) {
        this.setState({
            current
        });
    }

    addButton = (key, index, button) => {
        button._index = index;
        this.buttonsMap[key] = button;
    }

    componentWillUnmount () {
        this.buttonsMap = {};
    }

    onClick = (key) => {
        const button = this.buttonsMap[key];
        if (!button.isActive()) {
            for (const k in this.buttonsMap) {
                const btn = this.buttonsMap[k];
                if (k !== key) {
                    btn.setActive(false);
                }
            }
            button.setActive(true);
            if (this.props.onSelect) {
                this.props.onSelect(button);
            }
            this.emit('select', button);
            // this.buttons.forEach((btn) => {
            //     if (btn != button) {
            //         btn.setActive(false);
            //     } else {
            //         if (this.props.onSelect) {
            //             this.props.onSelect(button);
            //         }
            //         this.emit('select', button);
            //         button.setActive(true);
            //     }
            // });
        }
    }

    renderButtons () {
        return React.Children.map(this.props.children, (child, index) => {
            const componentName = child && child.type && child.type.displayName ? child.type.displayName : '';
            if (componentName === 'Button') {
                const key = `btn_${index}`;
                const props = Object.assign({}, child.props, {
                    ref: this.addButton.bind(this, key, index),
                    size: this.props.size,
                    onClick: this.onClick.bind(this, key),
                    key,
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
    render () {
        let {className, size, circle, style} = this.props;
        className = classNames(
            className,
            'cm-button-group',
            {
                [`cm-button-group-${size}`]: size,
                'cm-button-group-circle': circle
            }
        );

        const btns = this.renderButtons();
        return (
            <span className={className} style={style}>
                {btns}
            </span>
        );
    }
}

export default ButtonGroup;
