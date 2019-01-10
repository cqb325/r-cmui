import React from 'react';
import Tree from '../../src/components/Tree';
import Button from '../../src/components/Button';
import data2 from './data';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        data: [
            {
                id:'K:/gitgit',
                name: 'gitgit',
                open: 1,
                path: 'K:/gitgit',
                size: 0,
                text: 'gitgit',
                type: 'directory',
                children: [
                    {id: 'K:/gitgit/aaa111', text: 'aaa111', path: 'K:/gitgit/aaa111', name: 'aaa111', children: [
                        {id: '2222', text: '22222'}
                    ], size: 0, type: 'directory'}
                ]
            }
        ],
        treeKey: '111'
    }

    reloadData = () => {
        if (!this.data) {
            const data = [
                {
                    id:'K:/gitgit',
                    name: 'gitgit',
                    open: 1,
                    path: 'K:/gitgit',
                    size: 0,
                    text: 'gitgit',
                    type: 'directory',
                    children: [
                        {id: 'K:/gitgit/aaa111', text: 'aaa111', path: 'K:/gitgit/aaa111', name: 'aaa111', size: 0, type: 'directory', children: [
                            {id: '2222', text: '22222'}
                        ]},
                        {id: 'K:/gitgit/1111', text: '1111', path: 'K:/gitgit/1111', name: '1111', children: Array(0), size: 0, type: 'directory'}
                    ]
                }
            ];
            this.data = data;
        }
        this.tree.setData(this.data);
        this.setState({data: this.data});
    }

    reloadData2 = () => {
        this.tree.setData(data2);
    }

    render () {
        return <div>
            <Button onClick={this.reloadData}>数据</Button>
            <Button onClick={this.reloadData2}>数据2</Button>
            <Button onClick={() => {
                this.tree.addItem('K:/gitgit', {
                    id: 'K:/gitgit/222', text: '222'
                });
            }}>添加节点</Button>
            <Button onClick={() => {
                this.tree.addItem('1', {
                    id: '16', text: 'lib'
                });
            }}>添加节点2</Button>
            <Button onClick={() => {
                this.tree.removeItem('K:/gitgit/1111');
            }}>删除节点</Button>
            <Button onClick={() => {
                this.tree.openItem('14');
            }}>打开节点</Button>

            <div style={{width: 300}}>
                <Tree ref={f => this.tree = f} key={this.state.treeKey} data={this.state.data} enableCheckbox enableSmartCheckbox/>
            </div>
        </div>;
    }
}

export default Comp;
