/**
 * @author cqb 2017-04-14.
 * @module Logo
 */

import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Logo 类
 * @class Logo
 * @constructor
 * @extend BaseComponent
 */
class Logo extends React.Component {
    constructor(props){
        super(props);

        this.WIDTH = this.HEIGHT = props.size || 40;
        this.LOGO_WIDTH = 20, this.gap = 2, this.deg = 0, this.step = 0.01;

        this.ctx = null;
    }

    componentDidMount(){
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        canvas.width = this.WIDTH;
        canvas.height = this.HEIGHT;

        this.ctx = canvas.getContext('2d');

        this.animate();
    }

    animate(){
        this.rotate();
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(()=>{
                this.animate();
            });
        } else {
            window.setTimeout(()=>{
                this.animate();
            }, 10);
        }
    }

    rotate(){
        this.deg = this.deg + this.step;

        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.drawLines();
        this.drawCircle();
    }

    drawLines(){
        let ctx = this.ctx;
        ctx.save();
        ctx.translate(this.WIDTH / 2, this.HEIGHT / 2);
        ctx.rotate(this.deg);
        ctx.beginPath();
        ctx.moveTo(-this.LOGO_WIDTH / 2, -this.gap);
        ctx.lineTo(-this.LOGO_WIDTH / 2, -this.LOGO_WIDTH / 2 - this.gap);
        ctx.lineTo(this.LOGO_WIDTH / 2, -this.LOGO_WIDTH / 2 - this.gap);
        ctx.lineTo(this.LOGO_WIDTH / 2, -this.gap);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#20A0FF';
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(this.WIDTH / 2, this.HEIGHT / 2);
        ctx.rotate(this.deg);
        ctx.beginPath();
        ctx.moveTo(-this.LOGO_WIDTH / 2, this.gap);
        ctx.lineTo(-this.LOGO_WIDTH / 2, this.LOGO_WIDTH / 2 + this.gap);
        ctx.lineTo(this.LOGO_WIDTH / 2, this.LOGO_WIDTH / 2 + this.gap);
        ctx.lineTo(this.LOGO_WIDTH / 2, this.gap);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#13CE66';
        ctx.stroke();
        ctx.restore();
    }

    drawCircle(){
        let ctx = this.ctx;
        ctx.save();
        ctx.translate(this.WIDTH / 2, this.HEIGHT / 2);
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FF4949';
        ctx.stroke();
        ctx.restore();
    }

    render(){
        return <canvas ref='canvas' />;
    }
}

export default Logo;
