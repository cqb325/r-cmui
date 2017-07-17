/**
 * @author cqb 2016-07-11.
 * @module Dialog
 */

import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import Dom from './utils/Dom';
import Panel from './Panel';
import Button from './Button';
import velocity from 'velocity';

/**
 * Dialog 类
 * @class Dialog
 * @constructor
 * @extend BaseComponent
 */
class Dialog extends BaseComponent {
    constructor(props) {
        super(props);

        this.title = props.title;
        this.addState({
            visibility: false
        });

        this.footers = props.hasFooter ? props.footers || {
            components: [
                <Button theme='success' raised onClick={this.btnHandler.bind(this, true)} icon='save'>
                    {props.okButtonText || '保 存'}
                </Button>,
                <Button theme='info' raised onClick={this.btnHandler.bind(this, false)} icon='flask' className='ml-10'>
                    {props.cancelButtonText || '取 消'}
                </Button>
            ]
        } : null;

        this.backdrop = null;

        // 保存的数据
        this.data = null;
    }

    /**
     * 设置携带数据
     * @param data
     */
    setData(data){
        this.data = data;
    }

    /**
     * 获取携带数据
     * @returns {*}
     */
    getData(){
        return this.data;
    }

    /**
     * 设置标题
     * @param title
     */
    setTitle(title){
        this.title = title;
        this.panel.setTitle(title);
    }

    /**
     * 设置内容
     * @param content
     */
    setContent(content){
        this.content = content;
        this.panel.setContent(content);
    }

    /**
     * 按钮点击处理函数
     * @param flag
     */
    btnHandler(flag){
        if (this.props.onConfirm) {
            let ret = this.props.onConfirm(flag);
            if (ret) {
                this.close();
            }

            return ret;
        }

        this.close();
        return true;
    }

    close(){
        this.setState({
            visibility: false
        });
        if (this.orign) {
            let offset = Dom.dom(this.orign).offset();
            let ele = ReactDOM.findDOMNode(this.panel);

            velocity(ele, {
                left: offset.left,
                top: offset.top,
                scale: 0
            }, {
                duration: 300,
                complete: ()=>{
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
        this.backdrop.style.display = 'none';
    }

    /**
     * 打开
     * @param orign 打开dialog的元素
     */
    open(orign){
        this.setState({
            visibility: true
        });

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
            Dom.dom(this.container).show();
            let ele = ReactDOM.findDOMNode(this.panel);
            let w = ele.clientWidth;
            let h = ele.clientHeight;
            ele.style.marginLeft = -w / 2 + 'px';
            ele.style.marginTop = -h / 2 + 'px';
            Dom.dom(this.container).hide();

            if (orign) {
                velocity(this.container, 'fadeIn', { duration: 0 });
                this.orign = orign;
                let offset = Dom.dom(orign).offset();
                Dom.dom(ele).css({
                    left: offset.left + 'px',
                    top: offset.top + 'px'
                });
                var bodyw = document.documentElement.clientWidth;
                var bodyH = document.documentElement.clientHeight;
                velocity(ele, {
                    scale: 0
                }, {
                    duration: 0,
                    complete: function(){
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
    isOpen(){
        return this.state.visibility;
    }

    /**
     * 获取dialog的容器
     * @returns {*}
     */
    getContainer(){
        return this.container;
    }

    /**
     * 获取dialog的panel
     * @returns {*}
     */
    getPanel(){
        return this.panel;
    }

    /**
     *
     */
    componentDidMount(){
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        Dom.dom(this.container).addClass('cm-popup-warp');

        let {className, style} = this.props;
        className = classNames('cm-dialog', className);
        let props = Object.assign({}, this.props);
        props.className = className;

        props.style = style || {};
        props.footers = this.footers;

        if (this.props.hasCloseBtn) {
            props.tools = {
                components: [<a href='javascript:void(0)' onClick={this.close.bind(this)}
                    className='cm-dialog-close'>&times;</a>]
            };
        }

        if (this.state.visibility) {
            Dom.dom(this.container).show();
        } else {
            Dom.dom(this.container).hide();
        }

        window.setTimeout(()=>{
            ReactDOM.render(<Panel ref={(ref)=>{ this.panel = ref; }} {...props}>
                {this.props.children}
            </Panel>, this.container);
        }, 0);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.title !== this.state.title) {
            this.panel.setTitle(nextProps.title);
        }
        if (nextProps.content !== this.state.content) {
            this.panel.setContent(nextProps.content);
        }
    }

    render(){
        return (
            <div />
        );
    }
}

Dialog.defaultProps = {
    hasCloseBtn: true
};

Dialog.propTypes = {
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

export default Dialog;
