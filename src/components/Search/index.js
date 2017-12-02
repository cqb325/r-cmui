import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import Input from '../Input/index';
import './Search.less';

class Search extends BaseComponent {
    displayName = 'Search';

    static defaultProps = {
        width: 170,
        placeholder: '',
        value: '',
        open: false
    };

    state = {
        open: this.props.open
    };

    lastValue = null;

    open = () => {
        window.clearTimeout(this.timer);
        if (!this.state.open) {
            this.setState({open: true});
            this.input.focus();
            return false;
        }

        const value = this.input.getValue();
        if (value) {
            if (this.props.onSearch) {
                this.props.onSearch(value);
            }
            this.emit('search', value);
        }

        this.close();
    }

    close = () => {
        this.timer = window.setTimeout(() => {
            this.setState({open: false});
            this.input.blur();
    
            if (this.props.onClose) {
                this.props.onClose();
            }
            this.emit('close');
        }, 200);
    }

    componentDidMount () {
        if (this.state.open) {
            this.input.focus();
        }
    }

    render () {
        const {className, style} = this.props;
        const clazzName = classNames(className, 'cm-search', {
            'cm-search-open': this.state.open
        });
        return (
            <div className={clazzName} style={style}>
                <i className='fa fa-search' onClick={this.open}></i>
                <Input 
                    ref={(f) => this.input = f}
                    name={this.name} 
                    placeholder={this.props.placeholder}
                    onBlur={this.close}
                    value={this.props.value}
                    style={{width: this.state.open ? this.props.width : 0}}/>
            </div>
        );
    }
}

export default Search;
