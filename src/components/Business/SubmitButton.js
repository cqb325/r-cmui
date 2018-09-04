import React from 'react';
import Button from '../Button';
import MessageBox from '../MessageBox';

class SubmitButton extends React.Component {
    displayName = 'SubmitButton';

    box = null;

    static defaultProps = {
        successTip: '保存成功',
        errorTip: '保存失败'
    }

    onClick = async () => {
        if (this.props.isValid) {
            const ret = this.props.isValid();
            if (ret) {
                if (this.props.onSubmit) {
                    this.btn.setLoading(true);
                    const ret = await this.props.onSubmit();
                    if (ret && ret.success) {
                        const tip = this.props.back ? this.stip : this.tip;
                        tip.show(this.props.successTip);
                        if (this.props.onSuccess) {
                            this.props.onSuccess();
                        }
                    } else {
                        ret.msg
                            ? this.tip.show(`${this.props.errorTip}: ${ret.msg}`)
                            : this.tip.show(this.props.errorTip);
                        if (this.props.onError) {
                            this.props.onError();
                        }
                    }
                    this.btn.setLoading(false);
                }
            }
        }
    }

    goBack = () => {
        window.history.go(-1);
    }

    render () {
        return <span style={{display: 'inline-block'}}>
            <Button {...this.props} onClick={this.onClick} ref={(f) => this.btn = f}>{this.props.children}</Button>
            <div style={{display: 'inline'}}>
                <MessageBox title='提示' ref={(f) => this.tip = f}/>
                {
                    this.props.back
                        ? <MessageBox title='提示' ref={(f) => this.stip = f} confirm={this.goBack}/>
                        : null
                }
            </div>
        </span>;
    }
}

export default SubmitButton;
