/**
 * @author cqb 2016-06-23.
 * @module MessageBox
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import Dom from './utils/Dom';
import Panel from './Panel';
import Button from './Button';
import velocity from 'velocity';

/**
 * MessageBox 类
 * @class MessageBox
 * @constructor
 * @extend BaseComponent
 */
class MessageBox extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            title: props.title || '',
            msg: props.msg || '',
            visibility: false,
            type: props.type || 'info'
        });

        let confirmText = props.confirmText || '确 定';
        let cancelText = props.cancelText || '取 消';

        let confirmTheme = props.confirmTheme || 'primary';
        let cancelTheme = props.cancelTheme || 'default';

        let confirmIcon = props.confirmIcon || 'check';
        let cancelIcon = props.cancelIcon || 'close';

        if (props.footers) {
            this.footers = props.footers;
        } else {
            this.confirm = this.confirm.bind(this);
            this.cancle = this.cancle.bind(this);

            let components = [<Button theme={confirmTheme} raised
                icon={confirmIcon} onClick={this.confirm}>{confirmText}</Button>];
            if (props.type === 'confirm') {
                components.push(<Button theme={cancelTheme} raised icon={cancelIcon}
                    className='ml-10' onClick={this.cancle}>{cancelText}</Button>);
            }
            this.footers = {
                components: components
            };
        }

        this.backdrop = null;

        // 保存的数据
        this.data = null;

        this.panel = null;
    }

    setData(data){
        this.data = data;
    }

    getData(){
        return this.data;
    }

    cancle(){
        if (this.state.type === 'confirm' && this.props.confirm) {
            this.props.confirm.apply(this, [false]);
            this.hide();
        } else {
            this.hide();
        }
    }

    hide(){
        velocity(this.container, 'fadeOut', { duration: 300 });

        if (this.props.onHide) {
            this.props.onHide();
        }
        this.emit('hide');
        this.backdrop.style.display = 'none';
    }

    confirm(){
        let confirm = this.props.confirm || (this.listeners('confirm').length ? this.listeners('confirm')[0] : null);
        if (confirm) {
            if (this.state.type === 'confirm') {
                if (confirm.apply(this, [true])) {
                    this.hide();
                }
            } else {
                confirm.apply(this, []);
                this.hide();
            }
        } else {
            this.hide();
        }
    }

    show(msg, title){
        // this.setState({
        //     title: this.state.title || title,
        //     msg: msg,
        //     visibility: true
        // });

        this.panel.setTitleAndContent(this.state.title || title, this.state.msg || msg);

        if (!this.backdrop) {
            let ele = Dom.query('.shadow-backdrop');
            if (ele) {
                this.backdrop = ele;
            } else {
                this.backdrop = document.createElement('div');
                this.backdrop.setAttribute('class', 'shadow-backdrop');
                document.body.appendChild(this.backdrop);
            }
        }

        this.backdrop.style.display = 'block';

        window.setTimeout(()=>{
            let ele = ReactDOM.findDOMNode(this.panel);
            Dom.dom(this.container).show();

            let w = ele.clientWidth;
            let h = ele.clientHeight;
            ele.style.marginLeft = -w / 2 + 'px';
            ele.style.marginTop = -h / 2 + 'px';
            Dom.dom(this.container).show();
            velocity(this.container, 'fadeIn', { duration: 300 });

            if (this.props.onShow) {
                this.props.onShow();
            }
            this.emit('show');
        }, 0);
    }

    componentDidMount(){
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        Dom.dom(this.container).addClass('cm-popup-warp');
        Dom.dom(this.container).hide();

        let {className, style} = this.props;
        className = classNames('cm-messageBox', className, this.state.type);
        let props = Object.assign({}, this.props);
        props.className = className;

        props.footers = this.footers;
        style = Object.assign({}, style);
        props.style = style;

        window.setTimeout(()=>{
            ReactDOM.render(<Panel ref={(ref)=>{ this.panel = ref; }} {...props}
                content={this.state.msg} />, this.container);
        }, 0);
    }

    render(){
        return (
            <div />
        );
    }
}

MessageBox.propTypes = {
    /**
     * 标题
     * @attribute title
     * @type {String}
     */
    title: PropTypes.string,
    /**
     * 信息
     * @attribute msg
     * @type {String}
     */
    msg: PropTypes.string,
    /**
     * 类型
     * @attribute type
     * @type {String}
     */
    type: PropTypes.oneOf(['info', 'confirm', 'error', 'warning']),
    /**
     * 自定义class
     * @attribute className
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * 自定义样式
     * @attribute style
     * @type {Object}
     */
    style: PropTypes.object
};

export default MessageBox;
