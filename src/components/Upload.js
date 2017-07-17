/**
 * @author cqb 2016-05-01.
 * @module Upload
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import Dom from './utils/Dom';
import FontIcon from './FontIcon';
import grids from './utils/grids';
import FormControl from './FormControl';
const getGrid = grids.getGrid;


/**
 * Upload 类
 * @class Upload
 * @constructor
 * @extend BaseComponent
 */
class Upload extends BaseComponent {
    constructor(props) {
        super(props);

        this.addState({
            fileName: null,
            status: false
        });
    }

    selectedFile(){
        let file = ReactDOM.findDOMNode(this.refs.file);
        let path = file.value;
        let index = path.lastIndexOf('\\');
        path = path.substr(index + 1);
        this.setState({
            fileName: path
        });

        Dom.attr(file, 'title', path);

        if (this.props.onChange) {
            this.props.onChange(path, file);
        }
    }

    getValue(){
        return this.state.fileName;
    }

    render(){
        let {disabled, readOnly, className, style, grid} = this.props;

        className = classNames('cm-upload', className, getGrid(grid), {
            disabled: disabled || readOnly
        });

        let icon = 'upload';

        let txt = this.state.fileName || this.props.placeHolder;
        txt = (<div className='cm-upload-fileName'>{txt}</div>);
        return (
            <div className={className} style={style}>
                <input type='file' name={this.props.name} ref='file'
                    onChange={this.selectedFile.bind(this)} className='cm-upload-pick-helper' />
                <div className='cm-upload-pick-btn'>
                    {txt}
                </div>
                <FontIcon icon={icon} title='上传' ref='uploadBtn' />
            </div>
        );
    }
}

Upload.propTypes = {
    /**
     * 默认选中的值
     * @attribute value
     * @type {String}
     */
    value: PropTypes.string,
    /**
     * 自定义class
     * @attribute className
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * 禁用
     * @attribute disabled
     * @type {Boolean}
     */
    disabled: PropTypes.bool,
    /**
     * 只读
     * @attribute readOnly
     * @type {Boolean}
     */
    readOnly: PropTypes.bool,
    /**
     * 多选状态
     * @attribute multi
     * @type {Boolean}
     */
    multi: PropTypes.bool,
    /**
     * 自定义样式
     * @attribute style
     * @type {Object}
     */
    style: PropTypes.object,
    /**
     * holder文字
     * @attribute placeholder
     * @type {String}
     */
    placeholder: PropTypes.string
};

FormControl.register(Upload, 'file');

export default Upload;
