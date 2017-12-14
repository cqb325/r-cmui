import React from 'react';
import Form from './form/index2.js';
import './App.css';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        console.log('refresh...');
        return (
            <div>
                <Form/>
            </div>
        );
    }
}
export default Comp;
