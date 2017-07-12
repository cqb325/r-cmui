import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Layout, Sider, Menu, Card, Form, FormControl,SimpleForm, CheckBox, FontIcon,CheckBoxGroup} from '../../components';
import Data2Form from './data2Form';
const {Header,Footer,Content} = Layout;
const {Item} = Menu;

import Types from '../../types/types';
import './form.scss';

class Page extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            component: 'Form',
            ref: 'Form',
            formData: {
                'Form': {
                    items: [
                        {name: "zz", type: "input", label: "Input"}
                    ]
                }
            }
        }
    }

    switchComponent(comp, ref){
        this.setState({
            component: comp,
            ref
        });
    }

    showProps(){
        let comp = this.state.component;
        let propTypes = Types[comp].types;
        let defaultValues = Types[comp]['default'];
        let lastProps = this.state.formData[this.state.ref];
        defaultValues = Object.assign(defaultValues, lastProps);
        let ret = [];
        for(let key in propTypes){
            ret.push(this.showProp(key, propTypes[key], defaultValues[key]));
        }

        return ret;
    }

    showProp(name, type, val){
        if(type === 'string'){
            return this.showStringProp(name, type, val);
        }
        if(type === 'object'){
            return this.showObjectProp(name, type, val);
        }
        if(type instanceof Array){
            return this.showOneOfProp(name, type, val);
        }
        if(type === 'bool'){
            return this.showBooleanProp(name, type, val);
        }
        //console.log(name, type);
    }

    /**
     *
     * @param  {[type]} name [description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    showStringProp(name, type, defaultValue){
        return (
            <FormControl key={name} value={defaultValue} type='text' name={name} label={name+": "} onChange={this.changeProperty.bind(this, name, 'string')}></FormControl>
        );
    }

    showObjectProp(name, type, defaultValue){
        return (
            <FormControl key={name} value={JSON.stringify(defaultValue)} type='textarea' name={name} label={name+": "} height={50} onChange={this.changeProperty.bind(this, name, 'object')}></FormControl>
        );
    }

    showOneOfProp(name, type, defaultValue){
        let data = type.map((item)=>{
            return {id: item, text: item};
        });
        return (
            <FormControl key={name} value={defaultValue} type='radio' name={name} label={name+": "} data={data} stick onChange={this.changeProperty.bind(this, name, 'string')}></FormControl>
        );
    }

    showBooleanProp(name, type, defaultValue){
        return (
            <FormControl key={name} checked={defaultValue} type='switch' name={name} label={name+": "} size="small" onChange={this.changeProperty.bind(this, name, 'bool')}></FormControl>
        );
    }

    changeProperty(name, type, value, selectItem){
        if(type === 'object'){
            try{
                value = JSON.parse(value);
            }catch(e){
                console.log(e);
            }
        }

        if(type === 'bool'){
            value = !Boolean(value);
        }

        let compProps = this.state.formData[this.state.ref];
        compProps[name] = value;
        this.setState({
            formData: this.state.formData
        });
    }

    onSelectItem(item){
        console.log(item);
    }

    render(){
        return (
            <Layout>
                <Sider>
                    <Menu>
                        <Item>Input</Item>
                        <Item>InputNumber</Item>
                        <Item>Radio</Item>
                        <Item>CheckBox</Item>
                    </Menu>
                </Sider>
                <Content style={{padding: 0}} >
                    <Card title="表单">
                        <div onClick={this.switchComponent.bind(this, 'Form', 'Form')}>
                            <Data2Form data={this.state.formData.Form} onClick={this.onSelectItem.bind(this)}>
                            </Data2Form>
                        </div>
                    </Card>

                </Content>
                <Sider style={{width: 400}}>
                    <Card title="Props">
                        <Form labelWidth={100}>
                            {this.showProps()}
                        </Form>
                    </Card>
                </Sider>
            </Layout>
        );
    }
}

export default Page;
