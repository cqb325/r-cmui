import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Tag from './index';

class Comp extends React.Component {
    displayName = 'Comp';

    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        data: PropTypes.array,
        closable: PropTypes.bool,
        theme: PropTypes.string
    };

    state = {
        data: this.props.data
    };

    renderTags () {
        const data = this.state.data;
        if (!data) {
            return null;
        }

        return data.map((item) => {
            return <Tag data={item} onClose={this.onRemoveTag} key={item.id} badge={item.badge} closable={this.props.closable} theme={this.props.theme}>{item.text}</Tag>;
        });
    }

    onRemoveTag = (tag, e) => {
        let id = tag.props.data.id;
        this.removeTag(id);
    }

    /**
     * 添加一个标签
     */
    addTag (tag) {
        const data = this.state.data;
        data.push(data);
        this.setState({
            data
        });
    }

    /**
     * 删除一个标签
     */
    removeTag (id) {
        let data = this.state.data;
        let removedItem = null;
        data = data.filter((item)=>{
            if (item.id === id) {
                removedItem = item;
            }
            return item.id !== id;
        });
        this.setState({
            data
        }, ()=>{
            if (this.props.onRemove) {
                this.props.onRemove(removedItem);
            }
        });
    }

    /**
     * 获取数据
     */
    getData () {
        return this.state.data;
    }

    /**
     * 获取id
     */
    getIds () {
        if(!this.state.data){
            return null;
        }
        return this.state.data.map((item) => {
            return item.id;
        });
    }

    render () {
        const {className, style} = this.props;
        const clazzName = classNames('cm-tags', className);
        return (
            <div className={clazzName} style={style}>
                {this.renderTags()}
            </div>
        );
    }
}
export default Comp;
