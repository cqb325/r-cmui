/**
 * @author cqb 2016-05-05.
 * @module Loadding
 */

import React from 'react';
import classNames from 'classnames';
import BaseComponent from '../core/BaseComponent';
import './Spin.less';

/**
 * WaterSpin 类
 * @class WaterSpin
 * @constructor
 * @extend BaseComponent
 */
class WaterSpin extends BaseComponent {
    static displayName = 'WaterSpin';

    static defaultProps = {
        size: 250
    };

    constructor(props) {
        super(props);

        this.addState({
            percent: parseFloat(props.percent) || 0,
            spinning: props.spinning || false
        });
    }

    /**
     * 设置百分比
     * @param percent
     */
    setPercent(percent){
        this.setState({percent});
        if (percent === 100) {
            if (this.props.onFinish) {
                this.props.onFinish();
            }
            this.emit('finish');
        }
    }

    /**
     * 获取百分比
     * @returns {number|*|string}
     */
    getPercent(){
        return this.state.percent;
    }

    render(){
        let top = (100 - this.state.percent) + '%';
        let fontSize = this.props.size / 250 * 75;
        return (
            <div className="cm-water-spin-wrap" style={{width: this.props.size, height: this.props.size}}>
                <div className="cm-water-spin-inner">
                    <div className="cm-water-spin-text" style={{
                        fontSize: fontSize,
                        lineHeight: (this.props.size - 10) + 'px'}}>{this.state.percent + '%'}
                    </div>
                    <div className="cm-water-spin" style={{top: top}} />
                    <div className="cm-water-glare" />
                </div>
            </div>
        );
    }
}


/**
 * SVGSpin 类
 * @class SVGSpin
 * @constructor
 * @extend BaseComponent
 */
class SVGSpin extends BaseComponent {
    static displayName = 'SVGSpin';

    constructor(props) {
        super(props);

        this.addState({
            spinning: props.spinning || false
        });
    }

    show(){
        this.setState({
            spinning: true
        });
    }

    hide(){
        this.setState({
            spinning: false
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.spinning !== this.props.spinning) {
            this.setState({
                spinning: nextProps.spinning
            });
        }
    }

    renderSpin(){
        if (this.state.spinning) {
            return (
                <div className="cm-svg-spin-inner">
                    <div className="cm-svg-spin">
                        <svg className="lds-gears" width="32px" height="32px" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                            <g transform="translate(50 50)">
                                <g transform="translate(-19 -19) scale(0.6)">
                                    <g transform="rotate(177)">
                                        <animateTransform attributeName="transform" type="rotate" values="0;360"
                                            keyTimes="0;1" dur="2s" begin="0s" repeatCount="indefinite"
                                        />
                                        <path fill="#20a0ff"
                                            d="M37.3496987939662 -7 L47.3496987939662 -7 L47.3496987939662 7
                                            L37.3496987939662 7 A38 38 0 0 1 31.359972760794346 21.46047782418268
                                            L31.359972760794346 21.46047782418268 L38.431040572659825 28.531545636048154
                                            L28.531545636048154 38.431040572659825 L21.46047782418268 31.359972760794346
                                            A38 38 0 0 1 7.0000000000000036 37.3496987939662
                                            L7.0000000000000036 37.3496987939662 L7.000000000000004 47.3496987939662
                                            L-6.999999999999999 47.3496987939662 L-7 37.3496987939662 A38 38 0 0 1
                                            -21.46047782418268 31.35997276079435 L-21.46047782418268 31.35997276079435
                                            L-28.531545636048154 38.431040572659825 L-38.43104057265982
                                            28.531545636048158 L-31.359972760794346 21.460477824182682 A38 38 0 0 1
                                            -37.3496987939662 7.000000000000007 L-37.3496987939662 7.000000000000007
                                            L-47.3496987939662 7.000000000000008 L-47.3496987939662 -6.9999999999999964
                                            L-37.3496987939662 -6.999999999999997 A38 38 0 0 1 -31.35997276079435
                                            -21.460477824182675 L-31.35997276079435 -21.460477824182675
                                            L-38.431040572659825 -28.531545636048147 L-28.53154563604818
                                            -38.4310405726598 L-21.4604778241827 -31.35997276079433 A38 38 0 0 1
                                            -6.999999999999992 -37.3496987939662 L-6.999999999999992 -37.3496987939662
                                            L-6.999999999999994 -47.3496987939662 L6.999999999999977 -47.3496987939662
                                            L6.999999999999979 -37.3496987939662 A38 38 0 0 1 21.460477824182686
                                            -31.359972760794342 L21.460477824182686 -31.359972760794342
                                            L28.531545636048158 -38.43104057265982 L38.4310405726598 -28.53154563604818
                                            L31.35997276079433 -21.4604778241827 A38 38 0 0 1 37.3496987939662
                                            -6.999999999999995 M0 -23A23 23 0 1 0 0 23 A23 23 0 1 0 0 -23"
                                        />
                                    </g>
                                </g>
                                <g transform="translate(19 19) scale(0.6)">
                                    <g transform="rotate(160.5)">
                                        <animateTransform attributeName="transform" type="rotate" values="360;0"
                                            keyTimes="0;1" dur="2s" begin="-0.125s" repeatCount="indefinite"
                                        />
                                        <path fill="rgba(12.549019607843137%,62.74509803921568%,100%,0.382)"
                                            d="M37.3496987939662 -7 L47.3496987939662 -7 L47.3496987939662 7
                                            L37.3496987939662 7 A38 38 0 0 1 31.359972760794346 21.46047782418268
                                            L31.359972760794346 21.46047782418268 L38.431040572659825 28.531545636048154
                                            L28.531545636048154 38.431040572659825
                                            L21.46047782418268 31.359972760794346 A38 38 0 0 1 7.0000000000000036
                                            37.3496987939662 L7.0000000000000036 37.3496987939662
                                            L7.000000000000004 47.3496987939662 L-6.999999999999999
                                            47.3496987939662 L-7 37.3496987939662 A38 38 0 0 1
                                            -21.46047782418268 31.35997276079435 L-21.46047782418268
                                            31.35997276079435 L-28.531545636048154 38.431040572659825
                                            L-38.43104057265982 28.531545636048158 L-31.359972760794346
                                            21.460477824182682 A38 38 0 0 1 -37.3496987939662 7.000000000000007
                                            L-37.3496987939662 7.000000000000007 L-47.3496987939662 7.000000000000008
                                            L-47.3496987939662 -6.9999999999999964 L-37.3496987939662 -6.999999999999997
                                            A38 38 0 0 1 -31.35997276079435 -21.460477824182675
                                            L-31.35997276079435 -21.460477824182675
                                            L-38.431040572659825 -28.531545636048147
                                            L-28.53154563604818 -38.4310405726598
                                            L-21.4604778241827 -31.35997276079433 A38 38 0 0 1 -6.999999999999992
                                            -37.3496987939662 L-6.999999999999992 -37.3496987939662
                                            L-6.999999999999994 -47.3496987939662 L6.999999999999977 -47.3496987939662
                                            L6.999999999999979 -37.3496987939662 A38 38 0 0 1 21.460477824182686
                                            -31.359972760794342 L21.460477824182686 -31.359972760794342
                                            L28.531545636048158 -38.43104057265982 L38.4310405726598 -28.53154563604818
                                            L31.35997276079433 -21.4604778241827 A38 38 0 0 1 37.3496987939662
                                            -6.999999999999995 M0 -23A23 23 0 1 0 0 23 A23 23 0 1 0 0 -23"
                                        />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div className="cm-svg-spin-text">{this.props.title || 'loading...'}</div>
                </div>
            );
        } else {
            return null;
        }
    }

    render(){
        let className = classNames(this.props.className, 'cm-svg-spin-wrap');
        let containerClassName = classNames('cm-spin-container', {
            'cm-svg-spin-blur': this.state.spinning
        });
        let spin = this.renderSpin();
        return (
            <div className={className}>
                { spin }
                <div className={containerClassName}>{this.props.children}</div>
            </div>
        );
    }
}

let SpinMap = {
    mask:
    <span>
        <div className="cm-mask cm-mask-top">
            <div className="cm-mask-plane" />
        </div>
        <div className="cm-mask cm-mask-middle">
            <div className="cm-mask-plane" />
        </div>
        <div className="cm-mask cm-mask-bottom">
            <div className="cm-mask-plane" />
        </div>
    </span>,

    waves:
    <div className="cm-waves" />
};

/**
 * CssSpin 类
 * @class CssSpin
 * @constructor
 * @extend BaseComponent
 */
class CssSpin extends BaseComponent {
    static displayName = 'CssSpin';

    constructor(props) {
        super(props);

        this.addState({
            spinning: props.spinning || false
        });
    }

    /**
     *
     */
    show(){
        this.setState({
            spinning: true
        });
    }

    /**
     *
     */
    hide(){
        this.setState({
            spinning: false
        });
    }

    /**
     *
     * @returns {*}
     */
    renderSpin(){
        if (this.state.spinning) {
            return (
                <div className="cm-spin-inner">
                    <div className="cm-spin">
                        {SpinMap[this.props.type]}
                    </div>
                    <div className="cm-spin-text">{this.props.title || 'loading...'}</div>
                </div>
            );
        } else {
            return null;
        }
    }

    render(){
        let className = classNames(this.props.className, 'cm-spin-wrap', {
            [`cm-spin-${this.props.type}`]: this.props.type
        });
        let containerClassName = classNames('cm-container', {
            'cm-spin-blur': this.state.spinning
        });
        let spin = this.renderSpin();
        return (
            <div className={className}>
                { spin }
                <div className={containerClassName}>{this.props.children}</div>
            </div>
        );
    }
}

/**
 * GIFSpin 类
 * @class GIFSpin
 * @constructor
 * @extend BaseComponent
 */
class GIFSpin extends BaseComponent {
    static displayName = 'GIFSpin';

    static defaultProps = {
        size: 32
    };

    constructor(props) {
        super(props);

        this.addState({
            spinning: props.spinning || false
        });
    }

    /**
     *
     */
    show(){
        this.setState({
            spinning: true
        });
    }

    /**
     *
     */
    hide(){
        this.setState({
            spinning: false
        });
    }

    /**
     *
     * @returns {*}
     */
    renderSpin(){
        if (this.state.spinning) {
            return (
                <div className="cm-spin-inner">
                    <div className="cm-spin">
                        <img src={this.props.src} width={this.props.size} height={this.props.size} alt="" />
                    </div>
                    <div className="cm-spin-text">{this.props.title || 'loading...'}</div>
                </div>
            );
        } else {
            return null;
        }
    }

    render(){
        let className = classNames(this.props.className, 'cm-spin-wrap', {
            [`cm-spin-${this.props.type}`]: this.props.type
        });
        let containerClassName = classNames('cm-container', {
            'cm-spin-blur': this.state.spinning
        });
        let spin = this.renderSpin();
        return (
            <div className={className}>
                { spin }
                <div className={containerClassName}>{this.props.children}</div>
            </div>
        );
    }
}

export default {WaterSpin, CssSpin, SVGSpin, GIFSpin};
