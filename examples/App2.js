import React from 'react';

import Input from '../src/components/Input';
import InputNumber from '../src/components/InputNumber';
import TextArea from '../src/components/TextArea';
import Button from '../src/components/Button';
import Search from '../src/components/Search';
import CheckBox from '../src/components/CheckBox';
import Radio from '../src/components/Radio';
import CheckBoxGroup from '../src/components/CheckBoxGroup';
import RadioGroup from '../src/components/RadioGroup';
import FontIcon from '../src/components/FontIcon';
import ButtonGroup from '../src/components/ButtonGroup';
import Card from '../src/components/Card';
import MessageBox from '../src/components/MessageBox';
import Dialog from '../src/components/Dialog';
import FormControl from '../src/components/FormControl';
import './App.css';
import { setTimeout } from 'timers';
import DateRange from './daterange/index';
import SimpleListPage from './simpleListPage/index';
import Form from './form/index';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        refresh: 1,
        input: 1,
        disabled: false,
        checkgroup: '',
        loadding: false
    }

    refresh = () => {
        this.setState({
            refresh: this.state.refresh + 1,
            input: this.state.input + 1,
            disabled: !this.state.disabled
        });
    }

    renderCardContent () {
        if (this.state.input % 2 === 0) {
            return <div>
                <p>Card Content</p>
                <p>Card Content</p>
                <p>Card Content</p>
            </div>;
        } else {
            return null;
        }
    }

    render () {
        console.log('refresh...');
        return (
            <div>
                <div>
                    <Button onClick={this.refresh}>刷新</Button>
                    <Button theme='primary' loadding={this.state.loadding} onClick={() => {
                        this.setState({
                            loadding: !this.state.loadding
                        });
                        setTimeout(() => {
                            this.setState({
                                loadding: !this.state.loadding
                            });
                        }, 1000);
                    }}>刷 新</Button>
                    <Button theme='second' disabled>刷新</Button>
                    <Button theme='info' raised icon='download'>刷新</Button>
                    <Button theme='danger'>刷新</Button>
                    <Button theme='success' circle>刷新</Button>
                    <Button theme='primary' circle iconOnly icon='download'></Button>
                    <Button flat>连接按钮</Button>
                    <FontIcon icon='loading' font='cmui' spin className='ml-5' />

                    <ButtonGroup>
                        <Button>时</Button>
                        <Button>分</Button>
                        <Button>秒</Button>
                    </ButtonGroup>
                </div>
                as 中文
                <Search name='search' placeholder='站内搜索' onSearch={(v) => { console.log(v); }}/>
                <Input value={this.state.input} type='number' disabled={this.state.disabled} onChange={() => {
                    console.log(11);
                }}></Input><Button>刷 新</Button>
                <TextArea value={this.state.input} height={50} autoHeight onChange={() => {
                    console.log(11);
                }}/>

                <div>
                    <CheckBox label='阿萨德' onChange={(value, checked) => { console.log(checked); }}></CheckBox>
                    <CheckBox label='Apple' disabled></CheckBox>
                </div>

                <div>
                    <CheckBoxGroup value={this.state.checkgroup} ref='group'>
                        <CheckBox label='Apple' value='1' disabled={this.state.disabled}></CheckBox>
                        <CheckBox label='Apple1' value='2'></CheckBox>
                        <CheckBox label='Apple2' value='3'></CheckBox>
                    </CheckBoxGroup>

                    <Button onClick={() => {
                        this.setState({checkgroup: '2'});
                    }}>改变值</Button>
                </div>

                <div>
                    <RadioGroup value='0' disabled>
                        <Radio value='0' label='Apple2'/>
                        <Radio value='1' label='Apple3'/>
                    </RadioGroup>

                    <RadioGroup value='0' stick>
                        <Radio value='0' label='技术'/>
                        <Radio value='1' label='部门'/>
                    </RadioGroup>
                </div>

                <Card title='营销额' loadding>
                    {this.renderCardContent()}
                </Card>

                <Card>
                    <InputNumber/>
                </Card>

                <Dialog ref='dialog' title='标题'>
                    <div style={{height: 400}}>
                        <Button onClick={() => {
                            this.refs.tip.show();
                            this.refs.tip.showLoading();

                            window.setTimeout(() => {
                                this.refs.tip.hideLoading();
                            }, 2000);
                        }}>显示</Button>
                    </div>
                </Dialog>

                <MessageBox ref='tip' title='提示' content='asdasdasdasdasdasdas'/>

                <Button onClick={() => {
                    this.refs.dialog.open();
                    this.refs.dialog.showLoading();

                    window.setTimeout(() => {
                        this.refs.dialog.hideLoading();
                    }, 2000);
                }}>显示</Button>

                <Card>
                    <FormControl type='text' name='asd' required label='asd'></FormControl>
                    <FormControl type='number' name='asd' required label='asd'></FormControl>
                    <FormControl type='checkbox' name='asd' required label='asd' data={[{id: '1', text: 'asd'},{id: '2', text: 'asd'},{id: '3', text: 'asd'},{id: '4', text: 'asd'}]}></FormControl>
                </Card>

                <DateRange/>
                <SimpleListPage/>
                <Form/>
            </div>
        );
    }
}
export default Comp;
