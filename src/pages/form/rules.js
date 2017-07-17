import React from 'react';
import ReactDOM from 'react-dom';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

class Rules extends React.Component{
    reset(data){
        this.editor.set(data);
    }

    componentDidMount(){
        var container = ReactDOM.findDOMNode(this.refs.rules);
        var options = {
            mode: 'tree',
            name: 'rules',
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
            <div ref='rules' style={{height: 200}} />
        );
    }
}

export default Rules;
