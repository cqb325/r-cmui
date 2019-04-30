import React from 'react';
import Button from '../../src/components/Button';
import UUID from '../../src/components/utils/UUID';
import LargeSelect from '../../src/components/LargeSelect';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        data: []
    };

    render () {
        return <div style={{padding: 50}}>
            <LargeSelect data={this.state.data} filter hasEmptyOption={false} placeholder='ssss'/>
            <Button onClick={() => {
                // const data = [];
                // for (let i = 0; i < 98; i++) {
                //     data.push({id: i, text: `text${i}`});
                // }
                let data = [
                    'c.com',
                    'cmcdn.cdn.10086.cn',
                    'cmcdn.cdn.10086.com',
                    'jkgkjsa.cin',
                    'test-tt.com',
                    'ywxt.com',
                    'example.cn',
                    'a.b.1',
                    'a.b.c',
                    'd.e',
                    'zhoutest100.com',
                    'cdn.test.com',
                    'ccccdn.test.com',
                    'cc.com',
                    'A.abc.1-2.COM',
                    'a.b.com',
                    'net.cn',
                    'dd.com',
                    'c.cdn.chinamobile.com',
                    'aa.xiaolongxiavip.com',
                    'test.com.xx',
                    'aaaaaa.maomao.cn',
                    'bbbbbbb.jkjk.net',
                    'c.com',
                    'cmcdn.cdn.10086.cn',
                    'cmcdn.cdn.10086.com',
                    'jkgkjsa.cin',
                    'test-tt.com',
                    'ywxt.com',
                    'example.cn',
                    'a.b.1',
                    'a.b.c',
                    'd.e',
                    'zhoutest100.com',
                    'cdn.test.com',
                    'ccccdn.test.com',
                    'cc.com',
                    'A.abc.1-2.COM',
                    'a.b.com',
                    'net.cn',
                    'dd.com',
                    'c.cdn.chinamobile.com',
                    'aa.xiaolongxiavip.com',
                    'test.com.xx',
                    'aaaaaa.maomao.cn',
                    'bbbbbbb.jkjk.net',
                    'c.com',
                    'cmcdn.cdn.10086.cn',
                    'cmcdn.cdn.10086.com',
                    'jkgkjsa.cin',
                    'test-tt.com',
                    'ywxt.com',
                    'example.cn',
                    'a.b.1',
                    'a.b.c',
                    'd.e',
                    'zhoutest100.com',
                    'cdn.test.com',
                    'ccccdn.test.com',
                    'cc.com',
                    'A.abc.1-2.COM',
                    'a.b.com',
                    'net.cn',
                    'dd.com',
                    'c.cdn.chinamobile.com',
                    'aa.xiaolongxiavip.com',
                    'test.com.xx',
                    'aaaaaa.maomao.cn',
                    'bbbbbbb.jkjk.net',
                    'c.com',
                    'cmcdn.cdn.10086.cn',
                    'cmcdn.cdn.10086.com',
                    'jkgkjsa.cin',
                    'test-tt.com',
                    'ywxt.com',
                    'example.cn',
                    'a.b.1',
                    'a.b.c',
                    'd.e'
                ];
                data = data.map(item => {
                    return {id: UUID.v4(), text: item};
                });
                this.setState({data});
            }}>设置数据</Button>

        </div>;
    }
}

export default Comp;
