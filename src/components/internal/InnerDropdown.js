/**
 * @author cqb 2017-01-13.
 * @module InnerDropdown
 */

import React from 'react';
import ReactDOM from 'react-dom';

import velocity from '../../lib/velocity';
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
class InnerDropdown extends React.PureComponent {
    displayName = 'InnerDropdown';

    constructor (props) {
        super(props);

        let popupVisible;
        if ('popupVisible' in props) {
            popupVisible = !!props.popupVisible;
        } else {
            popupVisible = false;
        }

        this.state = {
            popupVisible
        };

        this.overlay = props.overlay;
        this.overlaySelect = (this.overlay && this.overlay.onSelect) ? this.overlay.onSelect : function () {};
    }

    isClickToShow () {
        const {action} = this.props;
        return action.indexOf('click') !== -1;
    }

    isClickToHide () {
        const { action } = this.props;
        return action.indexOf('click') !== -1;
    }

    isMouseEnterToShow () {
        const { action } = this.props;
        return action.indexOf('hover') !== -1;
    }

    isMouseLeaveToHide () {
        const { action } = this.props;
        return action.indexOf('hover') !== -1;
    }

    onClick () {
        const nextVisible = !this.state.popupVisible;
        if (this.isClickToHide() && !nextVisible || nextVisible && this.isClickToShow()) {
            this.setPopupVisible(!this.state.popupVisible);
        }
    }

    onDocumentClick (event) {
        const target = event.target || event.srcElement;
        const triggerEle = ReactDOM.findDOMNode(this);
        const overlayEle = ReactDOM.findDOMNode(this.popupRef);
        if (target !== triggerEle && !isDescendant(triggerEle, target)
            && target !== overlayEle && !isDescendant(overlayEle, target)) {
            this.setPopupVisible(false);
        }
        return false;
    }

    onMouseEnter () {
        if (!this.state.popupVisible) {
            this.delaySetPopupVisible(true, this.props.mouseEnterDelay);
        }
    }

    onMouseLeave () {

    }

    onDocumentMove (event) {
        if (!this.state.popupVisible) {
            return true;
        }
        const target = event.target || event.srcElement;
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = window.setTimeout(() => {
            const triggerEle = ReactDOM.findDOMNode(this);
            const overlayEle = ReactDOM.findDOMNode(this.popupRef);
            if (target !== triggerEle && !isDescendant(triggerEle, target)
                && target !== overlayEle && !isDescendant(overlayEle, target)) {
                this.setPopupVisible(false);
            }
        }, this.props.mouseLeaveDelay * 1000);
    }

    onSelect (item) {
        this.delaySetPopupVisible(false, this.props.mouseLeaveDelay);
        if (this.overlaySelect) {
            this.overlaySelect(item);
        }
    }

    setPopupVisible (popupVisible) {
        if (this._isMounted) {
            this.setState({popupVisible});
            this.popupRef.update(popupVisible);
        }
    }

    delaySetPopupVisible (popupVisible, delay) {
        window.setTimeout(() => {
            if (this._isMounted) {
                if (!this.state.isEmpty) {
                    this.setState({popupVisible});
                    this.popupRef.update(popupVisible);
                }
            }
        }, delay * 1000);
    }


    componentWillUnmount () {
        this._isMounted = false;
        const p = this.container.parentNode;
        p.removeChild(this.container);

        const target = ReactDOM.findDOMNode(this);
        Events.off(target, 'click', this.onClick);
        Events.off(document, 'click', this.onClick);
        Events.off(target, 'mouseenter', this.onMouseEnter);
        Events.off(target, 'mouseleave', this.onMouseLeave);
        Events.off(document, 'mousemove', this.onDocumentMove);
    }


    onVisibleChange (visible) {
        const tip = ReactDOM.findDOMNode(this.popupRef);
        if (!visible) {
            velocity(tip, 'slideUp', {duration: 300});
        } else {
            velocity(tip, 'slideDown', {duration: 300});
        }
        if (this.props.onVisibleChange) {
            this.props.onVisibleChange();
        }
    }

    componentDidMount () {
        this._isMounted = true;
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        const baseEle = ReactDOM.findDOMNode(this);

        const props = {
            align: this.props.align,
            baseEle,
            visible: this.state.popupVisible,
            extraProps: this.props.extraProps,
            delay: this.props.delay,
            onVisibleChange: this.onVisibleChange.bind(this)
        };

        let newOverlay = null;
        if (this.overlay) {
            let overlayProps = null;
            const type = this.overlay.type;
            const compName = type && type.displayName ? type.displayName : '';
            if (compName === 'Menu') {
                overlayProps = Object.assign({
                    onSelect: this.onSelect.bind(this),
                    prefix: 'cm-dropdown-menu',
                    startIndex: 0
                }, this.overlay.props : {});
            } else {
                overlayProps = this.overlay.props;
            }

            newOverlay = React.cloneElement(this.overlay, overlayProps);
        } else {
            newOverlay = <span />;
        }
        window.setTimeout(() => {
            ReactDOM.render(<Popup ref={(ref) => { this.popupRef = ref; }} {...props}>
                {newOverlay}
            </Popup>, this.container);
        }, 0);

        if (this.isClickToHide() || this.isClickToShow()) {
            Events.on(document, 'click', this.onDocumentClick.bind(this));
        }

        if (this.isMouseLeaveToHide()) {
            Events.on(document, 'mousemove', this.onDocumentMove.bind(this));
        }
    }

    render () {
        const props = this.props;
        const children = props.children;
        const child = React.Children.only(children);
        const newChildProps = {};

        if (this.isClickToHide() || this.isClickToShow()) {
            newChildProps.onClick = this.onClick.bind(this);
        }

        if (this.isMouseEnterToShow()) {
            newChildProps.onMouseEnter = this.onMouseEnter.bind(this);
        }

        if (this.isMouseLeaveToHide()) {
            // newChildProps.onMouseLeave = this.onMouseLeave.bind(this);
        }

        return React.cloneElement(child, newChildProps);
    }
}

InnerDropdown.defaultProps = {
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0.2
};


export default InnerDropdown;
