import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class Comp extends React.Component {
    displayName = 'Comp';

    static propTypes = {
        data: PropTypes.object,
        actions: PropTypes.array,
        className: PropTypes.string,
        style: PropTypes.object
    };

    renderActions () {
        if (!this.props.actions) {
            return null;
        }
        return this.props.actions.map((action) => {
            const props = action.props;
            const newProps = Object.assign({}, props);
            const func = newProps.onClick;
            if (func) {
                newProps.onClick = func.bind(this, this.props.data);
            }
            return React.cloneElement(action, newProps);
        });
    }

    render () {
        const {className, style, data} = this.props;
        const clazzName = classNames('cm-list-item', className);
        return (
            <div className={clazzName} style={style}>
                <div className='cm-list-item-main'>
                    {data.avatar ? <div className='cm-list-item-avatar'>{data.avatar}</div> : null}
                    {data.content ? <div className='cm-list-item-content'>{data.content}</div> : null}
                </div>
                <div className='cm-list-item-desc'>
                    {data.desc}
                </div>
                {this.props.actions ? <ul className='cm-list-item-action'>
                    {this.renderActions()}
                </ul> : null}
            </div>
        );
    }
}
export default Comp;
