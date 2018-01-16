import React from 'react';
import DateTime from '../../src/components/DateTime';
import Button from '../../src/components/Button';
import DateRange from '../../src/components/DateRange';
import Spinner from '../../src/components/Spinner';
import TimePicker from '../../src/components/TimePicker';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        value: '2018-01-16 17:02:00~2018-01-16 17:05:00',
        value1: '2018-01-16'
    }

    render () {
        return (
            <div>
                <DateTime value={this.state.value1}/>
                <DateRange showTime value={this.state.value} format='YYYY-MM-DD HH:mm:ss' ref={(f) => this.daterange = f}/>
                <TimePicker />

                <Button onClick={() => { this.daterange.setValue('') ; }}>还原</Button>
                <Button onClick={() => { this.setState({value: '2017-01-15 10:02:00~2018-01-16 17:05:00', value1: '2017-12-11'}) ; }}>设置值</Button>
                <Spinner onChange={(v) => { console.log(v); }}/>
            </div>
        );
    }
}
export default Comp;
