import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Layout, Sider, Menu, Card, Form, FormControl,SimpleForm, CheckBox, FontIcon,CheckBoxGroup, Button, Utils} from '../../components';
import Data2Form from './data2Form';
import ItemRender from './itemRender';
const {Header,Footer,Content} = Layout;
const {UUID} = Utils;
const {Item} = Menu;

import Types from '../../types/types';
import './form.scss';

class Page extends React.Component{
    constructor(props){
        super(props);

        this.elements = {};
        let formEle = {
            identify: 'form',
            items: []
        };
        this.elements[formEle.identify] = formEle;
        this.state = {
            component: 'Form',
            ref: 'form',
            formData: {
                'Form': formEle
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
        console.log("comp:   "+comp);
        let propTypes = Types[comp].types;
        let defaultValues = Types[comp]['default'];
        let lastProps = this.elements[this.state.ref];

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
        if(type === 'number'){
            return this.showNumberProp(name, type, val);
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
        if(type === 'item'){
            return this.showItemProp(name, type, val);
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

    /**
     *
     * @param  {[type]} name [description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    showNumberProp(name, type, defaultValue){
        return (
            <FormControl key={name} value={defaultValue} type='number' name={name} label={name+": "} onChange={this.changeProperty.bind(this, name, 'string')}></FormControl>
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

    showItemProp(name, type, defaultValue){
        return (
            <ItemRender key={name} name={name}></ItemRender>
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

        let compProps = this.elements[this.state.ref];
        compProps[name] = value;
        this.setState({
            formData: this.state.formData
        });
    }

    onSelectItem(item){
        let type = item.getType();
        window.setTimeout(()=>{
            this.setState({
                component: type,
                ref: item.getIdentify()
            });
        }, 10);

    }

    addInput(){
        let ele = {
            identify: UUID.v4(),
            name: 'input',
            type: 'input',
            label: 'Undefined',
            placeholder: 'InputPlace'
        };
        this.elements[ele.identify] = ele;
        this.state.formData.Form.items.push(ele);
        this.setState({
            formData: this.state.formData,
            component: 'input',
            ref: ele.identify
        });
    }

    addInputNumber(){
        let ele = {
            identify: UUID.v4(),
            name: 'inputnumber',
            type: 'inputnumber',
            label: 'Undefined'
        };
        this.elements[ele.identify] = ele;
        this.state.formData.Form.items.push(ele);
        this.setState({
            formData: this.state.formData,
            component: 'inputnumber',
            ref: ele.identify
        });
    }

    addRadio(){
        let ele = {
            identify: UUID.v4(),
            name: 'radio',
            type: 'radio',
            label: 'Undefined'
        };
        this.elements[ele.identify] = ele;
        this.state.formData.Form.items.push(ele);
        this.setState({
            formData: this.state.formData,
            component: 'radio',
            ref: ele.identify
        });
    }

    getConfig(){
        console.log(this.state.formData.Form);
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

                        <div><Button onClick={this.addInput.bind(this)}>添加Input</Button></div>
                        <div><Button onClick={this.addInputNumber.bind(this)}>添加InputNumber</Button></div>
                        <div><Button onClick={this.addRadio.bind(this)}>添加Radio</Button></div>
                        <div><Button onClick={this.getConfig.bind(this)}>获取结构</Button></div>
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
