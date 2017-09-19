import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BaseComponent from '../src/components/core/BaseComponent';
import {Button, ButtonGroup, Breadcrumb, FontIcon, CheckBox, CheckBoxGroup,
    Row, Col, Panel, MessageBox, Dialog, Notification, Input, InputNumber, Select, Switch, TextArea, Upload,
    Uploadify
} from 'cmui';
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

        <Card>
            name: <Input name="text" maxLength="10" onChange={(v)=>{console.log(v)}}/><br/>
            psw: <Input name="password" type="password"/><br/>
            number: <Input name="number" type="number" /><br/>
        </Card>

        <Card>
            <InputNumber value={10} step="2" size="small"/>
            <Select data={['1','2','3']} ref='select' value="2" placeholder='请选择' multi/>
            <Button onClick={()=>{
                this.refs.select.setValue('2');
            }}>设置值</Button>
            <Button onClick={()=>{
                console.log(this.refs.select.getValue());
            }}>获取值</Button>

            <Button onClick={()=>{
                this.refs.select.setData([{id: '1', text: 'IPhone'},{id: '2', text: 'Android'},{id: '3', text: 'Phone'}], '2');
            }}>重新设置</Button>

            <br />
            <CheckBoxGroup name='11' onChange={(value)=>{
                console.log(value);
            }}>
                <CheckBox label="asd1" value="asd1" />
                <CheckBox label="asd2" value="asd2" />
            </CheckBoxGroup>
            asd:
            <Select value="2" ref='select2' placeholder='请选择' hasEmptyOption multi>
                <Select.Option empty value='___empty'>请选择</Select.Option>
                <Select.Option value='1'>1</Select.Option>
                <Select.Option value='2'>2</Select.Option>
                <Select.Option value='3'>3</Select.Option>
            </Select>
            asd:
            <Button onClick={()=>{
                this.refs.select2.setValue('1');
            }}>设置值</Button>
            <Button onClick={()=>{
                this.refs.select2.disable();
            }}>禁用</Button>
            <Button onClick={()=>{
                console.log(this.refs.select2.getValue());
            }}>获取值</Button>

            <Select value="2" maxWidth={200} url='http://192.168.105.202:8415/mock/test/arr.html' placeholder='请选择' hasEmptyOption multi />
        </Card>
        <Card title='sad'>
            <Switch onChange={(v)=>{
                console.log(v);
            }}></Switch>
            <Switch size="small" />
            <Switch checkedText="on" unCheckedText="off" />

            <TextArea autoHeight height={80} cols={30}></TextArea>
            <TextArea autoHeight height={80} width='100%' placeholder="enter some words"></TextArea>

            <Upload name='file'/><br></br>
            <Uploadify url='xxx' multi={false}/>
            <Uploadify url='xxx' mode='grid' />
        </Card>
      </div>
    );
  }
}

export default App;
