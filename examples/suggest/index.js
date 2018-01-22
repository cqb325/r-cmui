import React from 'react';

import Suggest from '../../src/components/Suggest';
import fetch from '../../src/components/utils/fetch';

class Comp extends React.Component {
    displayName = 'Comp';

    onFilter = async (v) => {
        const ret = await fetch('http://172.18.34.66:8415/mock/ops-portal/monitor/metric/suggest');
        const data = ret.data.map((item) => {
            return {id: item, text: item};
        });
        this.suggest.setData(data);
    }

    componentDidMount () {
        this.onFilter();
    }

    render () {
        return (
            <div>
                <Suggest inputOption value='1' selectItems={{'1': 'asd'}} ref={(f) => this.suggest = f} filter onFilter={this.onFilter} placeholder='输入xxx'/>
            </div>
        );
    }
}
export default Comp;
