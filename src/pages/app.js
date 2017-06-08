import "babel-polyfill";
import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router,Route, Link } from 'react-router-dom';
import * as CMUI from '../components';
const {Menu,FontIcon,Layout,Sider} = CMUI;
const {SubMenu,MenuItemGroup} = Menu;
const {Header,Content,Footer} = Layout;
import '../components/theme/theme.less'
import './app.scss';
import '../css/font-awesome.min.css';

// pages
import Dashboard from './dashboard/dashboard';
import Button from './Button';

function gotoPage(item){
    router.history.push(item.props.href);
}

let router = render((
    <Router>
        <div style={{height: '100%'}}>
            <Layout className="">
                <Header>Header</Header>
                <Layout>
                    <Sider>
                        <Menu style={{width: 200}} theme="dark" onSelect={gotoPage}>
                            <Menu.Item href='/dashboard'>首页</Menu.Item>
                            <SubMenu title={<span><FontIcon icon="internet-explorer"></FontIcon>Button</span>}>
                                <Menu.Item href='/button/base'>Base</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Content>
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route path="/button/base" component={Button}/>
                    </Content>
                </Layout>
            </Layout>
        </div>
    </Router>
), document.getElementById('app'));
