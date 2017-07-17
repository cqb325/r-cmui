/**
 * @author cqb 2017-01-16.
 * @module Layout
 */

import React from 'react';
import classNames from 'classnames';


/**
 * Basic 类
 * @class Basic
 * @constructor
 * @extend React.Component
 */
class Basic extends React.Component {
    render(){
        let {prefixCls, className, children, name} = this.props;
        let hasSider;
        if (name === 'Layout') {
            React.Children.forEach(children, (child) => {
                if (child && child.props && child.props.name === 'Sider') {
                    hasSider = true;
                }
            });
        }

        className = classNames(className, prefixCls, {
            [`${prefixCls}-has-sider`]: hasSider
        });
        return (
            <div className={className}>{children}</div>
        );
    }
}

/**
 * Layout 类
 * 布局对象
 * @class Layout
 * @constructor
 * @extend React.Component
 */
class Layout extends React.Component {
    render(){
        return <Basic prefixCls='cm-layout' name='Layout' {...this.props} />;
    }
}

/**
 * Header 类
 * 布局对象
 * @class Header
 * @constructor
 * @extend React.Component
 */
class Header extends React.Component {
    render(){
        return <Basic prefixCls='cm-layout-header' name='Header' {...this.props} />;
    }
}

/**
 * Footer 类
 * 布局对象
 * @class Footer
 * @constructor
 * @extend React.Component
 */
class Footer extends React.Component {
    render(){
        return <Basic prefixCls='cm-layout-footer' name='Footer' {...this.props} />;
    }
}

/**
 * Content 类
 * 布局对象
 * @class Content
 * @constructor
 * @extend React.Component
 */
class Content extends React.Component {
    render(){
        return <Basic prefixCls='cm-layout-content' name='Content' {...this.props} />;
    }
}

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;

export default Layout;
