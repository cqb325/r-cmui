/**
 * @author cqb 2017-01-13.
 * @module InnerDropdown
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import velocity from "velocity";
import Popup from './Popup';
import Events from '../utils/Events';
import Dom from '../utils/Dom';
const isDescendant = Dom.isDescendant;

/**
 * InnerDropdown 类
 * @class InnerDropdown
 * @constructor
 * @extend React.Component
 */
class InnerDropdown extends React.Component{

    constructor(props){
        super(props);

        let popupVisible;
        if ('popupVisible' in props) {
            popupVisible = !!props.popupVisible;
        } else {
            popupVisible = false;
        }

        this.state = {
            popupVisible: popupVisible
        };

        this.overlay = props.overlay;
        this.overlaySelect = this.overlay.onSelect;
    }

    isClickToShow() {
        const { action} = this.props;
        return action.indexOf('click') !== -1;
    }

    isClickToHide() {
        const { action } = this.props;
        return action.indexOf('click') !== -1;
    }

    isMouseEnterToShow() {
        const { action } = this.props;
        return action.indexOf('hover') !== -1;
    }

    isMouseLeaveToHide() {
        const { action } = this.props;
        return action.indexOf('hover') !== -1;
    }

    onClick(event){
        const nextVisible = !this.state.popupVisible;
        if (this.isClickToHide() && !nextVisible || nextVisible && this.isClickToShow()) {
            this.setPopupVisible(!this.state.popupVisible);
        }
    }

    onDocumentClick(event){
        let target = event.target || event.srcElement;
        let triggerEle = ReactDOM.findDOMNode(this.refs.target);
        let overlayEle = ReactDOM.findDOMNode(this.popupRef);
        if(target != triggerEle && !isDescendant(triggerEle, target) && target != overlayEle && !isDescendant(overlayEle, target)){
            this.setPopupVisible(false);
        }
        return false;
    }

    onMouseEnter(event){
        if(!this.state.popupVisible) {
            this.delaySetPopupVisible(true, this.props.mouseEnterDelay);
        }
    }

    onMouseLeave(event){

    }

    onDocumentMove(event){
        if(!this.state.popupVisible){
            return true;
        }
        let target = event.target || event.srcElement;
        if(this.timer){
            window.clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = window.setTimeout(()=>{
            let triggerEle = ReactDOM.findDOMNode(this.refs.target);
            let overlayEle = ReactDOM.findDOMNode(this.popupRef);
            if(target != triggerEle && !isDescendant(triggerEle, target) && target != overlayEle && !isDescendant(overlayEle, target)){
                this.setPopupVisible(false);
            }
        }, this.props.mouseLeaveDelay * 1000);

    }

    onSelect(item){
        this.delaySetPopupVisible(false, this.props.mouseLeaveDelay);
        if(this.overlaySelect){
            this.overlaySelect(item);
        }
    }

    setPopupVisible(popupVisible){
        if(this._isMounted) {
            this.setState({popupVisible});
            this.popupRef.update(popupVisible);
        }
    }

    delaySetPopupVisible(popupVisible, delay){
        window.setTimeout(()=>{
            if(this._isMounted) {
                if(!this.state.isEmpty) {
                    this.setState({popupVisible});
                    this.popupRef.update(popupVisible);
                }
            }
        }, delay*1000);
    }


    componentWillUnmount(){
        this._isMounted = false;
        let p = this.container.parentNode;
        p.removeChild(this.container);

        let target = ReactDOM.findDOMNode(this.refs.target);
        Events.off(target, "click", this.onClick);
        Events.off(document, "click", this.onClick);
        Events.off(target, "mouseenter", this.onMouseEnter);
        Events.off(target, "mouseleave", this.onMouseLeave);
        Events.off(document, "mousemove", this.onDocumentMove);
    }


    onVisibleChange(visible){
        let tip = ReactDOM.findDOMNode(this.popupRef);
        if(!visible){
            velocity(tip, "slideUp", {duration: 300});
        }else{
            velocity(tip, "slideDown", {duration: 300});
        }
        if(this.props.onVisibleChange){
            this.props.onVisibleChange();
        }
    }

    componentDidMount(){
        this._isMounted = true;
        this.container = document.createElement("div");
        document.body.appendChild(this.container);
        let baseEle = ReactDOM.findDOMNode(this);

        let props = {
            align: this.props.align,
            baseEle: baseEle,
            visible: this.state.popupVisible,
            extraProps: this.props.extraProps,
            delay: this.props.delay,
            onVisibleChange: this.onVisibleChange.bind(this)
        };

        let overlayProps = Object.assign({
            onSelect: this.onSelect.bind(this),
            prefix: "cm-dropdown-menu",
            startIndex: 0
        }, this.overlay.props);
        let newOverlay = React.cloneElement(this.overlay, overlayProps);
        window.setTimeout(()=>{
            ReactDOM.render(<Popup ref={(ref)=>{this.popupRef = ref;}} {...props}>{newOverlay}</Popup>, this.container);
        },0);

        if (this.isClickToHide() || this.isClickToShow()) {
            Events.on(document, "click", this.onDocumentClick.bind(this));
        }

        if (this.isMouseLeaveToHide()) {
            Events.on(document, "mousemove", this.onDocumentMove.bind(this));
        }

    }

    render(){
        const props = this.props;
        const children = props.children;
        const child = React.Children.only(children);
        const newChildProps = {
            ref: "target"
        };

        if (this.isClickToHide() || this.isClickToShow()) {
            newChildProps.onClick = this.onClick.bind(this);
        }

        if (this.isMouseEnterToShow()) {
            newChildProps.onMouseEnter = this.onMouseEnter.bind(this);
        }

        if (this.isMouseLeaveToHide()) {
            //newChildProps.onMouseLeave = this.onMouseLeave.bind(this);
        }

        return React.cloneElement(child, newChildProps);
    }
}

InnerDropdown.defaultProps = {
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0.2
};


export default InnerDropdown;
