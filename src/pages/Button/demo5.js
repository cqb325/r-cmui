import React from 'react';
import BaseDemo from '../base/BaseDemo';
import {Button, FontIcon, ButtonGroup} from '../../components';
import Code from '../base/Code';

class Demo extends BaseDemo{
    constructor(props){
        super(props);

        this.state = {
            size: 'default'
        };
    }

    componentDidMount(){
        this.refs.btnGroup.on('select', (btn)=>{
            let size = btn.props['data-size'];
            this.setState({
                size: size
            });
        });
    }

    render(){
        return (
            <div>
                <div className='code-box-demo'>
                    <div>
                        <ButtonGroup ref='btnGroup'>
                            <Button theme='primary' data-size='small'>Small</Button>
                            <Button theme='primary' active data-size='default'>Default</Button>
                            <Button theme='primary' data-size='large'>Large</Button>
                        </ButtonGroup>
                    </div>
                    <div className='mt-15'>
                        <Button theme='primary' size={this.state.size} icon='cloud' />
                        <Button theme='primary' size={this.state.size} raised className='ml-10'>Raised</Button>
                        <Button theme='primary' size={this.state.size} raised
                            icon='download' className='ml-10'>Download</Button>
                    </div>
                </div>
                <div className='code-box-desc'>
                    <div className='code-box-title'>按钮组合事件</div>
                    <div>
                        ButtonGroup可以添加onSelect事件，也接受on('select')事件监听
                        事件回调包含一个Button类型的参数，为当前选中的Button。
                        <FontIcon
                            icon={'chevron-circle-down'}
                            ref='collapse'
                            className={'collapse ' + (this.state.active ? 'active' : '')}
                            onClick={this.openCloseCode.bind(this)} />
                    </div>
                </div>
                <div className={'code-box-src ' + (this.state.active ? 'active' : '')} ref='boxSrc'>
                    <Code className='language-jsx'>
                        {`
const Button = require('Button');
const ButtonGroup = require('ButtonGroup');

class Demo extends BaseDemo{

    constructor(props){
        super(props);

        this.state = {
            size: 'default'
        }
    }

    componentDidMount(){
        this.refs.btnGroup.on('select', (btn)=>{
            let size = btn.props['data-size'];
            this.setState({
                size: size
            });
        });
    }

    render(){
        <div>
            <div>
                <ButtonGroup ref='btnGroup'>
                    <Button theme='primary' data-size='small'>Small</Button>
                    <Button theme='primary' active={true} data-size='default'>Default</Button>
                    <Button theme='primary' data-size='large'>Large</Button>
                </ButtonGroup>
            </div>
            <div className='mt-15'>
                <Button theme='primary' size={this.state.size} icon='cloud'></Button>
                <Button theme='primary' size={this.state.size} raised={true} className='ml-10'>Raised</Button>
                <Button theme='primary' size={this.state.size} raised={true} icon='download' className='ml-10'>
                    Download
                </Button>
            </div>
        </div>
    }
}
`}
                    </Code>
                </div>
            </div>
        );
    }
}

module.exports = Demo;
