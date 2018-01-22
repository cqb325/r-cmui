import React from 'react';

import Tag from '../../src/components/Tag';
import Tags from '../../src/components/Tag/Tags';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return (
            <div style={{padding: 50}}>

                asd<Tag closable>asdasd</Tag>
                asd
                <Tag theme='primary' circle closable>asdasd</Tag>
                <Tag theme='danger' circle closable>asdasd</Tag>
                <Tag theme='warning' circle closable>asdasd</Tag>
                <Tag theme='success' closable>asdasd</Tag>
                <Tag theme='info' closable>asdasd</Tag>

                <Tag badge={160}>Desktop</Tag>
                <Tag badge={10}>Desktop</Tag>

                <div>
                    <Tags data={[{id: '1', text: 'asd'},{id: '2', text: 'asd'},{id: '3', text: 'asd'}]} closable theme='primary'/>
                </div>
            </div>
        );
    }
}
export default Comp;
