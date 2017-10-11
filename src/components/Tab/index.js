/**
 * @author cqb 2016-05-09.
 * @module Tab
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import EnhancedButton from '../internal/EnhancedButton';
import Item from './Item';
import {List} from 'immutable';
import './Tab.less';

/**
 * Tab 类
 * @class Tab
 * @constructor
 * @extend BaseComponent
 */
class Tab extends BaseComponent {
    static displayName = 'Tab';

    static defaultProps = {
        activeIndex: 0,
        hasClose: false
    };

    constructor(props) {
        super(props);

        let data = this.prepare();

        this.addState({
            data: data,
            activeIndex: props.activeIndex
        });
    }

    /**
     * 准备工作，将孩子节点中Item抽取为data
     * @return {[type]} [description]
     */
    prepare(){
        let items = [];
        React.Children.forEach(this.props.children, (child)=>{
            let componentName = child.type && child.type.displayName ? child.type.displayName : '';
            if(componentName === 'Item'){
                items.push({
                    id: child.props.id,
                    text: child.props.title,
                    component: child,
                    data: child.props.data
                });
            }
        });
        let data = this.props.data || [];
        if(items.length){
            data = data.concat(items);
        }

        return data;
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
     * 激活选项的索引
     * @return {[type]} [description]
     */
    getActiveIndex(){
        return this.state.activeIndex;
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
                    {this.props.hasClose ? <a className="cm-tab-close" onClick={this._removeItem.bind(this, item)}>&times;</a> : null}
                    <EnhancedButton initFull touchRippleColor={'rgba(0, 0, 0, 0.1)'}>
                        <a href="javascript:void(0)">{item.text}</a>
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

    /**
     * 添加一个tab项
     * @param {[type]}  item     [description]
     * @param {Boolean} isActive 当前添加的激活
     */
    add(item, isActive){
        if(React.isValidElement(item)){
            let data = {
                id: item.props.id,
                text: item.props.title,
                data: item.props.data,
                component: item
            };

            this.addItem(data, isActive);
        }else{
            this.addItem(item, isActive);
        }
    }

    /**
     * 添加tab项
     * @param {[type]}  item     [description]
     * @param {Boolean} isActive [description]
     */
    addItem(item, isActive){
        let data = this.state.data;
        data = data.concat(item);
        this.setState({data}, ()=>{
            if(isActive){
                this._selectTab(item);
            }
        });
    }

    /**
     * 删除选项
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    remove(item){
        let data = this.state.data;
        let index = -1;
        let isActive = false;
        if(typeof item === 'number'){
            index = item;
            isActive = this.getItem(index).active;
        }else{
            index = data.indexOf(item);
            isActive = item.active;
        }

        let shouldRemove = true;
        if(this.props.onBeforeRemove){
            shouldRemove = this.props.onBeforeRemove(index);
        }

        if(shouldRemove && index > -1){
            let newData = List(data).delete(index).toJS();
            this.setState({data: newData}, ()=>{
                if(isActive){
                    this.selectByIndex(index - 1);
                }
                if(this.props.onRemove){
                    this.props.onRemove(index);
                }
            });
        }
    }

    _removeItem(item, event){
        if(event.stopPropagation()){
            event.stopPropagation();
        }

        this.remove(item);
        return false;
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.activeIndex !== this.state.activeIndex && nextProps.activeIndex !== this.props.activeIndex) {
            this.setState({
                activeIndex: nextProps.activeIndex
            });
        }
    }

    render(){
        let {className, style} = this.props;
        className = classNames('cm-tab', className);

        let headers = this._getHeader();
        let contents = this._getContent();
        return (
            <div className={className} style={style}>
                <ul className="cm-tab-header">
                    {headers}
                </ul>
                <div className="cm-tab-content">
                    {contents}
                </div>
            </div>
        );
    }
}

Tab.Item = Item;

export default Tab;
