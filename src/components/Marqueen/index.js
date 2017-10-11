import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import './Marqueen.less';

class Marqueen extends BaseComponent{
    static displayName = 'Marqueen';
    static defaultProps = {
        step: 15,
        stepInterval: 400,
        interval: 0,
        dir: 'up',
        autoPlay: true,
        hoverPause: true,
        pausing: false
    };

    constructor(props){
        super(props);

        // 每次滚动的步长(px)
        this.step = props.step;
    
        // 滚动效果执行时间(ms)
        this.stepInterval = props.stepInterval;
    
        // 每次滚动间隔时间(ms)
        this.interval = props.interval;
    
        // 滚动方向，up、down、left、right，默认为"left"
        this.dir = props.dir;
    
        // 是否自动滚动，默认为true
        this.autoPlay = props.autoPlay;
    
        // 是否在鼠标滑过时暂停滚动，默认为true
        this.hoverPause = props.hoverPause;
    
        // 保存暂停状态
        this.pausing = props.pausing;
    
        // 滚动计时器
        this.timerStep = null;
    
        // 滚动间隔计时器
        this.timer = null;
    }

    calcuStyle(){
        let ele = ReactDOM.findDOMNode(this.refs.wrap);

        var childrens = ele.children;

        if(this.dir === 'up' || this.dir === 'down'){
            ReactDOM.findDOMNode(this).style.height = ele.offsetHeight /2 + 'px';
        }
        // 如果是左右滚动就给滚动元素加上宽度
        if (this.dir == 'left' || this.dir == 'right') {
            let totalWidth = 0;
            for(let i = 0; i < childrens.length; i++) {
                if(childrens[i].getBoundingClientRect){
                    let rect = childrens[i].getBoundingClientRect();  
                    let mw = rect.right - rect.left;
                    totalWidth += mw;
                }else{
                    totalWidth += childrens[i].offsetWidth;
                }
            }
            
            ele.style.width = totalWidth + 'px';
            ReactDOM.findDOMNode(this).style.width = totalWidth / 2.0 + 'px';
            ReactDOM.findDOMNode(this).style.height = ele.offsetHeight + 'px';
        }

        // 如果是向右滚动，初始时将滚动元素的left设置为负的自身宽度的一半
        if (this.dir == 'right' && ele.offsetLeft == 0) {
            ele.style.left = -ele.offsetWidth / 2 + 'px';
        }

        // 如果是向左滚动，初始时将滚动元素的left设置为0
        if (this.dir == 'left' && ele.offsetLeft == -ele.offsetWidth / 2) {
            ele.style.left = 0;
        }

        // 如果是向下滚动，初始时将滚动元素的top设置为负的自向高度的一半
        if (this.dir == 'down' && ele.offsetTop == 0) {
            ele.style.top = -ele.offsetHeight / 2 + 'px';
        }

        // 如果是向上滚动，初始时将滚动元素的top设置为0
        if (this.dir == 'up' && ele.offsetTop == -ele.offsetHeight / 2) {
            ele.style.top = 0;
        }
    }

    startScroll() {
        this.timer = window.setInterval(()=> {
            this.doScroll();
        }, this.interval);
    }

    doScroll() {
        var style, offset, target, step, elemSize;
        let ele = ReactDOM.findDOMNode(this.refs.wrap);

        if (this.dir == 'left' || this.dir == 'right') {
            // element.style[ "left" | "top" ]
            style = 'left';
            offset = 'offsetLeft';
            elemSize = ele.offsetWidth / 2;
        } else {
            // element[ offset[Left|Top] ];
            style = 'top';
            offset = 'offsetTop';
            elemSize = ele.offsetHeight / 2;
        }

        step = (this.dir == 'left' || this.dir == 'up') ? -this.step : this.step;

        if (this.stepInterval == 0) {
            // 滚动效果执行时间为0时，进入无缝滚动模式
            if (elemSize - Math.abs(ele[offset]) < Math.abs(step)) {
                step = step / Math.abs(step) * (elemSize - Math.abs(ele[offset]));
            }
            target = ele[offset] + step;
            target = this.fixTarget(step, ele[offset] + step, elemSize);
            ele.style[style] = target + 'px';
        } else {

            if (this.timerStep != null) {return;}

            //先停止掉this.timer，在滚动执行完过后再开启
            this.stop();

            // 将step按stepInterval分割
            var seed = 30 / this.stepInterval * step;
            seed = seed < 0 ? Math.ceil(seed) : Math.floor(seed);

            this.timerStep = window.setInterval(()=> {
                seed = seed > 0 ? Math.min(seed, step) : Math.max(seed, step);

                target = this.fixTarget(seed, ele[offset] + seed, elemSize);
                ele.style[style] = target + 'px';

                step -= seed;
                if (step == 0) {
                    window.clearInterval(this.timerStep);
                    this.timerStep = null;

                    if (this.autoPlay && !this.pausing) {
                        this.startScroll();
                    }
                }
            }, 30);
        }
    }

    /**
     * 修正超出边界的滚动
     * 
     * @param {any} dir 
     * @param {any} target 
     * @param {any} max 
     * @returns 
     * @memberof Marqueen
     */
    fixTarget(dir, target, max) {
        // left or up, 当元素offset=最大滚动值时将offset变为0
        if (dir < 0 && Math.abs(target) >= max) {
            return 0;
        }

        // right or down，当元素offset=0时将offset变为最大滚动值
        if (dir > 0 && target >= 0) {
            return -max;
        }
        return target;
    }

    /**
     * 停止滚动
     * 
     * @memberof Marqueen
     */
    stop() {
        window.clearInterval(this.timer);
    }

    componentDidMount(){
        let ele = ReactDOM.findDOMNode(this.refs.wrap);
        ele.innerHTML += ele.innerHTML;
        this.calcuStyle();

        this.autoPlay && this.startScroll();
    }

    render(){
        let {className, style} = this.props;
        className = classNames('cm-marqueen', className);
        return (
            <div className={className} style={style}>
                <div ref="wrap" className="cm-marqueen-wrap">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Marqueen;

// var Marquee = function (opt) {
//     // 要滚动的元素
//     this.elem = null;

//     // 每次滚动的步长(px)
//     this.step = 0;

//     // 滚动效果执行时间(ms)
//     this.stepInterval = 400;

//     // 每次滚动间隔时间(ms)
//     this.interval = 3000;

//     // 滚动方向，up、down、left、right，默认为"left"
//     this.dir = "left";

//     // 是否自动滚动，默认为true
//     this.autoPlay = true;

//     // 是否在鼠标滑过时暂停滚动，默认为true
//     this.hoverPause = true;

//     // 保存暂停状态
//     this.pausing = false;

//     // 滚动计时器
//     this.timerStep = null;

//     // 滚动间隔计时器
//     this.timer = null;

//     this.init(opt);
// };

// Marquee.prototype = {

//     constructor: Marquee,

//     init: function (opt) {

//         this.extend(opt, this);

//         // 如果元素不存在则直接返回
//         if (!this.elem) return false;

//         // 复制滚动元素内容并填充
//         this.elem.innerHTML += this.elem.innerHTML;

//         this.loadStyle();

//         this.hoverPause && this.bindEvents();

//         this.autoPlay && this.startScroll();
//     },

//     // 初始化滚动元素的样式
//     loadStyle: function () {
//         var childrens = this.elem.children;

//         // 如果是左右滚动就给滚动元素加上宽度
//         if (this.dir == "left" || this.dir == "right") {
//             var totalWidth = 0;
//             for(var i = 0; i < childrens.length; i++) {
//                 totalWidth += childrens[i].offsetWidth;
//             }
//             // this.elem.style.width = childrens[0].offsetWidth * childrens.length + "px";
//             this.elem.style.width = totalWidth + "px";
//         }

//         // 如果是向右滚动，初始时将滚动元素的left设置为负的自身宽度的一半
//         if (this.dir == "right" && this.elem.offsetLeft == 0) {
//             this.elem.style.left = -this.elem.offsetWidth / 2 + "px";
//         }

//         // 如果是向左滚动，初始时将滚动元素的left设置为0
//         if (this.dir == "left" && this.elem.offsetLeft == -this.elem.offsetWidth / 2) {
//             this.elem.style.left = 0;
//         }

//         // 如果是向下滚动，初始时将滚动元素的top设置为负的自向高度的一半
//         if (this.dir == "down" && this.elem.offsetTop == 0) {
//             this.elem.style.top = -this.elem.offsetHeight / 2 + "px";
//         }

//         // 如果是向上滚动，初始时将滚动元素的top设置为0
//         if (this.dir == "up" && this.elem.offsetTop == -this.elem.offsetHeight / 2) {
//             this.elem.style.top = 0;
//         }
//     },

//     // 绑定控制元素的事件
//     bindEvents: function () {
//         var _this = this;

//         // 鼠标移入父级元素时暂停
//         this.bind(this.elem.parentNode, "mouseover", function () {
//             _this.stop();
//             _this.pausing = true;
//         });

//         // 鼠标移出父级元素时重新开始滚动
//         this.bind(this.elem.parentNode, "mouseout", function () {
//             _this.pausing = false;
//             _this.autoPlay && _this.startScroll();
//         });
//     },

//     // 停止滚动
//     stop: function () {
//         clearInterval(this.timer);
//     },

//     // 执行滚动效果
//     doScroll: function () {
//         var _this = this,
//             style, offset, target, step, elemSize;

//         if (this.dir == "left" || this.dir == "right") {
//             // element.style[ "left" | "top" ]
//             style = "left";
//             offset = "offsetLeft";
//             elemSize = this.elem.offsetWidth / 2;
//         } else {
//             // element[ offset[Left|Top] ];
//             style = "top";
//             offset = "offsetTop";
//             elemSize = this.elem.offsetHeight / 2;
//         }

//         step = (this.dir == "left" || this.dir == "up") ? -this.step : this.step;

//         if (this.stepInterval == 0) {
//             // 滚动效果执行时间为0时，进入无缝滚动模式
//             if (elemSize - Math.abs(this.elem[offset]) < Math.abs(step)) {
//                 step = step / Math.abs(step) * (elemSize - Math.abs(this.elem[offset]));
//             }
//             target = this.elem[offset] + step;
//             target = this.fixTarget(step, this.elem[offset] + step, elemSize);
//             this.elem.style[style] = target + "px";

//         } else {

//             if (this.timerStep != null) return;

//             //先停止掉this.timer，在滚动执行完过后再开启
//             this.stop();

//             // 将step按stepInterval分割
//             var seed = 30 / _this.stepInterval * step;
//             seed = seed < 0 ? Math.ceil(seed) : Math.floor(seed);

//             this.timerStep = setInterval(function () {
//                 seed = seed > 0 ? Math.min(seed, step) : Math.max(seed, step);

//                 target = _this.fixTarget(seed, _this.elem[offset] + seed, elemSize);
//                 _this.elem.style[style] = target + "px";

//                 step -= seed;
//                 if (step == 0) {
//                     clearInterval(_this.timerStep);
//                     _this.timerStep = null;

//                     if (_this.autoPlay && !_this.pausing) {
//                         _this.startScroll();
//                     }
//                 }
//             }, 30);
//         }
//     },

//     // 修正超出边界的滚动
//     fixTarget: function (dir, target, max) {
//         // left or up, 当元素offset=最大滚动值时将offset变为0
//         if (dir < 0 && Math.abs(target) >= max) {
//             return 0;
//         }

//         // right or down，当元素offset=0时将offset变为最大滚动值
//         if (dir > 0 && target >= 0) {
//             return -max;
//         }
//         return target;
//     },

//     // 改变方向
//     changeDir: function (dir) {
//         this.dir = dir;
//         this.loadStyle();
//         this.doScroll();
//     },

//     // 开始滚动
//     startScroll: function () {
//         var _this = this;
//         this.timer = setInterval(function () {
//             // _this.loadStyle();
//             _this.doScroll();
//         }, _this.interval);
//     },

//     extend: function (opt, target) {
//         for (name in opt) {
//             target[name] = opt[name];
//         }
//     },

//     //绑定事件方法
//     bind: function (element, type, handler) {
//         if (element.addEventListener) {
//             element.addEventListener(type, handler, false);
//         } else if (element.attachEvent) {
//             element.attachEvent("on" + type, handler);
//         } else {
//             element["on" + type] = hanlder;
//         }
//     }
// };
