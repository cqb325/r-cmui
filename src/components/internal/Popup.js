/**
 * @author cqb 2017-01-13.
 * @module Popup
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from "classnames";
import Dom from '../utils/Dom';
import Events from '../utils/Events';

/**
 * Popup 类
 * @class Popup
 * @constructor
 * @extend React.Component
 */
class Popup extends Component{
    constructor(props){
        super(props);

        this.state = {
            visible: this.props.visible,
            content: null
        };
        //距离目标的距离
        this.gap = 5;
        this.timer = null;
        this.scrollElements = [];
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.visible !== this.state.visible) {
            this.setState({
                visible: nextProps.visible
            });
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;

        let flag = false;
        Events.on(window, "resize", (e)=>{
            if(!flag){
                flag = true;
                if(this.timer){
                    clearTimeout(this.timer);
                }
                this.timer = window.setTimeout(()=>{
                    if(this.state.visible && this._isMounted){
                        this.update(this.state.visible);
                    }
                    flag = false;
                },100);
            }
        });


        this.getScrollElements(this.props.baseEle);

        this.scrollElements.forEach((ele)=>{
            Events.on(ele, "scroll", (e)=>{
                if(this.state.visible && this._isMounted){
                    this.update(this.state.visible);
                }
            });
        });
    }

    update(visible){
        let tip = Dom.dom(ReactDOM.findDOMNode(this));
        if(visible) {
            let base = Dom.dom(this.props.baseEle);
            let baseOffset = base.offset();
            let scroll = this.getScroll(this.props.baseEle);

            let scrollTop = scroll.top;
            let scrollLeft = scroll.left;
            // if(this.props.offsetEle) {
            //     scrollTop = Dom.query(this.props.offsetEle).scrollTop;
            //     scrollLeft = Dom.query(this.props.offsetEle).scrollLeft;
            // }

            let style = {};
            let baseWidth = base.width();
            let baseHeight = base.height();

            tip.show();
            let tipWidth = tip.width();
            let tipHeight = tip.height();

            if (this.props.align === "top") {
                style.left = baseOffset.left + baseWidth / 2 - tipWidth / 2;
                style.top = baseOffset.top - tipHeight - this.gap;
            }
            if (this.props.align === "topRight") {
                style.left = baseOffset.left - (tipWidth - baseWidth);
                style.top = baseOffset.top - tipHeight - this.gap;
            }
            if (this.props.align === "topLeft") {
                style.left = baseOffset.left;
                style.top = baseOffset.top - tipHeight - this.gap;
            }

            if (this.props.align === "bottom") {
                style.left = baseOffset.left + baseWidth / 2 - tipWidth / 2;
                style.top = baseOffset.top + baseHeight + this.gap;
            }
            if (this.props.align === "bottomRight") {
                style.left = baseOffset.left - (tipWidth - baseWidth);
                style.top = baseOffset.top + baseHeight + this.gap;
            }
            if (this.props.align === "bottomLeft") {
                style.left = baseOffset.left;
                style.top = baseOffset.top + baseHeight + this.gap;
            }

            if (this.props.align === "left") {
                style.left = baseOffset.left - tipWidth - this.gap;
                style.top = baseOffset.top + (baseHeight - tipHeight) / 2;
            }
            if (this.props.align === "leftTop") {
                style.left = baseOffset.left - tipWidth - this.gap;
                style.top = baseOffset.top;
            }
            if (this.props.align === "leftBottom") {
                style.left = baseOffset.left - tipWidth - this.gap;
                style.top = baseOffset.top - (tipHeight - baseHeight);
            }

            if (this.props.align === "right") {
                style.left = baseOffset.left + baseWidth + this.gap;
                style.top = baseOffset.top + (baseHeight - tipHeight) / 2;
            }
            if (this.props.align === "rightTop") {
                style.left = baseOffset.left + baseWidth + this.gap;
                style.top = baseOffset.top;
            }
            if (this.props.align === "rightBottom") {
                style.left = baseOffset.left + baseWidth + this.gap;
                style.top = baseOffset.top - (tipHeight - baseHeight);
            }

            style.top = style.top - scrollTop;
            style.left = style.left - scrollLeft;

            this.setState({
                visible: visible,
                style: style
            });
        }else{
            this.setState({
                visible: visible
            });

            // window.setTimeout(()=>{
            //     tip.hide();
            // }, this.props.delay || 0);
        }

        if(this.props.onVisibleChange){
            this.props.onVisibleChange(visible);
        }
    }

    /**
     * 获取存在滚动条的元素
     * @param ele
     */
    getScrollElements(ele){
        let parent = ele.parentNode;

        while(parent !== null && parent.tagName !== "HTML"){
            if(parent.scrollHeight>parent.offsetHeight && (Dom.dom(parent).css("overflow-y") !== "hidden" || Dom.dom(parent).css("overflow-x") !== "hidden")){
                this.scrollElements.push(parent);
            }
            parent = parent.parentNode;
        }
    }

    /**
     * 获取Scroll
     * @returns {{top: number, left: number}}
     */
    getScroll(){
        let top = 0, left = 0;
        this.scrollElements.forEach((ele)=>{
            if(ele.tagName !== "BODY") {
                top += ele.scrollTop;
                left += ele.scrollLeft;
            }
        });
        return {
            top: top,
            left: left
        }
    }

    setContent(content){
        this.setState({content});
    }

    render(){
        let className = classNames({
            visible: this.state.visible
        },this.props.extraProps ? this.props.extraProps.className : "", this.props.align);
        let style = Object.assign({},this.props.extraProps.style, this.state.style);
        return (
            <div className={className} style={style}>
                {this.state.content || this.props.children}
            </div>
        );
    }
}

export default Popup;
