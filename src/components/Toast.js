/**
 * @author cqb 2016-05-01.
 * @module Toast
 */

import React from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';


/**
 * Toast 类
 * @class Toast
 * @constructor
 * @extend BaseComponent
 */
class Toast extends BaseComponent {
    constructor(props) {
        super(props);

        this.toast = null;
    }

    show(msg){
        this.toast.show(msg);
    }

    hide(msg){
        this.toast.hide(msg);
    }

    componentDidMount(){
        if (!window.Toast) {
            window.Toast = this;

            this.container = document.createElement('div');
            document.body.appendChild(this.container);

            window.setTimeout(()=>{
                ReactDOM.render(
                    <ToastInner msg={this.props.msg} ref={(ref)=>{ this.toast = ref; }} />
                    , this.container);
            }, 0);
        } else {
            console.warn('Toast already exist');
        }
    }

    render(){
        return (
            <div className='toast-placeholder' />
        );
    }
}

/**
 * ToastInner 类
 * @class ToastInner
 * @constructor
 * @extend Component
 */
class ToastInner extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            visibility: false,
            msg: props.msg || '数据加载中'
        };
    }

    /**
     * 显示Toast
     * @param msg
     */
    show(msg){
        let params = {
            visibility: true
        };
        if (msg) {
            params.msg = msg;
        }
        this.setState(params);
    }

    /**
     * 隐藏Toast
     * @param msg
     */
    hide(msg){
        let params = {
            visibility: false
        };
        if (msg) {
            params.msg = msg;
        }
        this.setState(params);
    }

    render(){
        return (
            <div className='weui_loading_toast' style={{display: this.state.visibility ? 'block' : 'none'}}>
                <div className='weui_mask_transparent' />
                <div className='weui_toast'>
                    <div className='weui_loading'>
                        <div className='weui_loading_leaf weui_loading_leaf_0' />
                        <div className='weui_loading_leaf weui_loading_leaf_1' />
                        <div className='weui_loading_leaf weui_loading_leaf_2' />
                        <div className='weui_loading_leaf weui_loading_leaf_3' />
                        <div className='weui_loading_leaf weui_loading_leaf_4' />
                        <div className='weui_loading_leaf weui_loading_leaf_5' />
                        <div className='weui_loading_leaf weui_loading_leaf_6' />
                        <div className='weui_loading_leaf weui_loading_leaf_7' />
                        <div className='weui_loading_leaf weui_loading_leaf_8' />
                        <div className='weui_loading_leaf weui_loading_leaf_9' />
                        <div className='weui_loading_leaf weui_loading_leaf_10' />
                        <div className='weui_loading_leaf weui_loading_leaf_11' />
                    </div>
                    <p className='weui_toast_content'>{this.state.msg}</p>
                </div>
            </div>
        );
    }
}

Toast.propTypes = {
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

export default Toast;
