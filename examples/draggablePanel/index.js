import React from 'react';
import classNames from 'classnames';
import Layout from '../../src/components/Layout';
import Button from '../../src/components/Button';
import Dropdown from '../../src/components/Dropdown';
import Select from '../../src/components/Select';
import './style.less';
import Draggable from 'react-draggable';

const {Content} = Layout;

class Panel extends React.Component {
    displayName = 'Panel';

    static defaultProps = {
        height: 50,
        width: 200,
        minHeight: 20,
        maxHeight: false,
        minWidth: 50,
        maxWidth: false,
        direction: 'horizontal',
        align: 'top',
        handlerSize: 6,
        hiddenSize: 0,
        visible: true,
        overHidden: false
    }

    constructor (props) {
        super(props);

        let {style, direction, width, height} = this.props;
        style = style || {};
        if (direction === 'horizontal') {
            style.height = height;
            style.flexDirection = 'column';
        } else {
            style.width = width;
            style.flexDirection = 'row';
        }

        this.state = {
            pos: {x: 0, y: 0},
            style,
            visible: this.props.visible
        };
    }

    handleStop = (e, data) => {
        const {direction, align, minHeight, minWidth, maxHeight, maxWidth} = this.props;
        const style = JSON.parse(JSON.stringify(this.state.style));
        if (direction === 'horizontal') {
            if (align === 'top') {
                style.height = style.height + data.y;
            } else {
                style.height = style.height - data.y;
            }
            style.height = Math.max(minHeight, style.height);
            style.height = maxHeight ? Math.min(maxHeight, style.height) : style.height;
        } else {
            if (align === 'left') {
                style.width = style.width - data.x;
            } else {
                style.width = style.width + data.x;
            }
            style.width = Math.max(minWidth, style.width);
            style.width = maxWidth ? Math.min(maxWidth, style.width) : style.width;
        }
        this.setState({
            style
        }, () => {
            if (this.props.onResize) {
                this.props.onResize();
            }
        });
    }

    componentWillReceiveProps (nextProps) {
        const params = {};
        if (nextProps.visible !== this.props.visible && nextProps.visible !== this.state.visible) {
            params.visible = nextProps.visible;
        }
        if (nextProps.height != this.props.height) {
            params.style = this.state.style;
            params.style.height = nextProps.height;
        }
        this.setState(params);
    }

    renderContent () {
        const {direction, align, handlerSize, visible, overHidden} = this.props;
        const contentStyle = {};
        if (overHidden) {
            contentStyle.overflow = 'hidden';
        }
        const cont = <div key='cont' className='cm-layout-cont' style={contentStyle}
            ref={(f) => this.cont = f}>{this.props.children}</div>;
        const hstyle = {};
        if (direction === 'horizontal') {
            hstyle.height = handlerSize;
            hstyle.width = '100%';
        } else {
            hstyle.width = handlerSize;
            hstyle.height = '100%';
        }

        const handlerClass = classNames('cm-layout-drag-helper', {
            [`cm-layout-drag-${direction}`]: direction,
            'cm-layout-drag-disabled': !visible
        });
        const handler = <Draggable key='handler' 
            axis={direction === 'horizontal' ? 'y' : 'x'}
            position={this.state.pos}
            onStop={this.handleStop}
            disabled={!visible}
            cancel='.cm-layout-drag-track'
        ><div className={handlerClass} style={hstyle}>
                <div className='cm-layout-drag-track' onClick={this.onTrackClick}></div>
            </div></Draggable>;
        if (align === 'top' || align === 'right') {
            return [cont, handler];
        } else {
            return [handler, cont];
        }
    }

    onTrackClick = (e) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (this.state.visible) {
            this.close();
        } else {
            this.open();
        }
    }

    open () {
        this.setState({visible: true}, () => {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
        });
    }

    close () {
        this.setState({visible: false}, () => {
            if (this.props.onClose) {
                this.props.onClose();
            }
        });
    }

    render () {
        let {direction, style, hiddenSize} = this.props;
        style = style || {};
        style = Object.assign(style, this.state.style);
        if (!this.state.visible) {
            if (direction === 'horizontal') {
                // 记住当前的大小
                this.lastSize = style.height;
                style.height = hiddenSize;
            } else {
                this.lastSize = style.width;
                style.width = hiddenSize;
            }
        } else {
            // 打开的时候初始化记住的大小
            if (this.lastSize) {
                if (direction === 'horizontal') {
                    style.height = this.lastSize;
                } else {
                    style.width = this.lastSize;
                }
                this.lastSize = null;
            }
        }
        return <div style={style} className='cm-layout-panel'>
            {this.renderContent()}
        </div>;
    }
}


class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        headVisible: false,
        height: 50
    }

    render () {
        return <Layout style={{height: '100%'}}>
            <Panel hiddenSize={20} ref={(f) => this.head = f} height={this.state.height} maxHeight={100} visible={this.state.headVisible}>
                <Dropdown overlay={<ul><li>1111</li><li>1111</li><li>1111</li><li>1111</li><li>1111</li><li>1111</li></ul>}>
                    <span>admin</span>
                </Dropdown>

                <Select data={['222','223','224','555','666','777','888']}></Select>
                Header<br/>
                Header<br/>
                Header<br/>
                Header

            </Panel>
            <Layout style={{flexDirection: 'row'}}>
                <Panel direction='vertical' align='right'>Left</Panel>
                <Content>
                    <Button onClick={() => {
                        // this.head.open();
                        this.setState({
                            headVisible: !this.state.headVisible
                        });
                    }}>打开</Button>
                    <Button onClick={() => {
                        this.setState({
                            height: 80
                        });
                    }}>80</Button>
                    <Button onClick={() => {
                        this.setState({
                            height: 30
                        });
                    }}>30</Button>
                </Content>
                <Panel direction='vertical' align='left'>Right</Panel>
            </Layout>
            <Panel align='bottom' style={{bottom: 0}}>Bottom</Panel>
        </Layout>;
    }
}

export default Comp;
