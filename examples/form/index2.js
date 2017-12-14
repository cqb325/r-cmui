import React from 'react';
import Card from '../../src/components/Card';
import Form from '../../src/components/Form';
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

    render () {
        return (
            <Card className='mt-30'>
                <FormControl name='name' stick type='text' label={<i className='fa fa-user'></i>} placeholder='输入机房名称'/>
                <FormControl name='name' stick type='select' label={<i className='fa fa-cny'></i>} placeholder=''/>
                <Form ajax labelWidth={30} tipAlign='topRight' layout='stack-inline'>
                    <FormControl stick name='name' required type='text' label={<i className='fa fa-user'></i>} placeholder='输入机房名称'/>
                    <FormControl stick name='name' required type='select' label={<i className='fa fa-cny'></i>} placeholder=''/>
                    <FormControl stick name='name' required type='textarea' height={80} label={<i className='fa fa-dollar'></i>} placeholder='输入机房名称'/>
                </Form>

                <div style={{marginTop: 500}}></div>
            </Card>
        );
    }
}
export default Comp;
