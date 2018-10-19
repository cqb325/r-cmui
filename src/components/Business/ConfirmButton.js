import React from 'react';
import Button from '../Button';
import MessageBox from '../MessageBox';

class ConfirmButton extends React.Component {
    displayName = 'ConfirmButton';

    box = null;

    onClick = async () => {
        let ret = true;
        if (this.props.onBeforeClick) {
            ret = await this.props.onBeforeClick();
        }
        if (ret) {
            this.tip.show(this.props.tip);
        }
    }

    onConfirm = (flag) => {
        if (flag) {
            if (this.props.onConfirm) {
                this.handConfirm();
            }
            return false;
        } else {
            return true;
        }
    }

    /**
     * 处理确定按钮回调
     */
    async handConfirm () {
        let data = this.props.data;
        if (typeof data === 'function') {
            data = data();
        }
        this.tip.showLoading();
        await this.props.onConfirm(data);
        this.tip.hideLoading();
        this.tip.hide();
    }

    render () {
        return <span style={{display: 'inline-block'}}>
            <Button {...this.props} onClick={this.onClick}>{this.props.children}</Button>
            <MessageBox title='提示' ref={(f) => this.tip = f} type='confirm' confirm={this.onConfirm}/>
        </span>;
    }
}

export default ConfirmButton;
