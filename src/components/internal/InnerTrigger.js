/**
 * @author cqb 2017-01-13.
 * @module InnerTrigger
 */

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup';
import Events from '../utils/Events';

/**
 * InnerTrigger 类
 * @class InnerTrigger
 * @constructor
 * @extend React.Component
 */
class InnerTrigger extends PureComponent{
    constructor(props){
        super(props);

        let popupVisible;
        if ('popupVisible' in props) {
            popupVisible = !!props.popupVisible;
        } else {
            popupVisible = false;
        }

        this.state = {
            popupVisible: popupVisible,
            isEmpty: props.isEmpty
        };

        this.popup = props.popup;
    }

    isClickToShow() {
        const { action, showAction } = this.props;
        return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
    }

    isClickToHide() {
        const { action, hideAction } = this.props;
        return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
    }

    isMouseEnterToShow() {
        const { action, showAction } = this.props;
        return action.indexOf('hover') !== -1 || showAction.indexOf('mouseEnter') !== -1;
    }

    isMouseLeaveToHide() {
        const { action, hideAction } = this.props;
        return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseLeave') !== -1;
    }

    onClick(event){
        event.preventDefault();
        const nextVisible = !this.state.popupVisible && !this.state.isEmpty;
        if (this.isClickToHide() && !nextVisible || nextVisible && this.isClickToShow()) {
            this.setPopupVisible(!this.state.popupVisible);
        }
    }

    onMouseEnter(){
        this.delaySetPopupVisible(true, this.props.mouseEnterDelay);
    }

    onMouseLeave(){
        this.delaySetPopupVisible(false, this.props.mouseLeaveDelay);
    }

    setPopupVisible(popupVisible){
        if (this._isMounted) {
            this.setState({popupVisible});
            this.popupRef.update(popupVisible);
        }
    }

    delaySetPopupVisible(popupVisible, delay){
        window.setTimeout(()=>{
            if (this._isMounted) {
                if (!this.state.isEmpty) {
                    this.setState({popupVisible});
                    this.popupRef.update(popupVisible);
                }
            }
        }, delay * 1000);
    }

    /**
     * 重新设置显示内容
     * @param title
     */
    updateContent(title){
        this.popupRef.setContent(title);
    }

    /**
     * 空的内容不显示
     * @param empty
     */
    contentIsEmpty(empty){
        this.setState({isEmpty: empty});
        if (empty){
            this.setState({ popupVisible: false });
            this.popupRef.update(false);
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        let p = this.container.parentNode;
        p.removeChild(this.container);

        let target = ReactDOM.findDOMNode(this.refs.target);
        Events.off(target, 'click', this.onClick);
        Events.off(target, 'mouseenter', this.onMouseEnter);
        Events.off(target, 'mouseleave', this.onMouseLeave);
    }

    componentDidMount(){
        this._isMounted = true;
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        let baseEle = ReactDOM.findDOMNode(this);

        let props = {
            align: this.props.align,
            baseEle: baseEle,
            offsetEle: this.props.offsetEle,
            visible: this.state.popupVisible,
            extraProps: this.props.extraProps,
            delay: this.props.delay,
            onVisibleChange: this.props.onVisibleChange
        };

        window.setTimeout(()=>{
            ReactDOM.render(<Popup ref={(ref)=>{ this.popupRef = ref; }} {...props}>
                {typeof this.popup === 'function' ? this.popup() : this.popup}
            </Popup>, this.container);
        }, 0);
    }

    render(){
        const props = this.props;
        const children = props.children;
        const child = React.Children.only(children);
        const newChildProps = {
            ref: 'target'
        };

        if (this.isClickToHide() || this.isClickToShow()) {
            newChildProps.onClick = this.onClick.bind(this);
        }

        if (this.isMouseEnterToShow()) {
            newChildProps.onMouseEnter = this.onMouseEnter.bind(this);
        }

        if (this.isMouseLeaveToHide()) {
            newChildProps.onMouseLeave = this.onMouseLeave.bind(this);
        }

        return React.cloneElement(child, newChildProps);
    }
}

InnerTrigger.defaultProps = {
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0.1
};


export default InnerTrigger;
