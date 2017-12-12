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
    
    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
            this.setState({value: nextProps.value});
        }
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
