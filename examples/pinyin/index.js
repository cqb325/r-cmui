import React from 'react';

import PinYin from '../../src/components/utils/PinYin';
import Select from '../../src/components/Select';

import '../../src/components/utils/PinYinDictFirstLetter';
// import '../../src/components/utils/PinYinDictNoTone';
// import '../../src/components/utils/PinYinDictWithTone';

class Comp extends React.Component {
    displayName = 'Comp';

    renderPinYin () {
        const str = '奥斯卡来得及考拉上担惊受恐垃圾';

        const data = [{id: '1', text: 'a'},{id: '5', text: '浙江'},{id: '6', text: '金华'},{id: '7', text: '杭州'},{id: '2', text: '安徽'},{id: '3', text: '奥斯卡'},{id: '4', text: 'beijing'}];
        const map = {};
        data.forEach((item) => {
            const letter = PinYin.getFirstLetter(item.text.charAt(0));
            item._group = letter.toLowerCase();
            if (map[letter]) {
                map[letter].push(item);
            } else {
                map[letter] = [item];
            }
        });

        for (const k in map) {
            if (/[A-Z]/.test(k)) {
                const key = k.toLowerCase();
                if (map[key]) {
                    map[key] = map[key].concat(map[k]);
                } else {
                    map[key] = map[k];
                }
                delete map[k];
            }
        }

        const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
        let ret = [];
        for (const k in chars) {
            const key = chars[k];
            const arr = map[key];
            if (arr) {
                ret = ret.concat(arr);
            }
        }

        return <div>
            <div>{str}</div>
            <div>{PinYin.getFirstLetter(str)}</div>
            <Select group groupData={this.groupData.bind(this, ret)} filter/>
        </div>;
    }

    groupData = (ret, orign) => {
        return ret;
    }

    render () {
        return (
            <div>
                {this.renderPinYin()}
            </div>
        );
    }
}
export default Comp;
