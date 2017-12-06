import React from 'react';
import Card from '../../src/components/Card';
import Form from '../../src/components/Form';
import Row from '../../src/components/Row';
import Col from '../../src/components/Col';
import Button from '../../src/components/Button';
import FormControl from '../../src/components/FormControl';

import '../../src/components/Input';
import '../../src/components/FormControl/Label';
import '../../src/components/Switch';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        formData: {
            name1: '1',
            name2: '1',
            name3: 'asdasd',
            name4: '2017-12-01',
            name5: '2017-12-01~2017-12-05',
            name6: '50',
            name7: 1,
            name8: '0'
        }
    };

    reset = () => {
        // this.condition.reset();
        this.setState({
            formData: {
                name1: '1',
                name2: '1',
                name3: 'asdasd',
                name4: '2017-12-01',
                name5: '2017-12-01~2017-12-05',
                name6: '50',
                name7: 1,
                name8: '0'
            }
        });
    }

    setData = () => {
        // this.condition.setData({
        //     name1: '1',
        //     name2: '2',
        //     name3: '222222',
        //     name4: '2017-12-02',
        //     name5: '2017-12-02~2017-12-05',
        //     name6: '100'
        // });

        this.setState({
            formData: {
                name1: '1',
                name2: '2',
                name3: '222222',
                name4: '2017-12-02',
                name5: '2017-12-02~2017-12-05',
                name6: '100',
                name7: 0,
                name8: '1'
            }
        });
    }

    render () {
        return (
            <Card className='mt-30'>
                <Button onClick={this.reset}>重置数据</Button>
                <Button onClick={this.setData}>设置数据</Button>
                <Form ref={(f) => this.condition = f} ajax layout='stack' data={this.state.formData}>
                    <FormControl name='name1' required type='text' label='机房名称：' placeholder='输入机房名称'/>
                    <Form.Row>
                        <FormControl name='name2' required data={['1','2','3']} type='select' label={<span>机房名称：<span className='text-promote'>(xxxxxxxxx)</span></span>} placeholder=''/>
                        <Form.Promote>(xxxxxxxxxxxxxxxxx)</Form.Promote>
                    </Form.Row>
                    <FormControl name='name3' required type='textarea' height={80} label='机房名称：' placeholder='输入机房名称'/>
                    <FormControl name='name4' required type='datetime' label='机房名称：' dateOnly/>
                    <FormControl name='name5' required type='daterange' label='机房名称：'/>
                    <FormControl name='name6' required type='inputnumber' label='机房名称：'/>
                    <FormControl name='name7' required type='switch' label='机房名称：'/>
                    <FormControl name='name8' required type='radio' data={[{id: '0', text: 'radio1'},{id: '1', text: 'radio2'}]} label='机房名称：'/>
                </Form>

                <Form ajax layout='stack' style={{padding: '0 12.5px'}}>
                    <Row gutter={25}>
                        <Col grid={1 / 3}>
                            <FormControl name='name' required type='text' label='机房名称：' placeholder='输入机房名称'/>
                        </Col>
                        <Col grid={1 / 3}>
                            <FormControl name='name' required type='select' label='机房名称：' placeholder=''/>
                        </Col>
                        <Col grid={1 / 3}>
                            <FormControl name='name' required type='datetime' label='机房名称：' dateOnly/>
                        </Col>
                        <Col grid={1 / 3}>
                            <FormControl name='name' required type='daterange' label='机房名称：'/>
                        </Col>
                        <Col grid={1 / 3}>
                            <FormControl name='name' required type='inputnumber' label='机房名称：'/>
                        </Col>
                    </Row>
                </Form>

                <Form ajax layout='inline'>
                    <FormControl name='name' required type='text' label='机房名称：' placeholder='输入机房名称'/>
                    <FormControl name='name' required type='select' label='机房名称：' placeholder=''/>
                    <FormControl name='name' required type='textarea' height={80} label='机房名称：' placeholder='输入机房名称'/>
                    <FormControl name='name' required type='datetime' label='机房名称：' dateOnly/>
                    <FormControl name='name' required type='daterange' label='机房名称：'/>
                </Form>

                <Form ajax layout='inline' style={{padding: '0 12.5px'}} labelWidth={100}>
                    <Row>
                        <FormControl name='name' required type='text' label='机房名称：' placeholder='输入机房名称'/>
                    </Row>
                    <Form.Row>
                        <FormControl name='name' required type='select' label='机房名称：' placeholder=''/>
                        <Form.Promote>(xxxxxxxxxxxxxxxxx)</Form.Promote>
                    </Form.Row>
                    <Row>
                        <FormControl name='name' required type='datetime' label='机房名称：' dateOnly/>
                    </Row>
                    <Row>
                        <FormControl name='name' required type='daterange' label='机房名称：'/>
                    </Row>
                    <Row>
                        <FormControl name='name' required type='inputnumber' label='机房名称：'/>
                    </Row>
                </Form>

                <Form ajax layout='stack-inline' labelWidth={85} tipAlign='topRight'>
                    <FormControl name='name' type='hidden' label='hidden' placeholder='输入机房名称'/>
                    <FormControl name='name' label='机房名称：' type='label' value={'哈哈哈哈'}>
                    </FormControl>
                    <FormControl name='name' required type='text' label='机房名称：' placeholder='输入机房名称'/>
                    <FormControl name='name' required type='select' label='机房名称：' placeholder=''/>
                    <FormControl name='name' required type='textarea' height={80} label='机房名称：' placeholder='输入机房名称'/>
                    <FormControl name='name' required type='datetime' label='机房名称：' dateOnly/>
                    <FormControl name='name' required type='daterange' label='机房名称：'/>
                    <FormControl name='name' required type='inputnumber' label='机房名称：'/>
                </Form>

                <div style={{marginTop: 500}}></div>
            </Card>
        );
    }
}
export default Comp;
