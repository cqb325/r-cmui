import React from 'react';
import Contacts from '../../src/components/Contacts';
import FontIcon from '../../src/components/FontIcon';
import Button from '../../src/components/Button';

class Comp extends React.Component {
    displayName = 'Comp';

    data = {
        // 'A': [{name: '安徽', email: 'asd@asd.com', id: '1'},{name: '安阳', email: 'asd@asd.com', id: '2'}],
        // 'B': [{name: '北京市', email: 'asd@asd.com', id: '北京市'}],
        // 'C': [{name: '重庆市', email: 'asd@asd.com', id: '重庆市'}]
        'F': ['福州市','厦门市','莆田市','三明市','泉州市','漳州市','南平市','龙岩市','宁德市'],
        'G': ['兰州市','嘉峪关市','金昌市','白银市','天水市','武威市','张掖市','平凉市','酒泉市','庆阳市','定西市','陇南市','临夏回族自治州','甘南藏族自治州'],
        'H': ['海口市','三亚市'],
        'J': ['长春市','吉林市','四平市','辽源市','通化市','白山市','松原市','白城市','延边朝鲜族自治州'],
        'L': ['沈阳市','大连市','鞍山市','抚顺市','本溪市','丹东市','锦州市','营口市','阜新市','辽阳市','盘锦市','铁岭市','朝阳市','葫芦岛市'],
        'N': ['呼和浩特市','包头市','乌海市','赤峰市','通辽市','鄂尔多斯市','呼伦贝尔市','巴彦淖尔市','乌兰察布市','兴安盟','锡林郭勒盟','阿拉善盟'],
        'Q': ['西宁市','海东地区','海北藏族自治州','黄南藏族自治州','海南藏族自治州','果洛藏族自治州','玉树藏族自治州','海西蒙古族藏族自治州'],
        'S': ['济南市','青岛市','淄博市','枣庄市','东营市','烟台市','潍坊市','济宁市','泰安市','威海市','日照市','莱芜市','临沂市','德州市','聊城市','滨州市','菏泽市'],
        'T': ['天津市'],
        'X': ['拉萨市','昌都地区','山南地区','日喀则地区','那曲地区','阿里地区','林芝地区'],
        'Y': ['昆明市','曲靖市','玉溪市','保山市','昭通市','丽江市','思茅市','临沧市','楚雄彝族自治州','红河哈尼族彝族自治州','文山壮族苗族自治州','西双版纳傣族自治州','大理白族自治州','德宏傣族景颇族自治州','怒江傈僳族自治州','迪庆藏族自治州'],
        'Z': ['杭州市','宁波市','温州市','嘉兴市','湖州市','绍兴市','金华市','衢州市','舟山市','台州市','丽水市']
    }

    remove (chart, item) {
        alert(`remove:${item}`);
        this.contacts.removeItem(chart, item);
    }

    update (chart, item) {
        alert(`update :${item}`);
        item.name = 'aaaa';
        this.contacts.updateItem(chart, item, item);
    }

    renderItem = (chart, item) => {
        return <dd key={item.id} data-link={chart} className={item._active ? 'active' : ''}>
            {item.name}
            <span className='pull-right'>
                <FontIcon icon='edit' title='编辑' className='mr-5 text-link' onClick={this.update.bind(this, chart, item)}/>
                <FontIcon icon='trash' title='删除' className='text-danger' onClick={this.remove.bind(this, chart, item)}/>
            </span>
        </dd>;
    }

    render () {
        return (
            <div style={{height: 667}} >
                <Button onClick={() => {
                    const list = this.contacts.getSelectedItems();
                    console.log(list);
                }}>选中的节点</Button>
                <Button onClick={() => {
                    this.contacts.addItem('Z', {name: '浙江', email: 'asd@asd.com', id: '浙江'});
                }}>添加节点</Button>
                <Contacts selectable ref={(f) => this.contacts = f } data={this.data} />
            </div>
        );
    }
}
export default Comp;
