import React from 'react';
import ReactDOM from 'react-dom';
import BaseDemo from '../base/BaseDemo';
import {CheckBox, FontIcon} from '../../components';
import Code from '../base/Code';

class Demo extends BaseDemo{
    render(){
        return (
            <div>
                <div className="code-box-demo">
                    <CheckBox value="0" label="Iphone" disabled={true}/>
                    <CheckBox value="1" label="Android" disabled={true} checked={true}/>
                </div>
                <div className="code-box-desc">
                    <div className="code-box-title">禁用状态</div>
                    <div>
                        禁用状态下的checkbox
                        <FontIcon icon={"chevron-circle-down"} ref="collapse" className={"collapse "+(this.state.active ? "active": "")} onClick={this.openCloseCode.bind(this)}></FontIcon>
                    </div>
                </div>
                <div className={"code-box-src "+(this.state.active ? "active": "")} ref="boxSrc">
                    <Code className="language-jsx">
                        {`
const CheckBox = require("CheckBox");

ReactDOM.render(
<div>
    <CheckBox value="0" label="Iphone" disabled={true}/>
    <CheckBox value="1" label="Android" disabled={true} checked={true}/>
</div>, mountNode);
`}
                    </Code>
                </div>
            </div>
        );
    }
}

module.exports = Demo;
