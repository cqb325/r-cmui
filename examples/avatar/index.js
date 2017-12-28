import React from 'react';
import Avatar from '../../src/components/Avatar';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return (
            <div>
                <div>
                    <Avatar size='large' icon='cube' />
                    <Avatar icon='cube' />
                    <Avatar size='small' icon='cube' />
                </div>
                <div>
                    <Avatar shape='square' size='large' icon='cube' />
                    <Avatar shape='square' icon='cube' />
                    <Avatar shape='square' size='small' icon='cube' />
                </div>
                <div>
                    <Avatar size='large' src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                    <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                    <Avatar>U</Avatar>
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
                    <Avatar style={{ backgroundColor: '#87d068' }} icon='user' />
                </div>
                <div>
                    <Avatar size='large' style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginLeft: 50 }}>Edward</Avatar>
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginLeft: 50 }}>Tomory</Avatar>
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginLeft: 50 }}>List</Avatar>
                </div>
            </div>
        );
    }
}
export default Comp;
