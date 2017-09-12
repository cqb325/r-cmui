import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BaseComponent from '../src/components/core/BaseComponent';
import {Button, ButtonGroup, Breadcrumb, FontIcon, CheckBox, CheckBoxGroup,
    Row, Col, Panel, MessageBox, Dialog, Notification} from 'cmui';
import Card from '../src/components/Card';
import {fromJS} from 'immutable';
import image from './images/sr-home.svg';


class App extends BaseComponent {
    constructor(props){
        super(props);
        this.changeButtonProps = this.changeButtonProps.bind(this);
        this.data = [{id: 1, text: 'phone'}, {id: 2, text: 'apple'}];

        this.state = {
            btnTheme: 'default',
            btnDisabled: true
        }
    }

    changeButtonProps(){
        this.setState({
            btnTheme: 'success',
            btnDisabled: false
        });
    }

    componentDidMount(){
        console.log(React);
    }

    setCBData = ()=>{
        this.data = fromJS(this.data).push({id: Math.random(), text: '111'}).toJS();
        console.log(this.data);
        this.refs.cb.setData(this.data);
    }

    delCBData = ()=>{
        this.data = fromJS(this.data).pop().toJS();
        this.refs.cb.setData(this.data);
    }

    disableEnable = ()=>{
        this.refs.cb1.disableItem(0);
    }

    openMsgBox = ()=>{
        this.refs.msgbox.show(<div><i className="fa fa-info"/> info message</div>, 'tip');
    }

    openDialog = ()=>{
        this.refs.dialog.open();
    }

    openNotification = ()=>{
        Notification.success({
            title: 'tip',
            desc: 'asdasdasd',
            duration: 0
        });
    }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button disabled={this.state.btnDisabled} theme={this.state.btnTheme} ref='btn' raised>按钮</Button>
        <Button theme="primary" onClick={this.changeButtonProps}>改变</Button>
        asd:
        <Button theme="primary" img={image} style={{fontSize: 16}}>改变</Button>
        <br />
        asd: <ButtonGroup>
            <Button ref='btn1' >1</Button>
            <Button>2</Button>
        </ButtonGroup>

        <Button icon='download' theme='primary'>icon</Button>

        <Card title="Title">
            <p>Content</p>
        </Card>

        <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>

        <FontIcon icon="save">save</FontIcon>
        <br></br>
        asd: <CheckBox label="iphone"/><CheckBox label="iphone"/>

        asdasd: <CheckBoxGroup ref="cb" data={this.data}></CheckBoxGroup>
        <Button onClick={this.setCBData}>add</Button>
        <Button onClick={this.delCBData}>del</Button>


        <CheckBoxGroup ref='cb1' url='http://192.168.105.202:8415/mock/cdn-ops/log/domainList'></CheckBoxGroup>
        <Button onClick={this.disableEnable}>disableEnable</Button>

        <Row>
            <Col grid={0.5}>1</Col>
            <Col grid={0.5}>2</Col>
        </Row>

        <Panel title="asd"
            tools={<span><a className="text-link mr-5">save</a><a className="text-link">delete</a></span>}
            footers={<span><Button theme="primary" className="mr-15">save</Button>
            <Button className="text-link">delete</Button></span>}
            >
            <p>asd</p>
        </Panel>


        <MessageBox ref="msgbox"></MessageBox>
        <Button raised theme="primary" onClick={this.openMsgBox}>msgbox</Button>


        <Dialog ref='dialog' title='Title'
            useDefaultFooters={false}
            tools={<a className="text-link mr-5">menu</a>}>
            <p>dialog Content</p>
            <p>dialog Content</p>
            <p>dialog Content</p>
        </Dialog>

        <Button onClick={this.openDialog} raised theme="primary">dialog</Button>
        <Button onClick={this.openNotification} raised theme="primary">Notification</Button>


      </div>
    );
  }
}

export default App;
