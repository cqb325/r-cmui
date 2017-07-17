/**
 * @author cqb 2016-09-12.
 * @module Divider
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';


/**
 * Divider 类
 * @class Divider
 * @constructor
 * @extend BaseComponent
 */
class Divider extends BaseComponent {
    render(){
        let {style, className, theme} = this.props;
        className = classNames(className, 'cm-divider', theme);
        return (
            <hr style={style} className={className} />
        );
    }
}

Divider.defaultProps = {
    theme: 'default'
};

Divider.propTypes = {

};

export default Divider;
