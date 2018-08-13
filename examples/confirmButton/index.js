import React from 'react';

import ConfirmButton from '../../src/components/Business/ConfirmButton';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return <div>
            <ConfirmButton theme='primary' tip='确认删除该记录？' data={1} onConfirm={(data) => {
                console.log(data);
            }}>删除</ConfirmButton>
        </div>;
    }
}

export default Comp;
