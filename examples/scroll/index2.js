import React from 'react';
import Scroll from '../../src/components/Scroll';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return <div style={{height: '100%'}}>
            <Scroll style={{height: '100%'}}>
                <div style={{width: 800}}>asdasd</div>
                <div style={{width: 100, height: 100, overflow: 'scroll'}}>
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


                        scrollDown
                        `
                }
                </pre>
            </Scroll>
        </div>;
    }
}

export default Comp;
