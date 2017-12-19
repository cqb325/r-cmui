import React from 'react';
import Slider from '../src/components/Slider';
import FormControl from '../src/components/FormControl';
import './App.css';

class Comp extends React.Component {
    displayName = 'Comp';

    render () {
        const marks = {
            0: '0°C',
            26: '26°C',
            37: '37°C',
            100: {
                style: {
                    color: '#f50'
                },
                label: <strong>100°C</strong>
            }
        };
        return (
            <div>
                <div style={{width: '100%', padding: 50}}>
                    asd : <Slider step={1} onChange={(v) => console.log(v)} value={50} tipFormatter={(v) => `$${v}`}/>
                </div>
                <div style={{height: 500, width: 200, padding: 50}}>
                    <Slider marks={marks} vertical range step={1} onChange={(v) => console.log(v)} value={[5, 75]} tipFormatter={(v) => `$${v}`}/>
                </div>
                <div style={{width: 500, padding: 50}}>
                    <FormControl label='asd:' range type='slider' marks={marks} onChange={(v) => console.log(v)} value={[10,50]} tipFormatter={(v) => `$${v}`}/>
                </div>

            </div>
        );
    }
}
export default Comp;
