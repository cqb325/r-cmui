import React from 'react';
import classNames from 'classnames';
import FormControl from './index';

class Label extends React.Component {
    displayName = 'Label';

    state = {
        value: this.props.value || ''
    };

    getValue () {
        return this.state.value;
    }

    setValue (value) {
        this.setState({value});
    }
    
    render () {
        const className = classNames('cm-formcontrol-label', this.props.className);
        return (
            <div className={className}>
                {this.state.value}
            </div>
        );
    }
}

FormControl.register(Label, 'label');

export default Label;
