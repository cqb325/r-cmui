import React from 'react';
import ResizeContent from './ResizeContent';
import FontIcon from '../FontIcon';
import classNames from 'classnames';

import './CloseableContent.less';

class CloseableContent extends React.Component {
    displayName = 'CloseableContent';

    static defaultProps = {
        hiddenSize: 37,
        minHeight: 50,
        minWidth: 50,
        open: true,
        closeable: true
    }

    state = {
        open: this.props.open || true
    }

    toggle (content) {
        if (this.state.open) {
            content.close();
        } else {
            content.open();
        }
    }

    onClose = () => {
        this.setState({
            open: false
        }, () => {
            if (this.props.onClose) {
                this.props.onClose();
            }
        });
    }

    onOpen = () => {
        this.setState({
            open: true
        }, () => {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
        });
    }

    /**
     * 打开
     */
    open = () => {
        this.panel.open();
    }

    /**
     * 关闭
     */
    close = () => {
        this.panel.close();
    }

    renderHead = (content) => {
        if (this.props.closeable) {
            let className = this.state.open ? 'angle-double-left' : 'angle-double-right';
            const {align} = this.props;
            let angle = align;
            angle = angle === 'top' ? 'up' : angle;
            angle = angle === 'bottom' ? 'down' : angle;
            const kv = {
                'left': 'right',
                'right': 'left',
                'up': 'down',
                'down': 'up'
            };
            className = this.state.open ? `angle-double-${kv[angle]}` : `angle-double-${angle}`;

            const tip = this.state.open ? '关闭' : '打开';
            return <div className='cm-resize-content-header-wrap'>
                {
                    align === 'left' 
                        ? [<FontIcon key='1' icon={className} title={tip} onClick={this.toggle.bind(this, content)}/>,
                            <div key='2' className='cm-resize-content-header-title'>{this.props.title}</div>]
                        : [<div key='3' className='cm-resize-content-header-title'>{this.props.title}</div>,
                            <FontIcon key='4' icon={className} title={tip} onClick={this.toggle.bind(this, content)}/>]
                }
            </div>;
        } else {
            return null;
        }
    }

    render () {
        const newProps = Object.assign({}, this.props);
        const className = classNames(this.props.className, {
            'cm-resize-content-disable-close': !this.props.closeable
        });
        delete newProps['title'];
        delete newProps['className'];
        return <ResizeContent 
            ref={(f) => this.panel = f }
            className={className}
            onClose={this.onClose}
            onOpen={this.onOpen}
            {...newProps}
            renderHead={this.renderHead}
        >{this.props.children}</ResizeContent>;
    }
}

export default CloseableContent;
