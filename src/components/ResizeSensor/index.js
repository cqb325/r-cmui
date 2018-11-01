import React from 'react';
import ResizeSensorFactory from '../utils/ResizeSensor';

class ResizeSensor extends React.Component {
    displayName = 'ResizeSensor';

    componentDidMount () {
        ResizeSensorFactory.create(this.div, (d) => {
            if (this.props.onResize) {
                this.props.onResize(d);
            }
        });
    }

    render () {
        return <div className={this.props.className} style={this.props.style} ref={(f) => this.div = f}>
            {this.props.children}
        </div>;
    }
}

export default ResizeSensor;
