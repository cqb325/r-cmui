import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BaseComponent from '../src/components/core/BaseComponent';
import {
    Button, ButtonGroup, Breadcrumb, FontIcon, CheckBox, CheckBoxGroup,
    Row, Col, Panel, MessageBox, Dialog, Notification, Input, InputNumber, Select, Switch, TextArea, Upload,
    Uploadify, Tooltip, FormControl, RadioGroup, Clock, Dropdown, Menu, Slick, Spin, Steps, Tab, Table, Progress,
    Pagination, IconButton, Form, Badge, Accordion, AutoComplete, Spinner, TimePicker, DateTime, DateRange, Tree,
    Marqueen
} from 'cmui';
const { SubMenu, Item, MenuItemGroup, Divider } = Menu;
import Card from '../src/components/Card';
import { fromJS } from 'immutable';
import image from './images/sr-home.svg';
import pic1 from './images/2504157.jpg';
import Date from '../src/components/DateTime/Date';


class App extends BaseComponent {
    constructor(props) {
        super(props);
        this.changeButtonProps = this.changeButtonProps.bind(this);
        this.data = [{ id: 1, text: 'phone' }, { id: 2, text: 'apple' }];

        this.state = {
            btnTheme: 'default',
            btnDisabled: true
        }
    }

    changeButtonProps() {
        this.setState({
            btnTheme: 'success',
            btnDisabled: false
        });
    }

    componentDidMount() {
        console.log(React);
    }

    setCBData = () => {
        this.data = fromJS(this.data).push({ id: Math.random(), text: '111' }).toJS();
        console.log(this.data);
        this.refs.cb.setData(this.data);
    }

    delCBData = () => {
        this.data = fromJS(this.data).pop().toJS();
        this.refs.cb.setData(this.data);
    }

    disableEnable = () => {
        this.refs.cb1.disableItem(0);
    }

    openMsgBox = () => {
        this.refs.msgbox.show(<div><i className="fa fa-info" /> info message</div>, 'tip');
    }

    openDialog = () => {
        this.refs.dialog.open();
    }

    openNotification = () => {
        Notification.success({
            title: 'tip',
            desc: 'asdasdasd',
            duration: 0
        });
    }

    render() {
        let treeData = [{
            id: 0,
            text: "中国",
            open: true,
            children: [
                {
                    id: '1',
                    text: "北京",
                    children: [{id: '11', text: "海淀"},{id: '12', text: "朝阳"}]
                },{
                    id: '2',
                    text: "上海"
                }
            ]
        }];
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
        </p>
                {/* <Button disabled={this.state.btnDisabled} theme={this.state.btnTheme} ref='btn' raised>按钮</Button>
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
        </Card> */}

                <Card>
                    {/* <InputNumber value={10} step="2" size="small"/>
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

            <RadioGroup data={this.data} onChange={(v)=>{
                console.log(v);
            }}></RadioGroup>
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

            <Select value="2" maxWidth={200} url='http://192.168.105.202:8415/mock/test/arr.html' placeholder='请选择' hasEmptyOption multi /> */}
                </Card>
                <Card title='sad'>
                    <Switch onChange={(v) => {
                        console.log(v);
                    }}></Switch>
                    <Switch size="small" />
                    <Switch checkedText="on" unCheckedText="off" />

                    <TextArea autoHeight height={80} cols={30}></TextArea>
                    <TextArea autoHeight height={80} width='100%' placeholder="enter some words"></TextArea>

                    <Upload name='file' /><br></br>
                    {/* <Uploadify url='xxx' multi={false}/>
            <Uploadify url='xxx' mode='grid' /> */}
                </Card>

                <Card title='Tooltip'>
                    {/* <Tooltip title='this is a tip' align="right"><a className="text-link">link</a></Tooltip>

            <FormControl name="username" label='username：' type='text' required />
            <FormControl name="username" label='username：' type='inputnumber' required />
            <FormControl name="province" label='province：' type='select' required data={['全国','浙江']} hasEmptyOption />
            <FormControl name="checked" label='sure：' type='switch' required />
            <FormControl name="desc" label='desc：' type='textarea' required />
            <FormControl name="file" label='file：' type='file' required />
            <FormControl name="checkbox" label='checkbox：' type='checkbox' required data={[{id: '1', text: 'phone'}]}/>
            <FormControl name="radio" label='radio：' type='radio' required data={[{id: '1', text: 'phone'}]}/> */}
                </Card>

                <Card title='xxx'>
                    <Dropdown overlay={<ul><li>aaa</li></ul>}><a>asd</a></Dropdown>

                    {/* <Menu theme='black' style={{width: 200}}>
                <Item>aaaa</Item>
                <SubMenu title="SubMenu1">
                    <Item>aa1</Item>
                    <Divider />
                    <Item>aa2</Item>
                </SubMenu>
                <Divider />
                <MenuItemGroup title="MenuItemGroup">
                    <Item>aa1</Item>
                </MenuItemGroup>
            </Menu> */}
                </Card>

                <Card>
                    <Spin.SVGSpin spinning ref='spin'>
                        <Slick effect='fade'>
                            <Slick.Item><img src={pic1} /></Slick.Item>
                            <Slick.Item>
                                <p>asdasd</p>
                                <p>asdasd</p>
                                <p>asdasd</p>
                            </Slick.Item>
                            <Slick.Item>3</Slick.Item>
                        </Slick>
                    </Spin.SVGSpin>
                    <Switch checked onChange={(v) => {
                        v ? this.refs.spin.show() : this.refs.spin.hide();
                    }} />

                    <Steps current={1}>
                        <Steps.Step title='step1' description='step1 desc...'></Steps.Step>
                        <Steps.Step title='step2' description='step2 desc...'></Steps.Step>
                        <Steps.Step title='step3' description='step3 desc...'></Steps.Step>
                    </Steps>
                </Card>

                <Card>
                    <Tab ref='tab' hasClose data={[{ text: 'tab1', component: <div>111</div> }, { text: 'tab2', component: <div>2222</div> }]}>
                        <Tab.Item title="ttt"><img src={pic1} /></Tab.Item>
                    </Tab>

                    <Button onClick={() => {
                        this.refs.tab.add({
                            text: 'added',
                            component: <div>added tab</div>
                        }, true);
                    }}>添加</Button>

                    <Button onClick={() => {
                        this.refs.tab.add(<Tab.Item title='added title'>added content2</Tab.Item>, true);
                    }}>添加元素</Button>

                    <Button onClick={() => {
                        console.log(this.refs.tab.getActiveIndex());
                        this.refs.tab.remove(this.refs.tab.getActiveIndex());
                    }}>删除</Button>
                </Card>

                <Card>
                    <Table ref='table'
                        bordered
                        columns={[{ type: 'checkbox' }, { name: 'field1', text: 'field1', sort: true }, { name: 'field2', text: 'field2', sort: true }]}
                        data={[{ field1: '111', field2: '222' }, { field1: '333', field2: '444' }]}
                    >
                    </Table>

                    <Button onClick={() => {
                        console.log(this.refs.table.getAllChecked());
                        console.log(this.refs.table.orignData);
                    }}>获取勾选的数据</Button>
                    <Button onClick={() => {
                        this.refs.table.addRow({
                            field1: 'asd', field2: 'lkj'
                        });
                    }}>添加数据</Button>
                    <Button onClick={() => {
                        let length = this.refs.table.getData().length;
                        this.refs.table.removeRow(length - 1);
                    }}>删除数据</Button>
                    <Button onClick={() => {
                        this.refs.table.setData([{ field1: '111', field2: '222' }, { field1: '333', field2: '444' }]);
                    }}>添加数据</Button>
                </Card>

                <Card>
                    <Progress value={50} strokeWidth={1} type='circle'></Progress>
                    <Pagination current={1} total={50} pageSize={10} />
                    <br />
                    <br />
                    <br />
                    <br />

                    <IconButton><FontIcon icon='save'></FontIcon></IconButton>
                </Card>

                <Card>
                    <Form action='xxx' method='get' labelWidth={80} layout='stack-inline' ajax>
                        <FormControl type='text' name='user' required label='User'/>
                        <FormControl type='select' name='select' required label='Select' data={['1','2','3']}/>
                        <FormControl type='checkbox' name='check' required label='check' data={[{id: '1', text: '1'},{id: '2', text: '2'}]}/>
                        <FormControl type='datetime' name='datetime' required label='datetime'/>
                        <FormControl type='daterange' name='daterange' required label='daterange'/>
                        <FormControl type='textarea' name='address' required label='Text' height={70}/>
                        <Form.Row>
                            <FormControl label='&nbsp;' type='text'/>
                            <Form.Promote italic>xxxxxxxxxx</Form.Promote>
                        </Form.Row>
                    </Form>

                    <Badge count={111}><FontIcon icon='list' size='3x'></FontIcon></Badge>
                    <Badge dot><FontIcon icon='list' size='3x'></FontIcon></Badge>
                    <Badge status='success' text='success'></Badge>

                    <Accordion>
                        <Accordion.Item title='Ac1'>
                            <p>asdadasdasdasd</p>
                            <p>asdadasdasdasd</p>
                            <p>asdadasdasdasd</p>
                            <p>asdadasdasdasd</p>
                        </Accordion.Item>
                        <Accordion.Item title='Ac2'>
                            <p>asdadasdasdasd</p>
                            <p>asdadasdasdasd</p>
                            <p>asdadasdasdasd</p>
                            <p>asdadasdasdasd</p>
                        </Accordion.Item>
                    </Accordion>

                    <br/>
                    <br/>
                    <br/>
                    <AutoComplete data={['a','aa','ab','b','bc']}></AutoComplete>

                    <Clock value='16:12:50' secondStep={10}></Clock>
                    <br/>
                    <Spinner max={12} step={2} size='small' loop></Spinner>
                    <br/>
                    <br/>

                    <TimePicker value='16:30:30' secondStep={5} onChange={(v)=>{
                        console.log(v);
                        }}></TimePicker>

                    <div className='cm-datetime'>
                        <Date value='2017-09-22' format='YYYY-MM-DD' minuteStep={15} onSelectDate={(v, date)=>{
                            console.log(v, date);
                        }}></Date>
                    </div>

                    <DateTime dateOnly format='YYYY-MM-DD'></DateTime>

                    <DateRange clear shortcuts={['一周内']} showTime maxRange={7} endDate='2017-09-24 17:00' value='2017-09-24 15:00:00~2017-09-30 14:30:30' format='YYYY-MM-DD HH:00'></DateRange>
                </Card>

                <Card>
                    <Tree ref='tree' data={treeData} enableCheckbox enableSmartCheckbox></Tree>

                    <Button onClick={()=>{
                        this.refs.tree.selectItem('1');
                    }}>选中</Button>
                    <Button onClick={()=>{
                        this.refs.tree.openItem('1');
                    }}>打开</Button>
                    <Button onClick={()=>{
                        this.refs.tree.openAllItem();
                    }}>打开所有</Button>
                    <Button onClick={()=>{
                        this.refs.tree.closeItem('1');
                    }}>关闭</Button>

                    <Button onClick={()=>{
                        this.refs.tree.setItemText('1', '北京1');
                    }}>设置文字</Button>
                    <Button onClick={()=>{
                        console.log(this.refs.tree.getItemText('1'));
                    }}>获取文字</Button>
                    <Button onClick={()=>{
                        console.log(this.refs.tree.getOpenState('1'));
                    }}>获取打开状态</Button>
                    <Button onClick={()=>{
                        console.log(this.refs.tree.getSelectedItem('1'));
                    }}>当前选中节点</Button>
                    <Button onClick={()=>{
                        console.log(this.refs.tree.getAllChecked());
                    }}>所有勾选的节点</Button>
                    <Button onClick={()=>{
                        this.refs.tree.addItem('1', {
                            id: Math.random(),
                            text: 'asd'
                        });
                    }}>addItem</Button>

                    <Button onClick={()=>{
                        this.refs.tree.deleteChildItems('1');
                    }}>deleteChildItems</Button>

                    <Button onClick={()=>{
                        this.refs.tree.removeItem('1');
                    }}>removeItem</Button>

                    <Button onClick={()=>{
                        this.refs.tree.setData([
                {
                    id: '1',
                    text: "北京",
                    children: [{id: '11', text: "海淀"},{id: '12', text: "朝阳"}]
                },{
                    id: '2',
                    text: "上海"
                }
            ]);
                    }}>resetData</Button>
                </Card>



                <Card>
                    <Marqueen dir='down'>
                        <p>1asdasdasdasdasdasdasdasdasdasd</p>
                        <p>2asdasdasdasdasdasdasdasdasdasd</p>
                        <p>3asdasdasdasdasdasdasdasdasdasd</p>
                        <p>4asdasdasdasdasdasdasdasdasdasd</p>
                    </Marqueen>

                    <Marqueen dir='right'>
                        <div className='pull-left' style={{padding: 3}}>1asdasdasdasdasdasdasdasdasdasd</div>
                        <div className='pull-left'>2asdasdasdasdasdasdasdasdasdasd</div>
                        <div className='pull-left'>3asdasdasdasdasdasdasdasdasdasd</div>
                        <div className='pull-left'>4asdasdasdasdasdasdasdasdasdasd</div>
                    </Marqueen>
                </Card>
            </div>
        );
    }
}

export default App;
