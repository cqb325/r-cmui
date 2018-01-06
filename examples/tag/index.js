import React from 'react';

import Tag from '../../src/components/Tag';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return (
            <div style={{padding: 50}}>

                asd<Tag closable>asdasd</Tag>
                asd
                <Tag theme='primary' closable>asdasd</Tag>
                <Tag theme='danger' closable>asdasd</Tag>
                <Tag theme='warning' closable>asdasd</Tag>
                <Tag theme='success' closable>asdasd</Tag>
                <Tag theme='info' closable>asdasd</Tag>

                <Tag badge={160}>Desktop</Tag>
                <Tag badge={10}>Desktop</Tag>
            </div>
        );
    }
}
export default Comp;
