import React from 'react';
import BaseDemo from '../base/BaseDemo';
import {CheckBox, FontIcon} from '../../components';
import Code from '../base/Code';

class Demo extends BaseDemo{
    render(){
        return (
            <div>
                <div className='code-box-demo'>
                    <CheckBox value='0' label='Iphone' />
                    <CheckBox value='1' label='Android' />
                    <CheckBox value='2' label='WinPhone' />
                </div>
                <div className='code-box-desc'>
                    <div className='code-box-title'>基本用法</div>
                    <div>
                        简单的 checkbox
                        <FontIcon
                            icon={'chevron-circle-down'}
                            ref='collapse'
                            className={'collapse ' + (this.state.active ? 'active' : '')}
                            onClick={this.openCloseCode.bind(this)}
                        />
                    </div>
                </div>
                <div className={'code-box-src ' + (this.state.active ? 'active' : '')} ref='boxSrc'>
                    <Code className='language-jsx'>
                        {`
const CheckBox = require('CheckBox');

ReactDOM.render(
<div>
    <CheckBox value='0' label='Iphone'/>
    <CheckBox value='1' label='Android'/>
    <CheckBox value='2' label='WinPhone'/>
</div>, mountNode);
`}
                    </Code>
                </div>
            </div>
        );
    }
}

module.exports = Demo;
