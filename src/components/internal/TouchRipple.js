/**
 * @author cqb 2016-04-17.
 * @module TouchRipple
 */
import React from 'react';
import PropTypes from 'prop-types';
const Component = React.PureComponent;

import './TouchRipple.less';

/**
 * TouchRipple 类
 * @class TouchRipple
 * @extend Component
 */
class TouchRipple extends Component {
    displayName = 'TouchRipple';

    static propTypes = {
        centerRipple: PropTypes.bool,
        children: PropTypes.node,
        color: PropTypes.string,
        opacity: PropTypes.number,
        style: PropTypes.object
    };

    constructor (props, context) {
        super(props, context);

        this.state = {
            hasRipples: false
        };
    }

    render () {
        const {children, style} = this.props;
        const {hasRipples} = this.state;

        const mergedStyles = Object.assign({
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            overflow: 'hidden'
        }, style);

        return (
            <div
                style={style}
            >
                <span style={mergedStyles} tabIndex={0} className='cm-touch-ripple'></span>
                {children}
            </div>
        );
    }
}

export default TouchRipple;
