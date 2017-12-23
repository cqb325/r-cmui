/**
 * @author cqb 2016-06-23.
 * @module MessageBox
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import Dom from '../utils/Dom';
import Panel from '../Panel/index';
import Button from '../Button/index';
import velocity from '../../lib/velocity';
import './MessageBox.less';

/**
 * MessageBox 类
 * @class MessageBox
 * @constructor
 * @extend BaseComponent
 */
class MessageBox extends BaseComponent {
    static displayName = 'MessageBox';

    static propTypes = {
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

    static defaultProps = {
        title: '',
        msg: '',
        visibility: false,
        type: 'info',
        confirmText: '确 定',
        cancelText: '取 消',
        confirmTheme: 'primary',
        cancelTheme: 'default',
        confirmIcon: 'check',
        cancelIcon: 'close',
        draggable: true
    };

    constructor (props) {
        super(props);

        this.addState({
            title: props.title,
            msg: props.msg,
            visibility: props.visibility
        });

        this.confirm = this.confirm.bind(this);
        this.cancle = this.cancle.bind(this);

        if (props.footers) {
            this.footers = props.footers;
        } else {
            const components = <span>
                <Button theme={props.confirmTheme} raised
                    icon={props.confirmIcon} onClick={this.confirm}>{props.confirmText}</Button>
                { props.type === 'confirm'
                    ? <Button theme={props.cancelTheme} raised icon={props.cancelIcon}
                        className='ml-10' onClick={this.cancle}>{props.cancelText}</Button>
                    : null
                }
            </span>;

            this.footers = components;
        }

        this.backdrop = null;

        // 保存的数据
        this.data = null;

        this.panel = null;
    }

    /**
     * 设置数据
     * @param {[type]} data [description]
     */
    setData (data) {
        this.data = data;
    }

    /**
     * 获取数据
     * @return {[type]} [description]
     */
    getData () {
        return this.data;
    }

    /**
     * 取消操作
     * @return {[type]} [description]
     */
    cancle () {
        if (this.props.type === 'confirm' && this.props.confirm) {
            this.props.confirm.apply(this, [false]);
            this.hide();
        } else {
            this.hide();
        }
    }

    /**
     * 隐藏
     * @return {[type]} [description]
     */
    hide () {
        velocity(this.container, 'fadeOut', { duration: 300 });

        if (this.props.onHide) {
            this.props.onHide();
        }
        this.emit('hide');

        let count = this.backdrop.getAttribute('data-count');
        count = count - 1;
        this.backdrop.setAttribute('data-count', count);
        if (count === 0) {
            this.backdrop.style.display = 'none';
        }
    }

    /**
     * 确认按钮回调
     * @return {[type]} [description]
     */
    confirm () {
        const confirm = this.props.confirm || (this.listeners('confirm').length ? this.listeners('confirm')[0] : null);
        if (confirm) {
            if (this.props.type === 'confirm') {
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

    /**
     * 显示
     * @param  {[type]} msg   [description]
     * @param  {[type]} title [description]
     * @return {[type]}       [description]
     */
    show (msg, title) {
        this.panel.setTitleAndContent(this.state.title || title, this.state.msg || msg);

        if (!this.backdrop) {
            const ele = Dom.query('.shadow-backdrop');
            if (ele) {
                this.backdrop = ele;
            } else {
                this.backdrop = document.createElement('div');
                this.backdrop.setAttribute('class', 'shadow-backdrop');
                document.body.appendChild(this.backdrop);
            }
        }

        this.backdrop.style.display = 'block';
        let count = this.backdrop.getAttribute('data-count');
        count = count == null ? 1 : parseInt(count, 10) + 1;
        this.backdrop.setAttribute('data-count', count);

        window.setTimeout(() => {
            const ele = ReactDOM.findDOMNode(this.panel);
            Dom.dom(this.container).show();

            const w = ele.clientWidth;
            const h = ele.clientHeight;
            ele.style.marginLeft = `${-w / 2}px`;
            ele.style.marginTop = `${-h / 2}px`;
            Dom.dom(this.container).show();
            velocity(this.container, 'fadeIn', { duration: 300 });

            if (this.props.onShow) {
                this.props.onShow();
            }
            this.emit('show');
        }, 0);
    }

    componentDidMount () {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        Dom.dom(this.container).addClass('cm-popup-warp');
        Dom.dom(this.container).hide();

        let {className, style} = this.props;
        className = classNames('cm-messageBox', className, `cm-messageBox-${this.props.type}`);
        const props = Object.assign({}, this.props);
        props.className = className;

        props.footers = this.footers;
        style = Object.assign({}, style);
        props.style = style;

        ReactDOM.render(<Panel ref={(ref) => { this.panel = ref; }} {...props}
            content={this.state.msg} />, this.container);
    }

    render () {
        return (
            <div />
        );
    }
}

export default MessageBox;
