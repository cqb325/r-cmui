import React from 'react';

import QRCode from '../../src/components/QRCode';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return <div>
            <QRCode text='asdasdasd' width={80} height={80} foreground='#ff00ff'/>
        </div>;
    }
}

export default Comp;
