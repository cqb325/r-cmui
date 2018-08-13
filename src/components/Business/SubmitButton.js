import React from 'react';
import Button from '../Button';
import MessageBox from '../MessageBox';

class SubmitButton extends React.Component {
    displayName = 'SubmitButton';

    box = null;

    onClick = async () => {
        this.btn.setLoading(true);
        if (this.props.onClick) {
            const ret = await this.props.onClick();
            if (ret && ret.success) {
                const tip = this.props.back ? this.stip : this.tip;
                tip.show(this.props.successTip);
            } else {
                ret.msg
                    ? this.tip.show(`${this.props.errorTip}: ${ret.msg}`)
                    : this.tip.show(this.props.errorTip);
            }
        }
        this.btn.setLoading(false);
    }

    onConfirm = (flag) => {
        if (flag) {
            if (this.props.onConfirm) {
                this.props.onConfirm(this.props.data);
            }
        }
        return true;
    }

    goBack = () => {
        window.history.go(-1);
    }

    render () {
        return <span>
            <Button {...this.props} onClick={this.onClick} ref={(f) => this.btn = f}>{this.props.children}</Button>
            <MessageBox title='提示' ref={(f) => this.tip = f}/>
            {
                this.props.back
                    ? <MessageBox title='提示' ref={(f) => this.stip = f} confirm={this.goBack}/>
                    : null
            }
        </span>;
    }
}

export default SubmitButton;
