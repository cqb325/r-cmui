import React from 'react';

import Input from '../../src/components/Input';
import Select from '../../src/components/Select';
import Spinner from '../../src/components/Spinner';
import Button from '../../src/components/Button';
import FontIcon from '../../src/components/FontIcon';
import DateTime from '../../src/components/DateTime';
import InputGroup from '../../src/components/InputGroup';
import Form from '../../src/components/Form';
import FormControl from '../../src/components/FormControl';

class Comp extends React.Component {
    displayName = 'Comp';

    protocal = [{id: 'http', text: 'http://'}, {id: 'https', text: 'https://'}];
    suffix = [{id: 'com', text: '.com'}, {id: 'cn', text: '.cn'}, {id: 'org', text: '.org'}];
    select1 = <Select minWidth={50} data={this.protocal} value='http'></Select>;
    select2 = <Select minWidth={50} data={this.suffix} value='com'></Select>;

    state = {
        codeText: '获取验证码'
    }

    time = 60;
    timer = null;
    couting = false;

    count = () => {
        if (this.couting) {
            return false;
        }
        this.couting = true;
        this.setState({codeText: this.time === 0 ? '获取验证码' : `${this.time}s`});
        this.timer = window.setInterval(() => {
            this.time = this.time - 1;
            this.setState({codeText: this.time === 0 ? '获取验证码' : `${this.time}s`});
            if (this.time === 0) {
                this.couting = false;
                window.clearInterval(this.timer);
                this.time = 60;
            }
        }, 1000);
    }

    render () {
        return (
            <div style={{padding: 50}}>
                <Input size='large' placeholder='large'/>
                <Input />
                <Input size='small' />

                <div className='mt-30' style={{width: 300}}>
                    <Input addonBefore='http://' placeholder='域名'/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input addonBefore='http://' addonAfter='.com'/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input addonBefore={this.select1} addonAfter={this.select2}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input size='small' addonBefore={this.select1} addonAfter={this.select2}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input size='large' addonBefore={this.select1} addonAfter={this.select2}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <InputGroup size='small'>
                        <Input style={{width: '30%'}}/>
                        <Input style={{width: '50%'}}/>
                        <Input style={{width: '20%'}}/>
                    </InputGroup>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <InputGroup size='small'>
                        {this.select1}
                        <Input style={{width: '100%'}}/>
                    </InputGroup>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <InputGroup size='small'>
                        <Input style={{width: '100%'}}/>
                        <DateTime style={{width: '70%'}}/>
                    </InputGroup>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <InputGroup size='small'>
                        <Input style={{width: '100%'}}/>
                        <Spinner style={{width: '30%'}}/>
                    </InputGroup>
                </div>

                <div className='mt-30' style={{width: 300}}>
                    <InputGroup size='large'>
                        {this.select1}
                        {this.select2}
                    </InputGroup>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input prefix='$' size='small' suffix={<FontIcon icon='search'></FontIcon>}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input size='large' prefix={<FontIcon icon='mobile'></FontIcon>}/>
                    <Input size='large' prefix={<FontIcon icon='user'></FontIcon>}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input size='large' suffix={<Button size='small' theme='primary'>Search</Button>}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input size='small' suffix={<Button size='small' theme='primary' icon='search' style={{padding: '3px 15px'}}></Button>}/><br/><br/>
                    <Input size='large' suffix={<Button theme='primary' icon='search' style={{padding: '10px 15px'}}></Button>}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input size='large' maxLength={6} placeholder='输入验证码'
                        suffix={<Button style={{width: 100}} theme='primary' onClick={this.count}>{this.state.codeText}</Button>}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Form layout='stack-inline'>
                        <FormControl required>
                            <Input size='large' maxLength={6} placeholder='输入验证码'
                                suffix={<Button style={{width: 100}} theme='primary' onClick={this.count}>{this.state.codeText}</Button>}/>
                        </FormControl>
                        <FormControl required>
                            <Input size='large' prefix={<FontIcon icon='mobile'></FontIcon>}/>
                        </FormControl>
                        <FormControl required>
                            <Input size='large' prefix={<FontIcon icon='user'></FontIcon>}/>
                        </FormControl>
                        <FormControl required>
                            <Input addonBefore='http://' placeholder='域名'/>
                        </FormControl>
                        <FormControl required messages={{required: '请完整填写该项内容'}}>
                            <InputGroup>
                                <Input style={{width: '100%'}} value='asdasdas'/>
                                <DateTime style={{width: '50%'}}/>
                            </InputGroup>
                        </FormControl>
                    </Form>
                </div>
            </div>
        );
    }
}
export default Comp;
