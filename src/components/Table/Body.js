import React from 'react';
import BaseComponent from '../core/BaseComponent';
import Row from './Row';

/**
 * Body 类
 * @class Body
 * @extend BaseComponent
 */
class Body extends BaseComponent {
    static displayName = 'Body';

    static defaultProps = {
        data: []
    };

    constructor (props) {
        super(props);

        this.addState({
            data: props.data
        });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.data !== this.props.data && nextProps.data !== this.state.data) {
            this.setState({
                data: nextProps.data
            });
        }
    }

    renderData () {
        const data = this.state.data;

        return data.map((row, index) => {
            return <Row row={index} data={row.data} key={row.key} identify={row.key}
                columns={this.props.columns} table={this.props.table} />;
        });
    }

    render () {
        return (
            <tbody>
                {this.renderData()}
            </tbody>
        );
    }
}

export default Body;
