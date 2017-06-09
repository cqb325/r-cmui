import React from 'react';
import ReactDOM from 'react-dom';
import {Utils} from '../../components';
const Dom = Utils.Dom;

class BaseDemo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            active: false
        };
    }
    openCloseCode(){
        // var collapse = ReactDOM.findDOMNode(this.refs.collapse);
        // //collapse = Dom.dom(collapse);
        //
        // if(Dom.hasClass(collapse,"active")){
        //     Dom.removeClass(collapse, "active");
        // }else{
        //     Dom.addClass(collapse, "active");
        // }
        //
        // var boxSrc = ReactDOM.findDOMNode(this.refs.boxSrc);
        // Dom.dom(collapse).toggleClass("active");
        this.setState({
            active: !this.state.active
        });
    }
}

export default BaseDemo;
