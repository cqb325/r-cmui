import React from 'react';
import classNames from 'classnames';
import QR from './qrcode';
const {QRErrorCorrectLevel} = QR;
const QRCodeClazz = QR.QRCode;

class QRCode extends React.Component {
    displayName = 'QRCode';

    static defaultProps = {
        render		: 'canvas',
        width		: 256,
        height		: 256,
        typeNumber	: -1,
        correctLevel	: QRErrorCorrectLevel.H,
        background      : '#ffffff',
        foreground      : '#000000'
    }

    init () {
        const {typeNumber, correctLevel, text, width, height, foreground, background} = this.props;
        const qrcode	= new QRCodeClazz(typeNumber, correctLevel);
        qrcode.addData(text);
        qrcode.make();


        const canvas	= document.createElement('canvas');
        canvas.width	= width;
        canvas.height	= height;
        const ctx		= canvas.getContext('2d');

        const tileW	= width  / qrcode.getModuleCount();
        const tileH	= height / qrcode.getModuleCount();

        // draw in the canvas
        for ( let row = 0; row < qrcode.getModuleCount(); row++ ) {
            for ( let col = 0; col < qrcode.getModuleCount(); col++ ) {
                ctx.fillStyle = qrcode.isDark(row, col) ? foreground : background;
                const w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                const h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                ctx.fillRect(Math.round(col * tileW),Math.round(row * tileH), w, h);  
            }	
        }
        return canvas;
    }

    componentDidMount () {
        this.wrap.appendChild(this.init());
    }

    render () {
        const {className, style} = this.props;
        const clazzName = classNames('cm-qrcode', className);
        return <div className={clazzName} style={style} ref={(f) => this.wrap = f}></div>;
    }
}

export default QRCode;
