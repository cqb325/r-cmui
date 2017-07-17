import React from 'react';
import ReactDOM from 'react-dom';
import JSONEditor from 'jsoneditor';

class Messages extends React.Component{
    reset(data){
        this.editor.set(data);
    }

    componentDidMount(){
        var container = ReactDOM.findDOMNode(this.refs.messages);
        var options = {
            mode: 'tree',
            name: 'messages',
            search: false,
            onChange: ()=>{
                if (this.props.onChange){
                    this.props.onChange(this.editor.get());
                }
            }
        };
        this.editor = new JSONEditor(container, options);
    }

    render(){
        return (
            <div ref='messages' style={{height: 200}} />
        );
    }
}

export default Messages;
