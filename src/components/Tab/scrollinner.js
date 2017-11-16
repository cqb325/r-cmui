import React from 'react';

class ScrollInner extends React.Component {
    displayName = 'ScrollInner';

    static defaultProps = {
        duration: 200
    }

    constructor (props) {
        super(props);

        this.state = {
            activeKey: props.activeKey || this.getDefaultActiveKey()
        };
    }

    getDefaultActiveKey () {
        let activeKey = '';
        React.Children.forEach(this.props.children, (child) => {
            if (!activeKey && child && child.props.identify) {
                activeKey = child.props.identify;
            }
        });
        return activeKey;
    }

    renderChildren () {
        const length = this.props.children.length;
        return React.Children.map(this.props.children, (child) => {
            const style = child.style || {};
            style.width = `${(1 / length) * 100}%`;
            style.float = 'left';
            const props = Object.assign({style}, child.props);
            return React.cloneElement(child, props);
        });
    }

    jump (index) {
        if (this._isMounted) {
            const length = this.props.children.length;
            const x = `${-(index / length) * 100}%`;
            this.refs.scroll.style.transform = `translateX(${x})`;
            this.refs.scroll.style.WebkitTransform = `translateX(${x})`;
        }
    }

    jumpToKey (key) {
        this.setState({
            activeKey: key
        });
    }

    jumpTo () {
        const activeKey = this.state.activeKey;
        let activeIndex = 0;
        React.Children.forEach(this.props.children, (child, index) => {
            activeIndex = child.props.identify === activeKey ? index : activeIndex;
        });

        this.jump(activeIndex);
    }

    componentWillUnmount () {
        this._isMounted = false;
    }
    
    componentDidMount () {
        this._isMounted = true;
        this.jumpTo();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.activeKey !== this.props.activeKey) {
            this.setState({
                activeKey: nextProps.activeKey
            });
        }
    }

    render () {
        const length = this.props.children.length;
        const innerStyle = {
            width: `${length * 100}%`,
            height: '100%',
            transition: `transform ${this.props.duration / 1000}s linear`,
            WebkitTransition: `transform ${this.props.duration / 1000}s linear`
        };
        this.jumpTo();
        return (
            <div className="cm-tab-scroll-wrap" style={{width: '100%', height: '100%'}}>
                <div ref="scroll" className="cm-tab-scroll-inner" style={innerStyle}>
                    {this.renderChildren()}
                </div>
            </div>
        );
    }
}
export default ScrollInner;
