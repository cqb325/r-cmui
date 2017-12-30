import React from 'react';
import classNames from 'classnames';
import List from './List';
import Button from '../Button';
import PropTypes from 'prop-types';

import './Transfer.less';

class Transfer extends React.Component {
    displayName = 'Transfer';

    static defaultProps = {
        sourceTitle: 'source',
        targetTitle: 'target',
        transdered: '',
        filter: false
    };

    static propTypes = {
        data: PropTypes.array,
        onChange: PropTypes.func,
        transdered: PropTypes.string,
        sourceTitle: PropTypes.string,
        targetTitle: PropTypes.string,
        filter: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string
    }

    state = {
        sourceDisable: true,
        targetDisable: true
    };

    getData (data, transdered) {
        const keys = transdered.split(',');
        const source = [];
        let target = [];
        if (data) {
            target = data.filter((item) => {
                if (keys.indexOf(item.id) > -1) {
                    return true;
                } else {
                    source.push(item);
                    return false;
                }
            });
        }

        return {source, target};
    }

    sourceChange = () => {
        const value = this.source.getValue();
        this.setState({
            sourceDisable: !value
        });
    }

    targetChange = () => {
        const value = this.target.getValue();
        this.setState({
            targetDisable: !value
        });
    }

    onFilter (type) {
        if (type === 'source') {
            this.sourceChange();
        }
        if (type === 'target') {
            this.targetChange();
        }
    }

    transferRight = () => {
        const checked = this.source.getChecked();
        this.source.removeCheckedData();
        this.target.addData(checked);
    }

    transferLeft = () => {
        const checked = this.target.getChecked();
        this.target.removeCheckedData();
        this.source.addData(checked);
    }

    render () {
        const {className, style} = this.props;
        const clazzName = classNames('cm-transfer', className, {
            'cm-transfer-filter': this.props.filter
        });

        const data = this.getData(this.props.data, this.props.transdered);
        return (
            <div className={clazzName} style={style}>
                <List ref={(f) => this.source = f} 
                    filter={this.props.filter}
                    title={this.props.sourceTitle}
                    data={data.source}
                    onChange={this.sourceChange}
                    onFilter={this.onFilter.bind(this, 'source')}
                />
                <span className='cm-transfer-ops' style={{verticalAlign: 'middle', display: 'inline-block'}}>
                    <div>
                        <Button onClick={this.transferRight} icon='angle-right' font='cmui' theme='primary' disabled={this.state.sourceDisable}></Button>
                    </div>
                    <Button onClick={this.transferLeft} icon='angle-left' font='cmui' theme='primary' disabled={this.state.targetDisable}></Button>
                </span>
                <List ref={(f) => this.target = f} 
                    filter={this.props.filter}
                    title={this.props.targetTitle}
                    data={data.target}
                    onChange={this.targetChange}
                    onFilter={this.onFilter.bind(this, 'target')}
                />
            </div>
        );
    }
}
export default Transfer;
