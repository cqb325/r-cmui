import React from 'react';
import BaseComponent from '../core/BaseComponent';
import classNames from 'classnames';

class Item extends BaseComponent {
    constructor (props) {
        super(props);

        this.identify = props.identify || `Item_level_${ 
            props.parent.identify ? props.parent.identify : ''}_${props.index}`;

        this.addState({
            active: props.select || false,
            layout: this.props.layout
        });
        this.name = 'Item';
    }

    /**
     * 点击
     * @returns {boolean}
     */
    onClick () {
        if (this.props.disabled) {
            return false;
        }

        if (this.props.onClick) {
            this.props.onClick(this);
        }
        this.emit('click', this);

        const root = this.props.root;
        if (root.lastSelect && root.lastSelect != this) {
            root.lastSelect.unSelect();
        }
        this.select();
    }

    /**
     * 选择
     */
    select () {
        if (this._isMounted) {
            this.setState({active: true});
        }
        const root = this.props.root;
        root.lastSelect = this;

        if (this.props.layout !== 'inline') {
            let parent = this.props.parent;
            root.unSelectSubMenus();
            while (parent.name !== 'Menu') {
                if (parent.name === 'SubMenu') {
                    parent.collapse(true);
                    parent.setSelectStatus(true);
                }
                parent = parent.props.parent;
            }
        }

        if (this.props.onSelect) {
            this.props.onSelect(this);
        }

        this.emit('select', this);
    }

    unSelect () {
        if (this._isMounted) {
            this.setState({active: false});
        }
        const root = this.props.root;
        root.lastSelect = null;
        if (root.unSelect) {
            root.unSelect(this);
        }
    }

    getKey () {
        return this.identify;
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

    setLayout (layout) {
        this.setState({layout});
    }

    render () {
        const className = classNames(this.props.className, `${this.props.prefix}-item`, {
            [`${this.props.prefix}-item-active`]: this.state.active,
            [`${this.props.prefix}-disabled`]: this.props.disabled
        });

        const paddingLeft = this.state.layout === 'inline' ? 24 * this.props.level : 0;
        const style = paddingLeft ? {paddingLeft} : null;
        return (
            <li className={className}
                onClick={this.onClick.bind(this)}
                style={style}
            >
                <a href={this.props.link || 'javascript:void(0)'}>{this.props.children}</a>
            </li>
        );
    }
}

export default Item;
