import React from 'react';
import ReactDOM from 'react-dom';
import BaseDemo from '../base/BaseDemo';
import {CheckBox, FontIcon,CheckBoxGroup} from '../../components';
import Code from '../base/Code';

class Demo extends BaseDemo{
    render(){
        let groupData = [
            {type: "0", name: "iPhone"},
            {type: "1", name: "Android"},
            {type: "2", name: "WinPhone"}
        ];
        return (
            <div>
                <div className="code-box-demo">
                    <CheckBoxGroup data={groupData} value="0,1" valueField="type" textField="name"></CheckBoxGroup>
                </div>
                <div className="code-box-desc">
                    <div className="code-box-title">CheckBox 组</div>
                    <div>
                        checkbox组的例子，从数据源生成checkbox组
                        <FontIcon icon={"chevron-circle-down"} ref="collapse" className={"collapse "+(this.state.active ? "active": "")} onClick={this.openCloseCode.bind(this)}></FontIcon>
                    </div>
                </div>
                <div className={"code-box-src "+(this.state.active ? "active": "")} ref="boxSrc">
                    <Code className="language-jsx">
                        {`
const CheckBox = require("CheckBox");
const CheckBoxGroup = require("CheckBoxGroup");

let groupData = [
    {type: "0", name: "iPhone"},
    {type: "1", name: "Android"},
    {type: "2", name: "WinPhone"}
];

ReactDOM.render(
<div>
    <CheckBoxGroup data={groupData} value="0,1" valueField="type" textField="name"></CheckBoxGroup>
</div>, mountNode);
`}
                    </Code>
                </div>
            </div>
        );
    }
}

module.exports = Demo;