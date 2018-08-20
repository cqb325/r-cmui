import React from 'react';

import Transfer from '../../src/components/Transfer/index';
import List from '../../src/components/List';
import AList from './List';
import Avatar from '../../src/components/Avatar';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        const data = [];
        const transfered = '0,1';
        for (let i = 0; i < 15; i++) {
            data.push({
                id: `${i}`,
                text: `item${i}`,
                disabled: Math.random() < 0.3 ? true : false
            });
        }

        const listData = [
            {id: '1', avatar: <Avatar icon='user'/>, content: <div>
                <h4>title</h4>
                <p>Ant Design, a design language for background applications, is refined by Ant UED Team</p>
            </div>, desc: 'desc'},
            {id: '2', content: 'Racing car sprays burning fuel into crowd.', desc: <div><img width={272} alt='logo' src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'/></div>}
        ];
        return (
            <div style={{padding: 50}}>
                <Transfer data={data} transdered={transfered} filter/>

                <div className='mt-30'>
                    <List head='Head' data={listData} border size='large' spinning={false}
                        actions={[<li className='text-link' key='edit' onClick={(data) => console.log(data)}>edit</li>,<li className='text-link' key='more'>more</li>]}
                    />
                </div>

                <div className='mt-30'>
                    <AList data={data} filter/>
                </div>
            </div>
        );
    }
}
export default Comp;
