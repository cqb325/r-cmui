/**
 * @author cqb 2017-05-19.
 * @module Notification
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import UUID from '../utils/UUID';
import velocity from '../../lib/velocity';
import FontIcon from '../FontIcon/index';
import {fromJS} from 'immutable';
import NotificationPanel from './NotificationPanel';
import './Notification.less';

class Notification extends BaseComponent{
    static displayName = "Notification";

    constructor(props){
        super(props);

        this.addState({
            configs: {}
        });

        this.panels = {};
        this.DOCK = {
            TOPRIGHT: 'topRight',
            TOPLEFT: 'topLeft',
            BOTTOMRIGHT: 'bottomRight',
            BOTTOMLEFT: 'bottomLeft'
        };
    }

    /**
     * success 消息
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    success(config){
        config.icon = <FontIcon icon='success' font='cmui' />;
        this.open(config);
    }

    /**
     * 普通消息
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    info(config){
        config.icon = <FontIcon icon='info' font='cmui' />;
        this.open(config);
    }

    /**
     * 警告消息
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    warning(config){
        config.icon = <FontIcon icon='warning' font='cmui' />;
        this.open(config);
    }

    /**
     * 错误消息
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    error(config){
        config.icon = <FontIcon icon='error' font='cmui' />;
        this.open(config);
    }

    /**
     * 提问消息
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    question(config){
        config.icon = <FontIcon icon='question' font='cmui' />;
        this.open(config);
    }

    /**
     * 打开提示框
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    open(config){
        if (!config.dock) {
            config.dock = 'topRight';
        }
        if (config.key === undefined) {
            config.key = UUID.v4();
        }
        if (config.duration === undefined) {
            config.duration = 4.5;
        }

        let configs = this.state.configs;
        if (configs[config.key]) {
            return false;
        }
        configs = fromJS(configs).set(config.key, config).toJS();

        if (this._isMounted) {
            this.setState({configs});
        }
    }

    /**
     * 根据key关闭对应的notification
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    close(key){
        let notification = this.getNotification(key);
        if (notification) {
            notification.close();
        }
    }

    /**
     * 获取消息框
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    getNotification(key){
        return this.panels[key];
    }

    /**
     * 销毁消息框
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    destroy(key){
        let configs = this.state.configs;
        configs = fromJS(configs).delete(key).toJS();
        delete this.panels[key];

        if (this._isMounted) {
            this.setState({configs});
        }
    }

    clear(){
        for (let key in this.panels) {
            this.close(key);
        }
    }

    /**
     * 渲染所有的panel
     * @return {[type]} [description]
     */
    renderPanels(){
        let panels = [];
        let boxes = {
            topRight: {},
            topLeft: {},
            bottomRight: {},
            bottomLeft: {}
        };
        let configs = this.state.configs;
        for (let key in configs) {
            let config = configs[key];
            if (boxes[config.dock]) {
                boxes[config.dock][key] = config;
            }
        }

        let topRight = this.renderDockPanels(boxes.topRight, 'topRight');
        panels.push(topRight);
        let topLeft = this.renderDockPanels(boxes.topLeft, 'topLeft');
        panels.push(topLeft);
        let bottomRight = this.renderDockPanels(boxes.bottomRight, 'bottomRight');
        panels.push(bottomRight);
        let bottomLeft = this.renderDockPanels(boxes.bottomLeft, 'bottomLeft');
        panels.push(bottomLeft);

        return panels;
    }

    /**
     * 渲染某个方向的panels
     * @param  {[type]} configs [description]
     * @param  {[type]} docker  [description]
     * @return {[type]}         [description]
     */
    renderDockPanels(configs, docker){
        let panels = [];
        for (let key in configs) {
            panels.push(<NotificationPanel parent={this}
                ref={(ref)=>{ this.panels[key] = ref; }} key={key} config={configs[key]} />);
        }
        if (panels.length) {
            return (
                <div key={docker} className={`cm-notification-box cm-notification-${docker}`}>
                    {panels}
                </div>
            );
        } else {
            return null;
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
    }

    render(){
        let panels = this.renderPanels();

        return (
            <div className='cm-notification'>
                {panels}
            </div>
        );
    }
}

let container = document.createElement('div');
document.body.appendChild(container);

export default ReactDOM.render(<Notification />, container);
