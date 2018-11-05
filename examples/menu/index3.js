import React from 'react';
import Menu from '../../src/components/DataMenu';
import Button from '../../src/components/Button';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        min: false,
        data: [
            {id: '2', text: '菜单项', icon: 'user', disabled:true, link: 'sad'},
            {id: '3', text: '菜单项2', icon: 'user', children: [
                {id: '31', text: '菜单组', group: true, children: [
                    {id: '311', text: '菜单项11', link: 'ssss'}
                ]},
                {id: '312', text: '菜单项312', children: [
                    {id: '3121', text: '菜单项11', link: 'ssss'},
                    {id: '3122', text: '菜单项11', link: 'ssss'},
                    {id: '3123', text: '菜单项11', link: 'ssss'}
                ]}
            ]},
            {id: '4', divider: true},
            {id: '1', text: '菜单', icon: 'user', children: [
                {id: '11', text: '子菜单'}
            ]}]
    }

    render () {
        return <div><Menu ref={f => this.menu = f} min={this.state.min} layout='inline' 
            theme='dark' style={{width: 200}} data={this.state.data}></Menu>
        
        <Button theme='primary' onClick={() => {
            this.menu.disableItem('3');
        }}>禁用</Button>
        <Button theme='primary' onClick={() => {
            this.menu.enableItem('3');
        }}>激活</Button>
        <Button theme='primary' onClick={() => {
            this.menu.activeItem('3121');
        }}>选中</Button>
        <Button theme='primary' onClick={() => {
            this.menu.unActiveItem(this.menu.getActiveKey());
        }}>取消选中</Button>

        <Button theme='primary' onClick={() => {
            this.setState({min: !this.state.min});
        }}>大小</Button>
        </div>;
    }
}

export default Comp;
