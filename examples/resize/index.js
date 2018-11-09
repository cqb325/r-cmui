import React from 'react';

import ResizeSensor from '../../src/components/ResizeSensor';

class Resize extends React.Component {
    displayName = 'Resize';

    componentDidMount () {
        
    }
    render () {
        return <ResizeSensor ref={(f) => this.div = f} onResize={(d) => {
            console.log(d);
        }} style={{width: '50%', height: 500, background: '#ccc'}}></ResizeSensor>;
    }
}

export default Resize;
