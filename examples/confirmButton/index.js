import React from 'react';

import ConfirmButton from '../../src/components/Business/ConfirmButton';
import SubmitButton from '../../src/components/Business/SubmitButton';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return <div>
            <ConfirmButton theme='primary' tip='确认删除该记录？' data={1} onConfirm={(data) => {
                console.log(data);
            }}>删除</ConfirmButton>

            <SubmitButton theme='primary' back successTip='保存成功' errorTip='保存失败' onClick={async () => {
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
                return {
                    success: true,
                    msg: '错误原因'
                };
            }}>保 存</SubmitButton>
        </div>;
    }
}

export default Comp;
