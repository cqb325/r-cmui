/**
 * @author cqb 2016-05-09.
 * @module Tab
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import EnhancedButton from './internal/EnhancedButton';

/**
 * Tab 类
 * @class Tab
 * @constructor
 * @extend BaseComponent
 */
class Tab extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            data: props.data,
            activeIndex: props.activeIndex || 0
        });
    }

    _selectTab(item){
        if (!item.active) {
            let data = this.state.data;
            let index = data.indexOf(item);
            item.active = true;
            let last = this.state.activeIndex;

            data[last].active = false;
            this.emit('beforeSelect', item);
            if (this.props.onBeforeSelect) {
                this.props.onBeforeSelect(item);
            }
            this.setState({activeIndex: index});
            this.emit('select', item);
            if (this.props.onSelect) {
                this.props.onSelect(item);
            }
        }
    }

    /**
     * 根据索引选择tab
     * @param index {Number} 选择的索引
     */
    selectByIndex(index){
        if (index >= 0 && index < this.state.data.length) {
            let data = this.state.data;
            data.forEach((item, ind)=>{
                if (ind !== index) {
                    item.active = false;
                }
            });
            this.setState({
                activeIndex: index
            });
        }
    }

    /**
     * 获取tab对象
     * @param index
     * @returns {*}
     */
    getItem(index){
        return this.state.data[index];
    }

    /**
     * 获取激活的tab
     * @method getActiveItem
     * @returns {*}
     */
    getActiveItem(){
        return this.state.data[this.state.activeIndex];
    }

    _getHeader(){
        let data = this.state.data;
        let activeIndex = this.state.activeIndex;
        return data.map(function(item, index){
            if (activeIndex === index) {
                item.active = true;
            }

            let className = classNames({
                active: item.active
            });
            return (
                <li key={index} className={className} onClick={()=>{ this._selectTab(item); }}>
                    <EnhancedButton initFull touchRippleColor={'rgba(0, 0, 0, 0.1)'}>
                        <a href='javascript:void(0)'>{item.text}</a>
                    </EnhancedButton>
                </li>
            );
        }, this);
    }

    _getContent(){
        let data = this.state.data;
        let activeIndex = this.state.activeIndex;

        return data.map(function(item, index){
            if (activeIndex === index) {
                item.active = true;
            }

            let className = classNames('cm-tab-panel', {
                active: item.active
            });

            let component = item.component;
            let tabPanel = null;
            if (React.isValidElement(component)) {
                let newProps = Object.assign({ref: item.id, data: item.data}, component.props);
                tabPanel = React.cloneElement(component, newProps);
            } else {
                tabPanel = React.createElement(component, {ref: item.id, data: item.data});
            }

            return (
                <div key={index} className={className}>
                    {tabPanel}
                </div>
            );
        }, this);
    }

    render(){
        let {className, style} = this.props;
        className = classNames('cm-tab', className);

        let headers = this._getHeader();
        let contents = this._getContent();
        return (
            <div className={className} style={style}>
                <ul className='cm-tab-header'>
                    {headers}
                </ul>
                <div className='cm-tab-content'>
                    {contents}
                </div>
            </div>
        );
    }
}

export default Tab;
