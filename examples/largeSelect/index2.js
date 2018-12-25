import React from 'react';
import Button from '../../src/components/Button';
import LargeSelect from '../../src/components/LargeSelect';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        data: []
    };

    render () {
        return <div style={{padding: 50}}>
            <LargeSelect data={this.state.data} filter hasEmptyOption placeholder='ssss'/>
            <Button onClick={() => {
                const data = [];
                for (let i = 0; i < 1000000; i++) {
                    data.push({id: i, text: `text${i}`});
                }
                this.setState({data});
            }}>设置数据</Button>

        </div>;
    }
}

export default Comp;
