import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../../actions/login';

class Page extends Component{
    shouldComponentUpdate(nextProps) {
        return nextProps.state != this.props.state;
    }

    doLogin(){
        let {actions} = this.props;
        return actions.login(this.refs.userName.value, this.refs.psw.value);
    }

    render(){
        let {state, actions} = this.props;
        let {isLogining, userInfo} = state;

        return (
            <div className="cm-card cm-card-bordered" style={{width: 300}}>
                <div className="cm-card-head text-center" style={{textAlign: 'center'}}>登 录</div>
                <div className="cm-card-body">
                    <div className="cm-form-group">
                        <span>用户名：</span>
                        <input  ref="userName" className="cm-form-control" value={userInfo.userName} onChange={actions.remenberUserName}/>
                    </div>
                    <div className="cm-form-group">
                        <span>密&nbsp;&nbsp;&nbsp;码：</span>
                        <input ref="psw" type="password" className="cm-form-control"/>
                    </div>

                    <div className="cm-form-group">
                        <button onClick={this.doLogin.bind(this)}>{isLogining ? "正在登录" : "登 录"}</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    state: state.loginState
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Page);
