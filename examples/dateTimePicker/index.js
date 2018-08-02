import React from 'react';

import Scroller from '../../src/components/ScrollDateTime/Scroller';
import ScrollDate from '../../src/components/ScrollDateTime/ScrollDate';
import ScrollTime from '../../src/components/ScrollDateTime/ScrollTime';
import ScrollDateTime from '../../src/components/ScrollDateTime';
import ScrollDateTimeComp from '../../src/components/ScrollDateTime/ScrollDateTime';
import DateTime from '../../src/components/DateTime';
import Button from '../../src/components/Button';
import TimePicker from '../../src/components/TimePicker';
import DateRange from '../../src/components/DateRange';
import '../../src/components/ScrollDateTime/ScrollDateTime.less';

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

                <div>
                    <ScrollDateTimeComp onChange={(v) => {
                        console.log(v);
                    }}/>
                    <DateTime/>
                    asd : <ScrollDateTime today clear endDate='2018-06-01 12:30:10' value='2018-05-14 11:15:05'
                        onChange={(v) => {
                            console.log(v);
                        }}></ScrollDateTime>
                </div>
                <div>
                    <TimePicker/>
                    <DateRange showTime format='YYYY-MM-DD HH:mm:ss' endDate='2018-08-02 17:30:00'/>
                </div>
            </div>
        );
    }
}
export default Comp;
