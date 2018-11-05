import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FontIcon from '../FontIcon';

class Item extends React.Component {
    displayName = 'Item';

    static contextTypes = {
        layout: PropTypes.string,
        tip: PropTypes.bool,
        bindKey: PropTypes.func,
        onSelectItem: PropTypes.func
    }

    onClick = () => {
        const {data} = this.props;
        if (data.disabled) {
            return false;
        }

        this.select(data.id);
    }

    select (key) {
        this.context.onSelectItem(key);
    }

    componentDidMount () {
        const {data} = this.props;
        this.context.bindKey(data.id, this, 'item');
    }

    render () {
        const {data} = this.props;
        data.id = data.identify || data.id;
        const clazzName = classNames(data.className, 'cm-menu-item', {
            'cm-menu-item-active': data.active,
            'cm-menu-disabled': data.disabled
        });

        const paddingLeft = this.context.layout === 'inline' ? 24 * data.level : 0;
        const style = paddingLeft ? {paddingLeft} : null;
        Object.assign(style || {}, data.style || {});
        let cont = data.text;
        if (data.format && typeof data.format === 'function') {
            cont = data.format(data);
        }
        return (
            <li className={clazzName}
                onClick={this.onClick}
                style={style}
                title={this.context.tip ? cont : null}
            >
                {data.icon ? <FontIcon icon={data.icon} /> : null}
                <a className='cm-menu-item-text' href={this.props.link || 'javascript:void(0)'}>{cont}</a>
            </li>
        );
    }
}

export default Item;
