import React from 'react';

import Scroller from '../../src/components/DateTimePicker/Scroller';
import ScrollDate from '../../src/components/DateTimePicker/ScrollDate';
import ScrollTime from '../../src/components/DateTimePicker/ScrollTime';
import Button from '../../src/components/Button';
import '../../src/components/DateTimePicker/DateTimePicker.less';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return (
            <div style={{padding: 50}}>
                <div className='cm-row'>
                    <Scroller ref={(f) => this.scroller = f} min={2008} max={2028}></Scroller>
                    <Scroller ref={(f) => this.scroller = f} max={12} min={1}></Scroller>
                    <Scroller ref={(f) => this.scroller = f} min={1} max={31}></Scroller>
                </div>

                <div>
                    <ScrollDate ref={(f) => this.scrollDate = f} onChange={(v) => {
                        console.log(v);
                    }}></ScrollDate>
                </div>
                <Button onClick={() => {
                    this.scrollDate.setEndDate('2018-03-05');
                }}>设置END</Button>
                <Button onClick={() => {
                    this.scrollDate.setStartDate('2018-02-05');
                }}>设置START</Button>

                <div>
                    <ScrollTime ref={(f) => this.scrollTime = f} onChange={(v) => {
                        console.log(v);
                    }}></ScrollTime>
                </div>

                <Button onClick={() => {
                    this.scrollTime.setEndTime('23:40:30');
                }}>设置END</Button>
                <Button onClick={() => {
                    this.scrollTime.setStartTime('08:30:00');
                }}>设置START</Button>
            </div>
        );
    }
}
export default Comp;
