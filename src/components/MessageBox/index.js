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
        title: PropTypes.any,
        /**
         * 信息
         * @attribute msg
         * @type {String}
         */
        msg: PropTypes.any,
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
        title: window.RCMUI_I18N['MessageBox.title'],
        msg: '',
        visibility: false,
        type: 'info',
        confirmText: window.RCMUI_I18N['MessageBox.confirmText'],
        cancelText: window.RCMUI_I18N['MessageBox.cancelText'],
        confirmTheme: 'primary',
        cancelTheme: 'default',
        confirmIcon: 'check',
        cancelIcon: 'close',
        draggable: true,
        loading: false
    };

    constructor (props) {
        super(props);

        this.addState({
            title: props.title,
            msg: props.msg,
            visibility: props.visibility,
            loading: props.loading
        });

        this.confirm = this.confirm.bind(this);
        this.cancle = this.cancle.bind(this);

        if (props.footers) {
            this.footers = props.footers;
        } else {
            const components = <span>
                <Button theme={props.confirmTheme} raised
                    icon={props.confirmIcon} onClick={this.confirm} ref={(f) => this.okBtn = f}>{props.confirmText}</Button>
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

        this.preventClick = false;
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
     * 显示loading
     */
    showLoading () {
        if (this.okBtn) {
            this.okBtn.setLoading(true);
        }
    }

    /**
     * 隐藏loading
     */
    hideLoading () {
        if (this.okBtn) {
            this.okBtn.setLoading(false);
        }
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
        if (!this._isMounted) {
            return false;
        }
        if (this.isHiding) {
            return ;
        }
        this.isHiding = true;
        velocity(this.container, 'fadeOut', { duration: 300 , complete: () => {
            this.isHiding = false;
            this.preventClick = false;
        }});

        if (this.props.onHide) {
            this.props.onHide();
        }
        this.emit('hide');

        let count = this.backdrop.getAttribute('data-count');
        count = count - 1;
        this.backdrop.setAttribute('data-count', count);
        if (count === 0) {
            this.backdrop.style.display = 'none';
            Dom.dom(Dom.query('body')).removeClass('modal-open');
        }
    }

    /**
     * 确认按钮回调
     * @return {[type]} [description]
     */
    confirm () {
        // 防止双击提交的场景
        if (this.preventClick) {
            return;
        }
        this.preventClick = true;
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
        if (!this._isMounted) {
            return false;
        }
        this.panel.setTitleAndContent(title || this.state.title, msg || this.state.msg);

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
        if (this.container.style.display === 'none') {
            this.backdrop.setAttribute('data-count', count);
        }
        Dom.dom(Dom.query('body')).addClass('modal-open');

        window.setTimeout(() => {
            const ele = ReactDOM.findDOMNode(this.panel);
            Dom.dom(this.container).show();
            const h = ele.clientHeight;
            const w = ele.clientWidth;
            const viewWidth = document.documentElement.clientWidth;
            const viewHeight = document.documentElement.clientHeight;
            const pos = {
                x: (viewWidth - w) / 2,
                y: (viewHeight - h) / 2
            };
            if (h > viewHeight) {
                pos.y = 10;
            }
            this.panel.setPosition(pos);
            
            Dom.dom(this.container).show();
            velocity(this.container, 'fadeIn', { duration: 300 });

            if (this.props.onShow) {
                this.props.onShow();
            }
            this.emit('show');
        }, 0);
    }

    componentDidMount () {
        this._isMounted = true;
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.msg !== this.state.msg && nextProps.msg !== this.props.msg) {
            this.setState({
                msg: nextProps.msg
            });
        }
    }

    render () {
        let {className, style} = this.props;
        className = classNames('cm-messageBox', className, `cm-messageBox-${this.props.type}`);
        const props = Object.assign({}, this.props);
        props.className = className;

        props.footers = this.footers;
        style = Object.assign({}, style);
        props.style = style;
        return (
            <div className='cm-popup-warp' ref={f => this.container = f} style={{display: 'none'}}>
                <Panel ref={(ref) => { this.panel = ref; }} {...props} content={this.state.msg} />
            </div>
        );
    }
}

export default MessageBox;
