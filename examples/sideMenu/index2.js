import React from 'react';
import Button from '../../src/components/Button';
import SideMenu from '../../src/components/SideMenu';

class Comp extends React.Component {
    displayName = 'Comp';

    close () {
        this.sideMenu.close();
    }

    open () {
        this.sideMenu.open();
    }

    render () {
        return <div>
            <SideMenu ref={f => this.sideMenu = f} align='right'>
                <Button onClick={this.close.bind(this)}>关闭</Button>
            </SideMenu>

            <div className='pull-right'>
                asdsadasdasdasd
                <div>
                    <Button onClick={this.open.bind(this)}>打开</Button>
                </div>
            </div>
        </div>;
    }
}

export default Comp;
