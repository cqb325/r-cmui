/**
 * @author cqb 2017-01-05.
 * @module ArrowSteps
 */
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import Dom from './utils/Dom';

/**
 * ArrowSteps 类
 * @class ArrowSteps
 * @constructor
 * @extend BaseComponent
 */
class ArrowSteps extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            current: props.current || 0
        });

        this.steps = [];
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.current !== this.state.current) {
            this.setState({
                current: nextProps.current
            });
        }
    }

    componentDidMount(){
        let w = this.steps.length == 1 ? '100%' : 1 / (this.steps.length) * 100 + '%';

        this.steps.forEach((step)=>{
            step.updateStyle({width: w});
        });
    }

    bindStep(step){
        this.steps.push(step);
    }

    next(){
        if (this.state.current == this.steps.length - 1) {
            if (this.props.onFinished) {
                this.props.onFinished();
            }
            return;
        }
        if (this.state.current < this.steps.length - 1) {
            let current = this.state.current + 1;
            this.setState({
                current: current
            });

            if (this.props.onChange) {
                this.props.onChange(current);
            }
        }
    }

    prev(){
        if (this.state.current === 0) {
            return;
        }
        if (this.state.current > 0) {
            let current = this.state.current - 1;
            this.setState({
                current: this.state.current - 1
            });

            if (this.props.onChange) {
                this.props.onChange(current);
            }
        }
    }

    setActive(current){
        if (current > 0 && current < this.steps.length - 1) {
            if (current != this.state.current) {
                this.setState({
                    current: current
                });

                if (this.props.onChange) {
                    this.props.onChange(current);
                }
            }
        }
    }

    renderSteps(){
        let index = 1;
        return React.Children.map(this.props.children, (child)=>{
            let componentName = '';
            if (child.type) {
                if (child.type.name) {
                    componentName = child.type.name;
                } else {
                    let matches = child.type.toString().match(/function\s*([^(]*)\(/);
                    if (matches) {
                        componentName = matches[1];
                    }
                }
            }
            if (componentName === 'Step') {
                let props = Object.assign({
                    index: index,
                    current: this.state.current,
                    'data-bindStep': this.bindStep.bind(this)
                }, child.props);
                index++;

                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    render(){
        let {className, style} = this.props;
        className = classNames('cm-arrow-steps', className, {
            'cm-arrow-steps-small': this.props.size == 'small',
            'cm-arrow-steps-vertical': this.props.layout == 'vertical'
        });

        let steps = this.renderSteps();
        return (
            <div className={className} style={style}>
                {steps}
            </div>
        );
    }
}

/**
 * Step 类
 * @class Step
 * @constructor
 * @extend BaseComponent
 */
class Step extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            title: props.title,
            description: props.description || '',
            content: props.content,
            style: {},
            index: props.index,
            current: props.current
        });
    }

    componentDidMount(){
        if (this.props['data-bindStep']) {
            this.props['data-bindStep'](this);
        }
    }

    updateStyle(style){
        window.setTimeout(()=>{
            this.setState({style});
        }, 0);
    }

    getWidth(){
        let ele = ReactDOM.findDOMNode(this);
        return Math.ceil(Dom.dom(ele).width()) + 4;
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.current !== this.state.current) {
            this.setState({
                current: nextProps.current
            });
        }
    }

    render(){
        let {className, style} = this.props;
        let status = false;
        if (this.state.current + 1 > this.state.index) {
            status = 'finished';
        }
        if (this.state.current + 1 == this.state.index) {
            status = 'process';
        }

        className = classNames('cm-steps-item', {
            'cm-steps-status-finish': status === 'finished',
            'cm-steps-status-process': status === 'process'
        });
        style = Object.assign(this.state.style, style || {});

        return (
            <div className={className} style={style}>
                <div className='cm-steps-step'>
                    <div className='cm-step-main'>
                        <div className='cm-step-title'>{this.state.title}</div>
                        <div className='cm-step-description'>{this.state.description}</div>
                    </div>
                </div>
            </div>
        );
    }
}

ArrowSteps.Step = Step;

export default ArrowSteps;
