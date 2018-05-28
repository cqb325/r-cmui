import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import velocity from '../../lib/velocity';
import Dom from '../utils/Dom';
import BaseComponent from '../core/BaseComponent';

class SubMenu extends BaseComponent {
    static displayName = 'SubMenu';

    constructor (props) {
        super(props);

        this.addState({
            hover: false,
            collapsed: !props.open || false,
            layout: this.props.layout,
            selected: false
        });

        this.identify = props.identify || `SubMenu_level_${ 
            props.parent.identify ? props.parent.identify : ''}_${props.index}`;
        this.children = [];
        this.name = 'SubMenu';

        this.isAnimating = false;
    }

    setLayout (layout) {
        this.setState({layout});
    }

    /**
     * 设置选择状态
     * @param {*} selected 
     */
    setSelectStatus (selected) {
        this.setState({selected});
        if (selected) {
            const root = this.props.root;
            root.selectedSubMenus.push(this.identify);
        }
    }

    appendChild (item) {
        this.children.push(item);
    }

    renderChildren () {
        const cildren = this.props.children;
        return React.Children.map(cildren, (child, index) => {
            if (child) {
                let props = child.props;
                props = Object.assign({}, props, {
                    onSelect: this.props.onSelect,
                    onClick: this.props.onClick,
                    parent: this,
                    root: this.props.root,
                    prefix: this.props.prefix,
                    index,
                    level: this.props.level + 1,
                    layout: this.state.layout
                });
                return React.cloneElement(child, props);
            } else {
                return null;
            }
        });
    }

    onMouseOver () {
        if (this.props.disabled) {
            return false;
        }
        this.setState({hover: true});
    }

    onMouseOut () {
        if (this.props.disabled) {
            return false;
        }
        this.setState({hover: false});
    }

    onMouseLeave () {
        if (this.props.disabled) {
            return false;
        }
        if (this.state.layout === 'vertical' || this.state.layout === 'horizontal') {
            this.collapse(true);
        }
    }

    onMouseEnter () {
        if (this.props.disabled) {
            return false;
        }
        if (this.state.layout === 'vertical' || this.state.layout === 'horizontal') {
            this.collapse(false);
        }
    }

    onClick (event, called, collapse) {
        if (this.props.disabled) {
            return false;
        }
        if (this.state.layout === 'horizontal' || this.state.layout === 'vertical') {
            return false;
        }

        const root = this.props.root;
        const openKeys = root.getOpenKeys();
        if (root.getModal() === 'single') {
            if (!openKeys[this.identify]) {
                if (!this.lastOpenIsOffsetParent()) {
                    root.collapse(root.lastOpenKey, true);
                }
            }
        }

        if (!called && this.props.onClick) {
            this.props.onClick(this);
        }

        if (this.state.collapsed) {
            this.collapse(false);
        } else {
            this.collapse(true);
        }
    }

    lastOpenIsOffsetParent () {
        let parent = this.props.parent;
        const root = this.props.root;
        while (parent) {
            if (parent.identify === root.lastOpenKey) {
                return true;
            }

            parent = parent.props.parent;
        }

        return false;
    }

    /**
     * 是否打开的状态
     * @returns {boolean}
     */
    isOpen () {
        return !this.state.collapsed;
    }

    /**
     * 折叠打开
     * @param collapsed
     */
    collapse (collapsed) {
        if (this.isAnimating) {
            return false;
        }
        const subMenu = Dom.dom(ReactDOM.findDOMNode(this.refs.subMenu));
        const parent = this.props.root;
        const openKeys = parent.getOpenKeys();
        this.isAnimating = true;
        if (collapsed) {
            if (this.state.layout === 'inline') {
                velocity(subMenu[0], 'slideUp', {
                    duration: 300,
                    complete: () => {
                        this.isAnimating = false;
                    }
                });
            } else {
                this.isAnimating = false;
            }

            if (this.props.onCollapse) {
                this.props.onCollapse(this);
            }

            if (parent.getModal() === 'single') {
                // 当前打开的是自身
                if (openKeys[this.identify]) {
                    if (this.props.parent.name !== 'Menu') {
                        let p = this.props.parent;
                        if (p.name === 'MenuItemGroup') {
                            p = p.props.parent;
                        }
                        parent.lastOpenKey = p.identify;
                    } else {
                        parent.lastOpenKey = null;
                    }
                }
                delete openKeys[this.identify];
            } else {
                delete openKeys[this.identify];
            }
        } else {
            if (this.state.layout === 'inline') {
                velocity(subMenu[0], 'slideDown', {
                    duration: 300,
                    complete: () => {
                        this.isAnimating = false;
                    }
                });
            } else {
                this.isAnimating = false;
            }

            if (this.props.onOpen) {
                this.props.onOpen(this);
            }

            if (parent.getModal() === 'single') {
                parent.lastOpenKey = this.identify;
                openKeys[this.identify] = true;
            } else {
                openKeys[this.identify] = true;
            }
        }
        window.setTimeout(() => {
            if (this._isMounted) {
                this.setState({
                    collapsed
                });
            }
        }, 0);
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    componentDidMount () {
        this._isMounted = true;
        const root = this.props.root;
        root.bindKey(this.identify, this);

        this.props.parent.appendChild(this);
    }

    render () {
        const className = classNames(`${this.props.prefix}-submenu-title`, {
            [`${this.props.prefix}-submenu-title-hover`]: this.state.hover,
            [`${this.props.prefix}-disabled`]: this.props.disabled,
            [`${this.props.prefix}-submenu-selected`]: this.state.selected
        });

        const className2 = classNames(`${this.props.prefix}-submenu`, {
            [`${this.props.prefix}-submenu-active`]: !this.state.collapsed
        });

        const paddingLeft = this.state.layout === 'inline' ? 24 * this.props.level : 0;
        const style = paddingLeft ? {paddingLeft} : null;
        const display = this.state.layout !== 'inline' ? '' : this.props.open ? 'block' : 'none';
        return (
            <li className={className2}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
            >
                <div className={className}
                    onMouseOver={this.onMouseOver.bind(this)}
                    onMouseOut={this.onMouseOut.bind(this)}
                    onClick={this.onClick.bind(this)}
                    style={style}
                >
                    <span>
                        {this.props.title}
                    </span>
                </div>
                <ul ref='subMenu' className={`${this.props.prefix}-sub ${this.props.prefix}`}
                    style={{display}}>
                    {this.renderChildren()}
                </ul>
            </li>
        );
    }
}

export default SubMenu;
