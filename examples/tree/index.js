import React from 'react';
import Tree from '../../src/components/Tree';
import data from './data';
import Button from '../../src/components/Button';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return (
            <div style={{padding: 50}}>
                <div className='mb-20'>
                    <Button onClick={() => {
                        const item = this.tree.getSelectedItem();
                        this.tree.disableItem(item);
                    }}>禁用</Button>

                    <Button onClick={() => {
                        const item = this.tree.getSelectedItem();
                        this.tree.enableItem(item);
                    }}>激活</Button>
                </div>

                <Tree ref={(f) => this.tree = f} data={data} enableSmartDisabled enableCheckbox enableSmartCheckbox/>
            </div>
        );
    }
}
export default Comp;
