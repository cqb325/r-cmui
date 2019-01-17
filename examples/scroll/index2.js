import React from 'react';
import Scroll from '../../src/components/Scroll';
import Button from '../../src/components/Button';

import './style2.less';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return <div style={{height: '100%'}}>
            <Button onClick={() => {
                const d = document.createElement('div');
                d.innerHTML = 'asdasdasdasdasd<br/>';
                this.cont.appendChild(d);
            }}>添加内容</Button>
            <Scroll style={{width: 500, height: 700}} minThumbSize={50}>
                <div style={{width: 800}} ref={(f) => this.cont = f}>asdasd</div>
                <div style={{width: 100, height: 15000, overflow: 'scroll'}}>
                    <div style={{width: 200, height: 200}}></div>
                </div>
                <pre>{
                    `asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddA
                        asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd


                        asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        sss
                        scrollDowns
                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown
                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown
                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown
                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown


                        scrollDown1111
                        `
                }
                </pre>
            </Scroll>
        </div>;
    }
}

export default Comp;
