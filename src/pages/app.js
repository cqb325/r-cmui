import "babel-polyfill";
import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router,Route, Link } from 'react-router-dom';
import * as CMUI from '../components';
const {Menu,FontIcon,Layout,Sider, Spin, Logo} = CMUI;
const {SubMenu,MenuItemGroup} = Menu;
const {Header,Content,Footer} = Layout;
const {SVGSpin} = Spin;
import '../components/theme/theme.less';
import '../css/prism.min.css';
import './app.scss';
import '../css/font-awesome.min.css';

import routers from '../routers/routers';
// import Bundle from './Bundle';
//
// var loadDashboard = require("bundle-loader?lazy!./dashboard/dashboard.js");
// const Dashboard = () => (
//   <Bundle load={loadDashboard}>
//     {(Dashboard) => Dashboard ? <Dashboard/> : <Spin spinning/>}
//   </Bundle>
// )
// // pages
// import Button from './Button';

function gotoPage(item){
    router.history.push(item.props.href);
}

let router = render((
    <Router>
        <div style={{height: '100%'}}>
            <Layout className="layout-wrap">
                <Header><Logo/><h3>CMUI 2.0</h3></Header>
                <Layout>
                    <Sider>
                        <Menu style={{width: 200}} onSelect={gotoPage}>
                            <Menu.Item href='/dashboard'>首页</Menu.Item>
                            <SubMenu open title={<span><FontIcon icon="internet-explorer"></FontIcon>Components</span>}>
                                <Menu.Item href='/button'>Button</Menu.Item>
                                <Menu.Item href='/checkbox'>CheckBox</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Content>
                        {routers}
                    </Content>
                </Layout>
            </Layout>
        </div>
    </Router>
), document.getElementById('app'));
