import React from 'react';
import BaseDemo from '../base/BaseDemo';
import {Dialog, FontIcon, Button, Input, FormControl} from '../../components';
import Code from '../base/Code';

class FormContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: 'music'
        };
    }

    changeState(){
        this.setState({
            type: this.state.type === 'music' ? 'video' : 'music'
        });
    }

    render(){
        return (
            <div>
                {this.state.type}
                <Button onClick={this.changeState.bind(this)}>切 换</Button>
            </div>
        );
    }
}

class Demo extends BaseDemo{
    renderForm(){
        return <FormContent />;
    }

    render(){
        return (
            <div>
                <div className='code-box-demo'>
                    <Dialog ref='dialog'>
                        {this.renderForm()}
                    </Dialog>

                    <Button onClick={()=>{ this.refs.dialog.open(); }}>显 示</Button>

                    <Input />

                    <FormControl type='text' />
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

`}
                    </Code>
                </div>
            </div>
        );
    }
}

module.exports = Demo;
