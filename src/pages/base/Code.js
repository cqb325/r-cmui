import React from 'react';
import Prism from 'prism';

class Code extends React.Component{
    componentDidMount(){
        this._hightlight();
    }

    componentDidUpdate(){
        this._hightlight();
    }

    _hightlight(){
        Prism.highlightElement(this.refs.code, false);
    }

    render(){
        let {className, children} = this.props;
        return (
            <code ref='code' className={className}>
                {children}
            </code>
        );
    }
}

export default Code;
