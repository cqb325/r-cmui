import React from 'react';
import Button from '../Button';
import MessageBox from '../MessageBox';

class ConfirmButton extends React.Component {
    displayName = 'ConfirmButton';

    box = null;

    onClick = () => {
        this.tip.show(this.props.tip);
    }

    onConfirm = (flag) => {
        if (flag) {
            if (this.props.onConfirm) {
                this.props.onConfirm(this.props.data);
            }
        }
        return true;
    }

    render () {
        return <span style={{display: 'inline-block'}}>
            <Button {...this.props} onClick={this.onClick}>{this.props.children}</Button>
            <MessageBox title='提示' ref={(f) => this.tip = f} type='confirm' confirm={this.onConfirm}/>
        </span>;
    }
}

export default ConfirmButton;
