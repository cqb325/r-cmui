/**
 * @author cqb 2017-01-05.
 * @module Steps
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import Dom from '../utils/Dom';
import FontIcon from '../FontIcon/index';
import './Steps.less';

/**
 * Steps 类
 * @class Steps
 * @constructor
 * @extend BaseComponent
 */
class Steps extends BaseComponent {
    static displayName = 'Steps';
    static defaultProps = {
        current: 0
    };
    constructor (props) {
        super(props);

        this.addState({
            current: props.current
        });

        this.steps = [];
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.current !== this.props.current && nextProps.current !== this.state.current) {
            this.setState({
                current: nextProps.current
            });
        }
    }

    componentDidMount () {
        if (this.props.layout !== 'vertical') {
            const w = this.steps.length === 1 ? '100%' : `${1 / (this.steps.length - 1) * 100}%`;
            const lastWidth = this.steps.length > 1 ? this.steps[this.steps.length - 1].getWidth() : 0;

            this.steps.forEach((step, index) => {
                if (index < this.steps.length - 1) {
                    step.updateStyle({
                        width: w,
                        marginRight: `${-lastWidth / (this.steps.length - 1)}px`
                    });
                }
            });
        }
    }

    bindStep = (step) => {
        this.steps.push(step);
    }

    next () {
        if (this.state.current === this.steps.length - 1) {
            if (this.props.onFinished) {
                this.props.onFinished();
            }
            return;
        }
        if (this.state.current < this.steps.length - 1) {
            const current = this.state.current + 1;
            this.setState({
                current
            });

            if (this.props.onChange) {
                this.props.onChange(current);
            }
        }
    }

    prev () {
        if (this.state.current === 0) {
            return;
        }
        if (this.state.current > 0) {
            const current = this.state.current - 1;
            this.setState({
                current: this.state.current - 1
            });

            if (this.props.onChange) {
                this.props.onChange(current);
            }
        }
    }

    setActive (current) {
        if (current > 0 && current < this.steps.length - 1) {
            if (current !== this.state.current) {
                this.setState({
                    current
                });

                if (this.props.onChange) {
                    this.props.onChange(current);
                }
            }
        }
    }

    renderSteps () {
        let index = 1;
        return React.Children.map(this.props.children, (child) => {
            const componentName = child.type && child.type.displayName ? child.type.displayName : '';
            if (componentName === 'Step') {
                const props = Object.assign({
                    index,
                    current: this.state.current,
                    'bindStep': this.bindStep
                }, child.props);
                index++;

                return React.cloneElement(child, props);
            } else {
                return child;
            }
        });
    }

    render () {
        let {className, style} = this.props;
        className = classNames('cm-steps', className, {
            'cm-steps-small': this.props.size === 'small',
            'cm-steps-vertical': this.props.layout === 'vertical'
        });

        const steps = this.renderSteps();
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
    static displayName = 'Step';
    static defaultProps = {
        description: '',
        title: ''
    };
    constructor (props) {
        super(props);

        this.addState({
            title: props.title,
            description: props.description,
            content: props.content,
            style: {},
            index: props.index,
            current: props.current
        });
    }

    componentDidMount () {
        if (this.props['bindStep']) {
            this.props['bindStep'](this);
        }
    }

    updateStyle (style) {
        window.setTimeout(() => {
            this.setState({style});
        }, 0);
    }

    getWidth () {
        const ele = ReactDOM.findDOMNode(this);
        return Math.ceil(Dom.dom(ele).width()) + 4;
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.current !== this.state.current) {
            this.setState({
                current: nextProps.current
            });
        }
    }

    render () {
        let {className, style} = this.props;
        let status = false;
        if (this.state.current + 1 > this.state.index) {
            status = 'finished';
        }
        if (this.state.current + 1 === this.state.index) {
            status = 'process';
        }

        className = classNames('cm-steps-item', className, {
            'cm-steps-status-finish': status === 'finished',
            'cm-steps-status-process': status === 'process'
        });
        style = Object.assign(this.state.style, style || {});

        let inner = '';
        if (!this.props.icon) {
            if (status === 'finished') {
                inner = <FontIcon icon={'check'} />;
            } else {
                inner = <span>{this.props.index}</span>;
            }
        } else {
            inner = <FontIcon icon={this.props.icon} />;
        }

        return (
            <div className={className} style={style}>
                <div className='cm-step-tail'>
                    <i />
                </div>
                <div className='cm-steps-step'>
                    <div className='cm-step-head'>
                        <div className='cm-step-head-inner'>
                            {inner}
                        </div>
                    </div>
                    <div className='cm-step-main'>
                        <div className='cm-step-title'>{this.state.title}</div>
                        <div className='cm-step-description'>{this.state.description}</div>
                    </div>
                </div>
            </div>
        );
    }
}

Steps.Step = Step;

export default Steps;
