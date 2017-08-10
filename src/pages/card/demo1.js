import React from 'react';
import BaseDemo from '../base/BaseDemo';
import {Card, FontIcon, Button} from '../../components';
import Code from '../base/Code';

class Demo extends BaseDemo{
    constructor(props){
        super(props);
        this.state = {
            title: 'Title',
            count: 0
        };
    }

    changeTitle(){
        this.setState({
            title: 'change title'
        });

        // this.refs.card.setTitle('ssss');
    }

    changeState(){
        this.setState({
            count: this.state.count + 1
        });
    }

    render(){
        return (
            <div>
                <div className='code-box-demo'>
                    <Card ref='card' title={this.state.title}>
                        <p>card content</p>
                        <p>card content</p>
                        <p>card content</p>
                        <p>card content</p>
                    </Card>

                    <Button onClick={this.changeTitle.bind(this)} disabled={this.state.count % 2 === 0}>按钮</Button>
                    <Button onClick={this.changeState.bind(this)}>按钮2</Button>
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
