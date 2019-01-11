import React from 'react';
import Dom from '../../src/components/utils/Dom';
import Button from '../../src/components/Button';
import classNames from 'classnames';

import './style.less';

class Comp extends React.Component {
    displayName = 'Comp';

    static defaultProps = {
        width: 300,
        align: 'left'
    }

    state = {
        visibility: true
    }

    onClick = (e) => {
        let ele = Dom.closest(e.target, '.cm-side-menu-back');
        
        if (ele) {
            this.setState({
                visibility: false
            });
        }
    }

    close () {
        this.setState({
            visibility: false
        });
    }

    open () {
        this.setState({
            visibility: true
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
        if (this.props.align === 'align') {
            css.right = -this.props.width;
        }
        return <div>
            <div onClick={this.onClick} className={clazzName}>
                <div style={{
                    display: this.state.visibility ? 'block' : 'none'
                }} className='cm-side-menu-back'>
                </div>
                <div style={{width: this.props.width, left: -this.props.width}}
                    className={bodyClassName}>
                    <Button onClick={this.close.bind(this)}>关闭</Button>
                </div>
            </div>

            <div className='pull-right'>
                asdsadasdasdasd
                <div>
                    <Button onClick={this.open.bind(this)}>打开</Button>
                </div>
            </div>
        </div>;
    }
}

export default Comp;
