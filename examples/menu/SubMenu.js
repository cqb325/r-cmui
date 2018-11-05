import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Group from './Group';
import Item from './Item';
import Divider from './Divider';
import FontIcon from '../../src/components/FontIcon';

class SubMenu extends React.Component {
    displayName = 'SubMenu';

    static contextTypes = {
        layout: PropTypes.string,
        tip: PropTypes.bool,
        bindKey: PropTypes.func,
        min: PropTypes.bool,
        onSelectSubMenu: PropTypes.func
    }

    state = {
        hover: false
    }

    renderChildren (data) {
        if (!data.children) {
            return null;
        }
        return data.children.map(item => {
            if (item.children && item.children.length && item.group) {
                return <Group data={item} key={item.id}/>;
            }
            if (item.children && item.children.length) {
                return <SubMenu data={item} key={item.id}/>;
            }
            if (item.divider) {
                return <Divider data={item} key={item.id}/>;
            }
            if (!item.children) {
                return <Item data={item} key={item.id}/>;
            }
            return null;
        });
    }

    onClick = () => {
        const {data} = this.props;
        if (data.disabled) {
            return false;
        }
        console.log(this.context.min);
        if (this.context.layout === 'inline' && !this.context.min) {
            this.context.onSelectSubMenu(data.id);
        }
    }

    onMouseOver () {
        const {data} = this.props;
        if (data.disabled) {
            return false;
        }
        this.setState({hover: true});
    }

    onMouseOut () {
        const {data} = this.props;
        if (data.disabled) {
            return false;
        }
        this.setState({hover: false});
    }

    onMouseEnter = () => {
        if (this.props.disabled) {
            return false;
        }
        const {data} = this.props;
        console.log(this.context.layout, this.context.layout === 'vertical');
        if (this.context.layout === 'vertical' || this.context.layout === 'horizontal' || this.context.min) {
            this.context.onSelectSubMenu(data.id);
        }
    }

    onMouseLeave = () => {
        if (this.props.disabled) {
            return false;
        }
        const {data} = this.props;
        if (this.context.layout === 'vertical' || this.context.layout === 'horizontal' || this.context.min) {
            this.context.onSelectSubMenu(data.id);
        }
    }

    componentDidMount () {
        const {data} = this.props;
        this.context.bindKey(data.id, this, 'submenu');
    }

    render () {
        const {data} = this.props;
        const className = classNames('cm-menu-submenu-title', {
            'cm-menu-submenu-title-hover': this.state.hover,
            'cm-menu-disabled': data.disabled
        });
        const className2 = classNames('cm-menu-submenu', {
            'cm-menu-submenu-active': data.open
        });
        const paddingLeft = this.context.layout === 'inline' ? 24 * data.level : 0;
        const style = paddingLeft ? {paddingLeft} : null;
        const display = this.context.layout !== 'inline' ? '' : data.open ? 'block' : 'none';
        let cont = data.text;
        if (data.format && typeof data.format === 'function') {
            cont = data.format(data);
        }
        return <li className={className2}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
        >
            <div className={className}
                style={style}
                onMouseOver={this.onMouseOver.bind(this)}
                onMouseOut={this.onMouseOut.bind(this)}
                onClick={this.onClick}
                title={this.context.tip ? cont : null}
            >
                {data.icon ? <FontIcon icon={data.icon} /> : null}
                <span className='cm-menu-submenu-text'>{cont}</span>
            </div>
            <ul className={'cm-menu-sub cm-menu'} style={{display}}>
                {this.renderChildren(data)}
            </ul>
        </li>;
    }
}

export default SubMenu;
