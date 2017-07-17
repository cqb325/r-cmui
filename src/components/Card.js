/**
 * @author cqb 2017-01-010.
 * @module Card
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';

/**
 * Card 类
 * @class Card
 * @constructor
 * @extend BaseComponent
 */
class Card extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            title: props.title || null,
            content: null
        });
    }

    setTitle(title){
        this.setState({title});
    }

    setContent(content){
        this.setState({content});
    }

    /**
     * 渲染头部
     * @method _renderHeader
     * @private
     */
    _renderHeader(){
        if (!this.props.title && !this.props.tools) {
            return null;
        }

        return (
            <div className='cm-card-head'>
                <h3 className='cm-card-head-title'>{this.state.title}</h3>
                <div className='cm-card-tools'>
                    {this.props.tools}
                </div>
            </div>
        );
    }

    render(){
        let {className, style} = this.props;
        className = classNames('cm-card', className, {
            'cm-card-bordered': this.props.border === undefined ? true : this.props.border
        });

        let head = this._renderHeader();
        let loadding = this.props.loadding;
        let content = null;
        if (loadding && !this.state.content) {
            content = (
                <div>
                    <p className='cm-card-loading-block' style={{width: '94%'}} />
                    <p>
                        <span className='cm-card-loading-block' style={{width: '28%'}} />
                        <span className='cm-card-loading-block' style={{width: '62%'}} />
                    </p>
                    <p>
                        <span className='cm-card-loading-block' style={{width: '22%'}} />
                        <span className='cm-card-loading-block' style={{width: '66%'}} />
                    </p>
                    <p>
                        <span className='cm-card-loading-block' style={{width: '56%'}} />
                        <span className='cm-card-loading-block' style={{width: '39%'}} />
                    </p>
                    <p>
                        <span className='cm-card-loading-block' style={{width: '21%'}} />
                        <span className='cm-card-loading-block' style={{width: '15%'}} />
                        <span className='cm-card-loading-block' style={{width: '40%'}} />
                    </p>
                </div>
            );
        } else {
            content = this.state.content || this.props.children;
        }

        return (
            <div className={className} style={style}>
                {head}
                <div className='cm-card-body' style={this.props.bodyStyle}>
                    {content}
                </div>
            </div>
        );
    }
}

export default Card;
