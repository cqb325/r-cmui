import React from 'react';
import Dom from '../utils/Dom';
import classNames from 'classnames';

import './SideMenu.less';

class SideMenu extends React.Component {
    displayName = 'SideMenu';

    static defaultProps = {
        width: 300,
        align: 'left',
        visibility: false
    }

    state = {
        visibility: this.props.visibility
    }

    onClick = (e) => {
        let ele = Dom.closest(e.target, '.cm-side-menu-back');
        
        if (ele) {
            this.close();
        }
    }

    close () {
        this.setState({
            visibility: false
        }, () => {
            if (this.props.onClose) {
                this.props.onClose();
            }
        });
    }

    open () {
        this.setState({
            visibility: true
        }, () => {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
        });
    }

    render () {
        let clazzName = classNames('cm-side-menu', this.props.align);
        let bodyClassName = classNames('cm-side-menu-body', {
            'cm-side-menu-body-show': this.state.visibility
        });
        let css = {
            width: this.props.width
        };
        if (this.props.align === 'left') {
            css.left = -this.props.width;
        }
        if (this.props.align === 'right') {
            css.right = -this.props.width;
        }
        return <div onClick={this.onClick} className={clazzName}>
            <div style={{
                display: this.state.visibility ? 'block' : 'none'
            }} className='cm-side-menu-back'>
            </div>
            <div style={css} className={bodyClassName}>
                {this.props.children}
            </div>
        </div>;
    }
}

export default SideMenu;
