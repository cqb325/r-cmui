import React from 'react';
import BaseDemo from '../base/BaseDemo';
import {Button, FontIcon, ButtonGroup} from '../../components';
import Code from '../base/Code';

class Demo extends BaseDemo{
    render(){
        return (
            <div>
                <div className='code-box-demo'>
                    <div>
                        <ButtonGroup circle>
                            <Button>Default</Button>
                            <Button>Default</Button>
                            <Button>Default</Button>
                        </ButtonGroup>
                    </div>
                    <div className='mt-15'>
                        <ButtonGroup>
                            <Button theme='primary' icon='cloud' />
                            <Button theme='primary' icon='cloud' />
                            <Button theme='primary' icon='cloud' />
                        </ButtonGroup>
                    </div>
                    <div className='mt-15'>
                        <ButtonGroup>
                            <Button theme='primary' icon='angle-left'>Go back</Button>
                            <Button theme='primary' icon='angle-right' iconAlign='right'>Go forward</Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className='code-box-desc'>
                    <div className='code-box-title'>按钮组</div>
                    <div>
                        可以将多个 Button 放入 ButtonGroup 的容器中。
                        <FontIcon icon={'chevron-circle-down'}
                            ref='collapse' className={'code-box-src ' + (this.state.active ? 'active' : '')}
                            onClick={this.openCloseCode.bind(this)}
                        />
                    </div>
                </div>
                <div className={'code-box-src ' + (this.state.active ? 'active' : '')} ref='boxSrc'>
                    <Code className='language-jsx'>
                        {`
const Button = require('Button');
const ButtonGroup = require('ButtonGroup');

ReactDOM.render(
<div>
    <div>
        <ButtonGroup>
            <Button>Default</Button>
            <Button>Default</Button>
            <Button>Default</Button>
        </ButtonGroup>
    </div>
    <div className='mt-15'>
        <ButtonGroup>
            <Button theme='primary' icon='cloud'></Button>
            <Button theme='primary' icon='cloud'></Button>
            <Button theme='primary' icon='cloud'></Button>
        </ButtonGroup>
    </div>
    <div className='mt-15'>
        <ButtonGroup>
            <Button theme='primary' icon='angle-left'>Go back</Button>
            <Button theme='primary' icon='angle-right' iconAlign='right'>Go forward</Button>
        </ButtonGroup>
    </div>
</div>, mountNode);
`}
                    </Code>
                </div>
            </div>
        );
    }
}

module.exports = Demo;
