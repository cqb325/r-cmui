import React from 'react';
import Card from '../../src/components/Card';
import Form from '../../src/components/Form';
import Button from '../../src/components/Button';
import FormControl from '../../src/components/FormControl';

import '../../src/components/Input';
import '../../src/components/FormControl/Label';
import '../../src/components/Switch';
import '../../src/components/Spinner';
import '../../src/components/RadioGroup';
import '../../src/components/CheckBoxGroup';
import '../../src/components/InputNumber';

import './stick.less';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        type: 'add'
    }

    render () {
        return (
            <Card className='mt-30'>
                <FormControl name='name' group type='text' label={<i className='fa fa-user'></i>} placeholder='输入机房名称'/>
                <FormControl name='name' group type='select' label={<i className='fa fa-cny'></i>} placeholder=''/>
                <Form ajax labelWidth={30} tipAlign='topRight' layout='stack-inline' ref={(f) => this.form = f}>
                    <FormControl name='name1' required type={this.state.type === 'detail' ? 'label' : 'text'} label={<i className='fa fa-user'></i>} placeholder='输入机房名称'/>
                    <FormControl name='name2' required type='select' label={<i className='fa fa-cny'></i>} placeholder=''/>
                    <FormControl rules={{maxLength: this.state.type === 'detail' ? 5 : 10}} name='name3' required type='textarea' height={80} label={<i className='fa fa-dollar'></i>} placeholder='输入机房名称'/>
                </Form>

                <Button onClick={() => {
                    this.form.setData({
                        name1: '1111',
                        name2: '',
                        name3: '222'
                    });
                    this.setState({
                        type: 'detail'
                    });
                }}>动态设置Rule</Button>
                <div style={{marginTop: 500}}></div>
            </Card>
        );
    }
}
export default Comp;
