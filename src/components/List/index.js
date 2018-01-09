import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Item from './Item';
import Spin from '../Spin';
const {SVGSpin} = Spin;

import './List.less';

class List extends React.Component {
    displayName = 'List';

    static defaultProps = {
        spinning: false
    };

    static propTypes = {
        head: PropTypes.any,
        data: PropTypes.any,
        actions: PropTypes.array,
        className: PropTypes.string,
        style: PropTypes.object,
        border: PropTypes.bool,
        spinning: PropTypes.bool,
        size: PropTypes.oneOf(['large', 'small'])
    };

    renderHead () {
        if (this.props.head) {
            return <div className='cm-list-head'>
                {this.props.head}
            </div>;
        }
        return null;
    }

    renderItems () {
        if (this.props.data) {
            return this.props.data.map((item) => {
                return <Item key={item.id} data={item} actions={this.props.actions}/>;
            });
        } else {
            return null;
        }
    }

    render () {
        const {className, style, border, size} = this.props;
        const clazzName = classNames('cm-list', className, {
            'cm-list-border': border,
            [`cm-list-${size}`]: size
        });
        return (
            <div className={clazzName} style={style}>
                {this.renderHead()}
                <SVGSpin spinning={this.props.spinning}>
                    {this.renderItems()}
                </SVGSpin>
            </div>
        );
    }
}
export default List;
