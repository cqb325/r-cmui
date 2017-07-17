/**
 * @author cqb 2016-04-05.
 * @module ButtonGroup
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';

/**
 * Button 类
 * @class ButtonGroup
 * @constructor
 * @extend BaseComponent
 */
class ButtonGroup extends BaseComponent {
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
        style: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.buttons = [];
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
        return React.Children.map(this.props.children, (child)=>{
            let componentName = '';
            if (child.type) {
                if (child.type.name) {
                    componentName = child.type.name;
                } else {
                    let matches = child.type.toString().match(/function\s*([^(]*)\(/);
                    if (matches) {
                        componentName = matches[1];
                    }
                }
            }
            if (componentName === 'Button') {
                let props = Object.assign({
                    'data-itemBind': this.itemBind.bind(this)
                }, child.props);
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
        const className = classNames(
            this.props.className,
            'cm-button-group',
            this.props.size
        );

        var btns = this.renderButtons();
        return (
            <span className={className} style={this.props.style}>
                {btns}
            </span>
        );
    }
}

export default ButtonGroup;
