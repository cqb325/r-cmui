import React from 'react';

import Transfer from '../../src/components/Transfer/index';

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
        return (
            <div style={{padding: 50}}>
                <Transfer data={data} transdered={transfered} filter/>
            </div>
        );
    }
}
export default Comp;
