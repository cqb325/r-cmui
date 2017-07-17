/**
 * @author cqb 2016-05-01.
 * @module Uploadify
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from './core/BaseComponent';
import PropTypes from 'prop-types';
import Button from './Button';
import Dom from './utils/Dom';
import Dialog from './Dialog';
import MessageBox from './MessageBox';


/**
 * Uploadify 类
 * @class Uploadify
 * @constructor
 * @extend BaseComponent
 */
class Uploadify extends BaseComponent {
    constructor(props) {
        super(props);

        this.buttonText = this.props.buttonText || 'upload';
        this.uploader = null;
        this.params = props.params;
        this.addState({
            files: props.files || []
        });
    }

    getButton(){
        let mode = this.props.mode;
        if (mode === 'grid') {
            return <div className='cm-uploadify-button' ref='button'>
                <span className='cm-uploadify-plus'>+</span>
                <span>{this.buttonText}</span>
            </div>;
        } else {
            return <div className='cm-uploadify-button' ref='button'><Button icon='upload' theme='primary'>
                {this.buttonText}</Button></div>;
        }
    }

    /**
     * 初始化函数
     */
    init(){
        if (this.props.onInit) {
            this.props.onInit();
        }

        this.emit('init');
    }

    /**
     * 开始
     */
    start(){
        this.uploader.start();
    }

    /**
     *
     * @param up
     * @param files
     */
    filesAdded(up, files){
        let arr = this.state.files;
        arr = arr.concat(files);
        this.setState({
            files: arr
        });

        if (this.props.onFilesAdded) {
            let ret = this.props.onFilesAdded(up, files, arr);
            if (ret === false) {
                return false;
            } else {
                if (this.props.auto) {
                    this.start();
                }
            }
        }

        let ret = this.emit('filesAdded', up, files, arr);
        if (ret === false) {
            return false;
        } else {
            if (this.props.auto) {
                this.start();
            }
        }
    }

    /**
     * 进度
     * @param up
     * @param file
     */
    progress(up, file){
        let fileWrap = Dom.dom(Dom.query('#' + file.id));
        let progress = Dom.dom(Dom.query('.cm-uploadify-progress', fileWrap[0]));
        progress.css('width', file.percent + '%');

        if (this.props.onProgress) {
            this.props.onProgress(up, file);
        }

        this.emit('progress', up, file);
    }

    /**
     *
     * @param up
     * @param file
     * @param ret
     */
    fileUploaded(up, file, ret){
        let fileWrap = Dom.dom(Dom.query('#' + file.id));
        if (file.status === 4) {
            fileWrap.addClass('cm-uploadify-failed');
        }
        if (file.status === 5) {
            fileWrap.addClass('cm-uploadify-done');
        }

        if (this.props.onFileUploaded) {
            this.props.onFileUploaded(up, file, ret);
        }

        this.emit('fileUploaded', up, file, ret);
    }

    /**
     *
     * @param up
     * @param files
     */
    uploadComplete(up, files){
        if (this.props.onUploadComplete) {
            this.props.onUploadComplete(up, files);
        }

        this.emit('uploadComplete', up, files);
    }

    /**
     * 报错
     * @param up
     * @param error
     */
    onError(up, error){
        if (this.props.onException) {
            this.props.onException(up, error);
        }

        console.log(error);
        if (error.code === -600) {
            this.refs.msg.show('上传的文件大小超出范围，请重新选择');
        } else {
            this.refs.msg.show(error.message);
        }
        this.emit('exception', up, error);
    }

    /**
     * 删除文件
     * @param file
     */
    removeFile(file){
        this.uploader.removeFile(file);
        let files = this.state.files;
        if (files) {
            files.forEach((f, index)=>{
                if (file.id === f.id) {
                    files.splice(index, 1);
                }
            });
            this.setState({files});
        }

        if (this.props.onRemoveFile) {
            this.props.onRemoveFile(file);
        }
        this.emit('removeFile', file);
    }

    /**
     * 渲染文件
     */
    renderFiles(){
        let files = this.state.files;
        return files.map((file, index)=>{
            return this.renderFile(file, index);
        });
    }

    /**
     * 渲染文件
     * @param file
     * @param index
     */
    renderFile(file, index){
        if (this.props.mode === 'falls') {
            let picture = null;
            if (this.props.thumbnail) {
                picture = <span className='cm-uploadify-thumbnail'>
                    <img ref={'prev_' + file.id} onClick={this.openLightBox.bind(this, file)} />
                </span>;
                this.preloadImage(file);
            } else {
                picture = <i className='fa fa-paperclip mr-5' />;
            }
            return <div className='cm-uploadify-item' key={index} id={file.id}>
                {picture}
                <span className='cm-uploadify-name' title={file.name}>{file.name}</span>
                <i className='fa fa-trash-o cm-uploadify-close' onClick={this.removeFile.bind(this, file)} />
                <div className='cm-uploadify-progress' />
            </div>;
        }

        if (this.props.mode === 'grid') {
            this.preloadImage(file);
            return <div className='cm-uploadify-item' key={index} id={file.id}>
                <span className='cm-uploadify-thumbnail'>
                    <img ref={'prev_' + file.id} />
                </span>
                <i className='fa fa-eye cm-uploadify-view' onClick={this.openLightBox.bind(this, file)} />
                <i className='fa fa-trash-o cm-uploadify-close' onClick={this.removeFile.bind(this, file)} />
                <div className='cm-uploadify-progress' />
            </div>;
        }

        return null;
    }

    /**
     * 打开大图进行预览
     * @param file
     */
    openLightBox(file){
        let img = this.refs['prev_' + file.id];
        if (img) {
            img = ReactDOM.findDOMNode(img);
            let src = img.src;
            var temp = new Image();
            temp.src = src;

            this.refs.lightBox.src = src;
            let w = temp.width;
            let h = temp.height;

            let screenWidth = window.screen.availWidth;
            let screenHeight = window.screen.availHeight;
            let maxWidth = screenWidth / 2;
            let maxHeight = screenHeight * 0.7;
            let imgWidth = w;
            let imgHeight = 0;
            if (w > maxWidth) {
                imgWidth = maxWidth;
            }
            imgHeight = imgWidth / w * h;
            if (imgHeight > maxHeight) {
                imgHeight = maxHeight;
                imgWidth = imgHeight / h * w;
            }

            this.refs.lightBox.width = imgWidth;
            this.refs.lightBox.height = imgHeight;

            this.refs.dialog.setTitle(file.name);
            this.refs.dialog.open(img);
        }
    }

    /**
     * 加载图片
     * @param file
     */
    preloadImage(file){
        let preload = new mOxie.Image();
        preload.onload = ()=> {
            let imgsrc = preload.type === 'image/jpeg'
                ? preload.getAsDataURL('image/jpeg', 80)
                : preload.getAsDataURL(); // 得到图片src,实质为一个base64编码的数据
            let image = ReactDOM.findDOMNode(this.refs['prev_' + file.id]);
            if (image) {
                image.src = imgsrc;
            }
            preload.destroy();
            preload = null;
        };
        preload.load(file.src || file.getSource());
    }

    componentDidMount(){
        let button = ReactDOM.findDOMNode(this.refs.button);
        let {maxSize, mimeTypes} = this.props;
        let uploader = new plupload.Uploader({
            runtimes: 'html5,flash,html4',
            browse_button: button, // you can pass an id...
            url: this.props.url,
            flash_swf_url: requirejs.dir + '/../lib/Moxie.swf',
            file_data_name: this.props.name || 'file',
            filters: {
                max_file_size: maxSize || '2mb',
                mime_types: mimeTypes
            },
            multi_selection: this.props.multi !== undefined ? this.props.multi : true,
            multipart_params: this.params,

            init: {
                PostInit: this.init.bind(this),
                FilesAdded: this.filesAdded.bind(this),
                UploadProgress: this.progress.bind(this),
                FileUploaded: this.fileUploaded.bind(this),
                UploadComplete: this.uploadComplete.bind(this),
                Error: this.onError.bind(this)
            }
        });

        uploader.init();
        this.uploader = uploader;
    }

    /**
     * 设置key/value参数
     * @param params
     */
    setParams(params){
        this.params = params;
        this.uploader.setOption('multipart_params', params);
    }

    render(){
        let {className, mode, style, thumbnail} = this.props;
        className = classNames(className, 'cm-uploadify', {
            [`cm-uploadify-${mode}`]: this.props.mode
        });

        let listClass = classNames('cm-uploadify-list', {
            'cm-uploadify-picture': thumbnail || (mode === 'grid')
        });
        return (
            <div className={className} style={style}>
                {this.getButton()}
                <div className={listClass} ref='list'>
                    {this.renderFiles()}
                </div>
                <Dialog title={' '} ref='dialog'>
                    <img ref='lightBox' className='cm-uploadify-lightbox' />
                </Dialog>
                <MessageBox ref='msg' title='提示' />
            </div>
        );
    }
}


Uploadify.defaultProps = {
    mode: 'falls'
};

Uploadify.propTypes = {
    /**
     * 模式
     * @attribute mode
     * @type {String}
     */
    mode: PropTypes.string
};

export default Uploadify;
