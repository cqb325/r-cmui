// import React from 'react';
// import Dialog from '../../src/components/Dialog';
// import MessageBox from '../../src/components/MessageBox';
// import Button from '../../src/components/Button';

// class Comp extends React.Component {
//     displayName = 'Comp';

//     state = {
//         title: 'title',
//         content: <div>asdsadas</div>
//     }

//     render () {
//         return <div><div style={{width: 800, height: 600, position: 'relative'}}>
//             <Dialog title={this.state.title} ref={f => this.dialog = f} content={this.state.content}/>
//             <MessageBox title={this.state.title} ref={f => this.tip = f} msg={this.state.content}/>

//             <Button onClick={() => {
//                 this.dialog.open();
//             }}>打开</Button>
//             <Button onClick={() => {
//                 this.tip.show('哈哈哈哈');
//             }}>打开</Button>
//         </div>
//         <Button style={{zIndex: 500000}} onClick={() => {
//             this.setState({
//                 title: '22222'
//             });
//         }}>设置title</Button>
//         <Button style={{zIndex: 500000}} onClick={() => {
//             this.setState({
//                 title: 'msgmsg',
//                 content: <div>AAAAAAA</div>
//             });
//         }}>设置title2</Button>
//         <Button style={{zIndex: 500000}} onClick={() => {
//             this.setState({
//                 content: <div>AAAAAAA</div>
//             });
//         }}>设置Content</Button>
//         </div>;
//     }
// }

// export default Comp;


import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from '../../src/components/Dialog';

const staticize = props =>
    new Promise(() => { // 此处参数需用圆括号，否则 eslint 报错
        const holder = document.createElement('div');
        document.body.appendChild(holder);
        ReactDOM.render(
            <Dialog
                {...props}
            />,
            holder
        );
    });

export default staticize;
