import React from 'react';
import SimpleListPage from '../../src/components/Business/SimpleListPage';
import Card from '../../src/components/Card';
import Input from '../../src/components/Input';
import Form from '../../src/components/Form';
import FormControl from '../../src/components/FormControl';

class Comp extends React.Component {
    displayName = 'Comp';

    columns = [
        {name: 'profileId', text: '模块名称'},
        {name: 'version', text: '版本'},
        {name: 'desc', text: '模块描述'}
    ];

    render () {
        return (
            <Card className='mt-30'>
                <div className='mb-15'>
                    <Form ref={(f) => this.condition = f} onSubmit={() => {
                        return false;
                    }}>
                        <FormControl name='name' type='text' label='机房名称：' placeholder='输入机房名称'/>
                    </Form>
                </div>
                <SimpleListPage condition={() => this.condition} pagination columns={this.columns} action='http://192.168.105.202:8415/mock/ops-portal/config/module/list'/>
            </Card>
        );
    }
}
export default Comp;
