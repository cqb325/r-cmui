import React from 'react';
import Layout from '../../src/components/Layout';
import CloseableContent from '../../src/components/Layout/CloseableContent';
import Button from '../../src/components/Button';
const {Content} = Layout;
import './style3.less';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        open: true
    };

    render () {
        return <Layout style={{height: '100%', flexDirection: 'row', background: '#fff'}}>
            <CloseableContent ref={(f) => this.panel = f} direction='vertical' align='right' title='left'>Left</CloseableContent>
            <Layout style={{flexDirection: 'column', background: '#fff'}}>
                <CloseableContent visible={this.state.open} ref={(f) => this.top = f} title='Top' height={'20%'} maxHeight={200} align='bottom'>Top</CloseableContent>
                <CloseableContent style={{flex: 1}} title='Main' resizeable={false}>
                    <Content>
                        <Button onClick={() => {
                        // this.top.close();
                            this.setState({
                                open: !this.state.open
                            });
                        }}>
                        关闭
                        </Button>
                    </Content>
                </CloseableContent>
                <CloseableContent title='Bottom' height={'20%'} align='top'>Bottom</CloseableContent>
            </Layout>
            <CloseableContent direction='vertical' align='left' title='Right'>Right</CloseableContent>
        </Layout>;
    }
}

export default Comp;
