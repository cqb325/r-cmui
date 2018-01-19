import React from 'react';

import Input from '../../src/components/Input';
import Select from '../../src/components/Select';
import FontIcon from '../../src/components/FontIcon';

class Comp extends React.Component {
    displayName = 'Comp';

    protocal = [{id: 'http', text: 'http://'}, {id: 'https', text: 'https://'}];
    suffix = [{id: 'com', text: '.com'}, {id: 'cn', text: '.cn'}, {id: 'org', text: '.org'}];
    select1 = <Select minWidth={63} data={this.protocal} value='http'></Select>;
    select2 = <Select minWidth={50} data={this.suffix} value='com'></Select>;

    render () {
        return (
            <div style={{padding: 50}}>
                <Input size='large' placeholder='large'/>
                <Input />
                <Input size='small' />

                <div className='mt-30' style={{width: 300}}>
                    <Input addonBefore='http://'/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input addonBefore='http://' addonAfter='.com'/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input addonBefore={this.select1} addonAfter={this.select2}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input size='small' addonBefore={this.select1} addonAfter={this.select2}/>
                </div>
                <div className='mt-30' style={{width: 300}}>
                    <Input size='large' addonBefore={this.select1} addonAfter={this.select2}/>
                </div>
            </div>
        );
    }
}
export default Comp;
