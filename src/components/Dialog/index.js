/**
 * @author cqb 2016-07-11.
 * @module Dialog
 */

import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import BaseComponent from '../core/BaseComponent';
import PropTypes from 'prop-types';
import Dom from '../utils/Dom';
import Panel from '../Panel/index';
import Button from '../Button/index';
import velocity from '../../lib/velocity';
import './Dialog.less';

/**
 * Dialog 类
 * @class Dialog
 * @constructor
 * @extend BaseComponent
 */
class Dialog extends BaseComponent {
    static displayName = 'Dialog';

    static propTypes = {
        /**
         * 信息
         * @attribute msg
         * @type {String}
         */
        title: PropTypes.any,
        /**
         * 内容
         * @attribute content
         * @type {String}
         */
        content: PropTypes.any,
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
        style: PropTypes.object,
        /**
         * 自定义样式
         * @attribute okButtonText
         * @type {String}
         */
        okButtonText: PropTypes.string
    };

    static defaultProps = {
        visibility: false,
        okButtonText: '确 定',
        cancelButtonText: '取 消',
        hasCloseBtn: true,
        useDefaultFooters: true,
        okButtonTheme: 'primary',
        okButtonIcon: 'check',
        cancelButtonTheme: 'default',
        cancelButtonIcon: 'close',
        draggable: true
    };

    constructor (props) {
        super(props);

        this.addState({
            title: props.title,
            content: props.content,
            visibility: props.visibility
        });

        this.backdrop = null;

        // 保存的数据
        this.data = null;
    }

    /**
     * 设置携带数据
     * @param data
     */
    setData (data) {
        this.data = data;
    }

    /**
     * 获取携带数据
     * @returns {*}
     */
    getData () {
        return this.data;
    }

    /**
     * 设置标题
     * @param title
     */
    setTitle (title) {
        this.setState({title});
        this.panel.setTitle(title);
    }

    /**
     * 设置内容
     * @param content
     */
    setContent (content) {
        this.setState({content});
        this.panel.setContent(content);
    }

    /**
     * 确认按钮点击回调
     * @return {[type]} [description]
     */
    okBtnHandler = () => {
        this.btnHandler(true);
    }

    /**
     * 取消按钮点击回调
     * @return {[type]} [description]
     */
    cancelBtnHandler = () => {
        this.btnHandler(false);
    }

    /**
     * 按钮点击处理函数
     * @param flag
     */
    btnHandler (flag) {
        if (this.props.onConfirm) {
            const ret = this.props.onConfirm(flag);
            if (ret) {
                this.close();
            }

            return ret;
        }

        this.close();
        return true;
    }

    close = () => {
        this.setState({
            visibility: false
        });
        if (this.orign) {
            const offset = Dom.dom(this.orign).offset();
            const ele = ReactDOM.findDOMNode(this.panel);

            velocity(ele, {
                left: offset.left,
                top: offset.top,
                scale: 0
            }, {
                duration: 300,
                complete: () => {
                    velocity(this.container, 'fadeOut', {duration: 0});
                }
            });
        } else {
            velocity(this.container, 'fadeOut', {duration: 300});
        }

        if (this.props.onClose) {
            this.props.onClose();
        }
        this.emit('close');
        let count = this.backdrop.getAttribute('data-count');
        count = count - 1;
        this.backdrop.setAttribute('data-count', count);
        if (count === 0) {
            this.backdrop.style.display = 'none';
        }
    }

    /**
     * 打开
     * @param orign 打开dialog的元素
     */
    open (orign) {
        this.setState({
            visibility: true
        });

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
            Dom.dom(this.container).show();
            const ele = ReactDOM.findDOMNode(this.panel);
            const w = ele.clientWidth;
            const h = ele.clientHeight;
            ele.style.marginLeft = `${-w / 2}px`;
            ele.style.marginTop = `${-h / 2}px`;
            Dom.dom(this.container).hide();

            if (orign) {
                velocity(this.container, 'fadeIn', { duration: 0 });
                this.orign = orign;
                const offset = Dom.dom(orign).offset();
                Dom.dom(ele).css({
                    left: `${offset.left}px`,
                    top: `${offset.top}px`
                });
                const bodyw = document.documentElement.clientWidth;
                const bodyH = document.documentElement.clientHeight;
                velocity(ele, {
                    scale: 0
                }, {
                    duration: 0,
                    complete () {
                        velocity(ele, {
                            scale: 1,
                            left: bodyw / 2,
                            top: bodyH / 2
                        }, {duration: 500, easing: 'ease-in'});
                    }
                });
            } else {
                velocity(this.container, 'fadeIn', { duration: 300 });
            }

            if (this.props.onOpen) {
                this.props.onOpen();
            }
            this.emit('open');
        }, 0);
    }

    /**
     * 是否打开的
     * @returns {Boolean}
     */
    isOpen () {
        return this.state.visibility;
    }

    /**
     * 获取dialog的容器
     * @returns {*}
     */
    getContainer () {
        return this.container;
    }

    /**
     * 获取dialog的panel
     * @returns {*}
     */
    getPanel () {
        return this.panel;
    }

    /**
     *
     */
    componentDidMount () {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        Dom.dom(this.container).addClass('cm-popup-warp');

        let {className, style, hasCloseBtn, useDefaultFooters, okButtonText, okButtonTheme, okButtonIcon,
            cancelButtonText, cancelButtonTheme, cancelButtonIcon} = this.props;
        className = classNames('cm-dialog', className);
        const props = Object.assign({}, this.props);
        props.className = className;
        props.style = style || {};
        if (useDefaultFooters) {
            props.footers = <div>
                <Button theme={okButtonTheme} raised onClick={this.okBtnHandler} icon={okButtonIcon}>
                    {okButtonText}
                </Button>
                <Button theme={cancelButtonTheme} raised onClick={this.cancelBtnHandler}
                    icon={cancelButtonIcon} className='ml-10'>
                    {cancelButtonText}
                </Button>
            </div>;
        }

        if (hasCloseBtn) {
            props.tools = <span>
                {props.tools}
                <a href='javascript:void(0)' onClick={this.close}
                    className='cm-dialog-close'>&times;</a>
            </span>;
        }

        if (this.state.visibility) {
            Dom.dom(this.container).show();
        } else {
            Dom.dom(this.container).hide();
        }

        window.setTimeout(() => {
            ReactDOM.render(<Panel ref={(ref) => { this.panel = ref; }} {...props}>
                {this.props.children}
            </Panel>, this.container);
        }, 0);
    }

    componentWillReceiveProps (nextProps) {
        const params = {};
        if (nextProps.title !== this.props.title && nextProps.title !== this.state.title) {
            this.panel.setTitle(nextProps.title);
            params.title = nextProps.title;
        }
        if (nextProps.content !== this.props.content && nextProps.content !== this.state.content) {
            this.panel.setContent(nextProps.content);
            params.content = nextProps.content;
        }

        this.setState(params);
    }

    render () {
        return (
            <div />
        );
    }
}

export default Dialog;
