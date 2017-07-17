import React from 'react';
import BaseDemo from '../base/BaseDemo';
import {FontIcon, CheckBoxGroup} from '../../components';
import Code from '../base/Code';

class Demo extends BaseDemo{
    render(){
        let groupData = [
            {type: '0', name: 'iPhone'},
            {type: '1', name: 'Android'},
            {type: '2', name: 'WinPhone'}
        ];
        return (
            <div>
                <div className='code-box-demo'>
                    <CheckBoxGroup data={groupData} value='0' valueField='type' textField='name' />

                    <div className='mt-15'>
                        <CheckBoxGroup data={groupData} value='0,1' disabled valueField='type' textField='name' />
                    </div>
                </div>
                <div className='code-box-desc'>
                    <div className='code-box-title'>CheckBox 组 禁用状态</div>
                    <div>
                        checkbox组 通过设置disabled为true 也可以设置禁用状态 。
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
const CheckBoxGroup = require('CheckBoxGroup');

let groupData = [
    {type: '0', name: 'iPhone'},
    {type: '1', name: 'Android'},
    {type: '2', name: 'WinPhone'}
];

ReactDOM.render(
<div>
    <CheckBoxGroup data={groupData} value='0' valueField='type' textField='name'></CheckBoxGroup>
    <CheckBoxGroup data={groupData} value='0,1' disabled={true} valueField='type' textField='name'></CheckBoxGroup>
</div>, mountNode);
`}
                    </Code>
                </div>
            </div>
        );
    }
}

module.exports = Demo;
