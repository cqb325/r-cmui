import React from 'react';
import BaseDemo from '../base/BaseDemo';
import {FontIcon, CheckBoxGroup} from '../../components';
import Code from '../base/Code';

class Demo extends BaseDemo{
    render(){
        return (
            <div>
                <div className='code-box-demo'>
                    <CheckBoxGroup url='../assets/data/checkData.json' value='0' valueField='type' textField='name' />
                </div>
                <div className='code-box-desc'>
                    <div className='code-box-title'>从数据源生成</div>
                    <div>
                        checkbox组 可以通过获取数据源数据生成复选框组 。
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
const CheckBoxGroup = require('CheckBoxGroup');

ReactDOM.render(
<div>
    <CheckBoxGroup url='data.json' value='0' valueField='type' textField='name'></CheckBoxGroup>
</div>, mountNode);
`}
                    </Code>
                </div>
            </div>
        );
    }
}

module.exports = Demo;
