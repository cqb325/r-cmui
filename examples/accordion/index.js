import React from 'react';
import Accordion from '../../src/components/Accordion';
import Row from '../../src/components/Row';
import Col from '../../src/components/Col';
import Button from '../../src/components/Button';

class Comp extends React.Component {
    displayName = 'Comp';

    state = {
        user: 'user'
    }

    render () {
        return <div>

            <Accordion>
                <Accordion.Item title='title1'>
                    <Row>
                        <Col>
                            {this.state.user}
                        </Col>
                    </Row>
                </Accordion.Item>
                <Accordion.Item title='title2'>
                    asd
                </Accordion.Item>
                <Accordion.Item title='title3'>
                    asd
                </Accordion.Item>
            </Accordion>

            <Button onClick={() => {
                this.setState({
                    user: 'admin'
                });
            }}>改变</Button>
        </div>;
    }
}

export default Comp;
