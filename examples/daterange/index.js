import React from 'react';
import DateTime from '../../src/components/DateTime';
import DateRange from '../../src/components/DateRange';
import Spinner from '../../src/components/Spinner';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        return (
            <div>
                <DateTime/>
                <DateRange showTime format='YYYY-MM-DD HH:mm:ss'/>
                <Spinner onChange={(v) => { console.log(v); }}/>
            </div>
        );
    }
}
export default Comp;
