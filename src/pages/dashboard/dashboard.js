import React from 'react';
import {
    Button,
    Dialog,
    Dropdown,
    Menu,
    Form,
    FormControl,
    IconButton,
    Logo,
    MessageBox,
    notification,
    Pagination,
    Progress,
    Slick,
    Spin,
    Switch,
    Tab,
    Table,
    Upload
} from '../../components';



class Page extends React.Component{
    open(){
        this.refs.dialog.open();
    }

    openMsg(){
        this.refs.msg.show();
    }

    notification(){
        notification.success({
            title: 'Notification Title',
            desc: 'This is the content of the notification. This is the content of the notification. ' +
                'This is the content of the notification.'
        });
    }

    render(){
        let menu = <Menu>
            <Menu.Item>item1</Menu.Item>
            <Menu.Item>item2</Menu.Item>
            <Menu.Item>退出</Menu.Item>
            <Menu.Item disabled>item4(disabled)</Menu.Item>
        </Menu>;

        return (
            <div>
                <Dialog title='Title' ref='dialog'>
                    <p>asdasdas</p>
                </Dialog>
                <Button theme='primary' onClick={this.open.bind(this)}>asd</Button>


                <Dropdown action='click' overlay={menu}>
                    <a>asd</a>
                </Dropdown>

                <Form method='ajax' layout='stack-inline'>
                    <FormControl label='Input' type='text' name='input' required />
                    <FormControl label='CheckBox' type='checkbox'
                        name='checkbox' data={[{id: '1', text: 'Iphone'}, {id: '2', text: 'Android'}]} />
                    <FormControl label='Radio' type='radio'
                        name='radio' data={[{id: '1', text: 'Iphone'}, {id: '2', text: 'Android'}]} />
                    <FormControl label='Select' type='select'
                        name='select' data={[{id: '1', text: 'Iphone'}, {id: '2', text: 'Android'}]} />
                    <FormControl label='DateTime' type='datetime' name='datetime' />
                    <FormControl label='DateRange' type='daterange' name='daterange' />
                    <FormControl label='InputNumber' type='inputnumber' name='inputnumber' />
                </Form>

                <IconButton style={{fontSize: 15}} icon='save' />

                <Logo />

                <MessageBox title='Tip' msg='msgContent' ref='msg' />
                <Button theme='primary' onClick={this.openMsg.bind(this)}>asd</Button>
                <Button theme='primary' onClick={this.notification.bind(this)}>asd</Button>

                <Pagination current={1} total={1000} pageSize={10} />

                <Progress value={50} type='circle' />

                <Slick current={0} style={{width: 300}}>
                    <Slick.Item>1</Slick.Item>
                    <Slick.Item>2</Slick.Item>
                </Slick>

                <Spin.WaterSpin size={100} percent={50} />

                <Switch />

                <Tab data={[
                    {
                        id: '1',
                        text: 'Tab1',
                        component: <a>asdasd</a>
                    },
                    {
                        id: '2',
                        text: 'Tab2',
                        component: <a>asdasd</a>
                    }
                ]} />


                <Table data={[]} columns={[
                    {type: 'index', text: '#'},
                    {type: 'checkbox', text: '#'},
                    {name: 'a', text: '字段1'}
                ]} />

                <Upload name='file' />

            </div>
        );
    }
}

export default Page;
