import React from 'react';
import {Label} from '../../components';
import Demo1 from './demo1';
import Demo2 from './demo2';


let Page = React.createClass({

    render(){
        return (
            <div className='main-container'>
                <h1 className='page-h1'>Card 卡片</h1>
                <blockquote className='page-tip'>
                    卡片。
                </blockquote>

                <h1 className='page-h1'>代码演示</h1>

                <Label grid={0.5} className='code-col'>
                    <Label className='code-box'>
                        <Demo1 />
                    </Label>
                </Label>
                <Label grid={0.5} className='code-col'>
                    <Label className='code-box'>
                        <Demo2 />
                    </Label>
                </Label>
            </div>
        );
    }
});

export default Page;
