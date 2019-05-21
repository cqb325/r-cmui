import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Dom from '../utils/Dom';
import Events from '../utils/Events';

import './ContextMenu.less';

class ContextMenu extends React.Component {
    displayName = 'ContextMenu';

    static defaultProps = {
        target: 'body'
    };

    static propTypes = {
        onSelect: PropTypes.func,
        overlay: PropTypes.element
    };

    onSelect = (outerOnSelect, item) => {
        this.hideMenu();
        if (outerOnSelect) {
            outerOnSelect(item, this.target);
        }
        if (this.props.onSelect) {
            this.props.onSelect(item, this.target);
        }
    }

    onClick = (event) => {
        const target = Dom.closest(event.target, '.cm-menu');
        if (target) {
            return false;
        } else {
            this.hideMenu();
        }
    }

    componentWillUnmount () {
        if (!this.props.children) {
            Events.off(document, 'contextmenu', this.onContextMenu);
        }
        Events.off(document, 'mousewheel', this.onScroll);
        Events.off(document, 'click', this.onClick);
    }

    componentDidMount () {
        if (!this.props.children) {
            Events.on(document, 'contextmenu', this.onContextMenu);
        }
        Events.on(document, 'mousewheel', this.onScroll);
        Events.on(document, 'click', this.onClick);

        const wrap = document.createElement('div');
        document.body.appendChild(wrap);
        const overlay = this.props.overlay;
        if (overlay) {
            const props = Object.assign({
            }, overlay.props, {
                onSelect: this.onSelect.bind(this, overlay.props.onSelect),
                storeClickState: false,
                ref: this.saveRef,
                className: 'cm-contextmenu'
            });
            ReactDOM.render(React.cloneElement(overlay, props), wrap);
        }
    }

    saveRef = (f) => {
        this.overlay = f;
    }

    onScroll = (event) => {
        const target = Dom.closest(event.target, '.cm-contextmenu');
        if (target) {
            return false;
        } else {
            this.hideMenu();
        }
    }

    onContextMenu = (event) => {
        if (this.props.children) {
            event.preventDefault();
            this.showMenu(event);
        } else {
            const target = Dom.closest(event.target, this.props.target);
            if (target) {
                event.preventDefault();
                this.showMenu(event);
            } else {
                const menu = Dom.closest(event.target, '.cm-contextmenu');
                // on Menu
                if (menu) {
                    return false;
                } else {
                    this.hideMenu();
                }
            }
        }
    }

    getTrigger () {
        return this.target;
    }

    showMenu (event) {
        const x = event.clientX;
        const y = event.clientY;
        if (this.overlay) {
            const ele = ReactDOM.findDOMNode(this.overlay);
            Dom.dom(ele).addClass('cm-contextmenu-visible');
            ele.style.position = 'fixed';
            ele.style.left = `${x}px`;
            ele.style.top = `${y}px`;

            this.target = event.target;
        }
    }

    hideMenu () {
        if (this.overlay) {
            const ele = ReactDOM.findDOMNode(this.overlay);
            Dom.dom(ele).removeClass('cm-contextmenu-visible');
        }
    }

    renderChildren () {
        if (this.props.children) {
            const child = React.Children.only(this.props.children);
            const newChildProps = Object.assign({
                onContextMenu: this.onContextMenu
            }, child.props);

            return React.cloneElement(child, newChildProps);
        } else {
            return null;
        }
    }

    render () {
        return (
            <div className='cm-context-menu-helper'>
                {this.renderChildren()}
            </div>
        );
    }
}
export default ContextMenu;
