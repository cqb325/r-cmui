/**
 * 参考https://github.com/sxei/pinyinjs
 */
const dict = {}; // 存储所有字典数据

class PinYin {
    pinyin_dict_firstletter = null;

    pinyin_dict_notone = null;

    pinyin_dict_withtone = null;

    /**
     * 解析各种字典文件，所需的字典文件必须在本JS之前导入
     */
    parseDict (options) {
        // 如果导入了 pinyin_dict_firstletter.js
        if (options.pinyin_dict_firstletter) {
            dict.firstletter = options.pinyin_dict_firstletter;
        }
        // 如果导入了 pinyin_dict_notone.js
        if (options.pinyin_dict_notone) {
            this.pinyin_dict_notone = options.pinyin_dict_notone;
            dict.notone = {};
            dict.py2hz = this.pinyin_dict_notone; // 拼音转汉字
            for (const i in this.pinyin_dict_notone) {
                const temp = this.pinyin_dict_notone[i];
                for (let j = 0, len = temp.length; j < len; j++) {
                    dict.notone[temp[j]] = i; // 不考虑多音字
                }
            }
        }
        // 如果导入了 pinyin_dict_withtone.js
        if (options.pinyin_dict_withtone) {
            this.pinyin_dict_withtone = options.pinyin_dict_withtone;
            dict.withtone = {};
            const temp = this.pinyin_dict_withtone.split(',');
            for (let i = 0, len = temp.length; i < len; i++) {
                // 这段代码耗时28毫秒左右，对性能影响不大，所以一次性处理完毕
                dict.withtone[String.fromCharCode(i + 19968)] = temp[i]; // 这里先不进行split(' ')，因为一次性循环2万次split比较消耗性能
            }

            // 拼音 -> 汉字
            if (this.pinyin_dict_notone) {
                // 对于拼音转汉字，我们优先使用pinyin_dict_notone字典文件
                // 因为这个字典文件不包含生僻字，且已按照汉字使用频率排序
                dict.py2hz = this.pinyin_dict_notone; // 拼音转汉字
            }
            else {
                // 将字典文件解析成拼音->汉字的结构
                // 与先分割后逐个去掉声调相比，先一次性全部去掉声调然后再分割速度至少快了3倍，前者大约需要120毫秒，后者大约只需要30毫秒（Chrome下）
                const notone = PinYin.removeTone(this.pinyin_dict_withtone).split(',');
                const py2hz = {};
                let py, hz;
                for (let i = 0, len = notone.length; i < len; i++) {
                    hz = String.fromCharCode(i + 19968); // 汉字
                    // = aaa[i];
                    py = notone[i].split(' '); // 去掉了声调的拼音数组
                    for (let j = 0; j < py.length; j++) {
                        py2hz[py[j]] = (py2hz[py[j]] || '') + hz;
                    }
                }
                dict.py2hz = py2hz;
            }
        }
    }

    /**
     * 根据汉字获取拼音，如果不是汉字直接返回原字符
     * @param chinese 要转换的汉字
     * @param splitter 分隔字符，默认用空格分隔
     * @param withtone 返回结果是否包含声调，默认是
     * @param polyphone 是否支持多音字，默认否
     */
    getPinyin (chinese, splitter, withtone, polyphone) {
        if (!chinese || /^ +$/g.test(chinese)) { return ''; }
        splitter = splitter == undefined ? ' ' : splitter;
        withtone = withtone == undefined ? false : withtone;
        polyphone = polyphone == undefined ? false : polyphone;
        const result = [];
        if (dict.withtone) { // 优先使用带声调的字典文件
            for (let i = 0, len = chinese.length; i < len; i++) {
                let pinyin = dict.withtone[chinese[i]];
                if (pinyin) {
                    if (!polyphone) { pinyin = pinyin.replace(/ .*$/g, ''); } // 如果不需要多音字
                    if (!withtone) { pinyin = PinYin.removeTone(pinyin); } // 如果不需要声调
                }
                result.push(pinyin || chinese[i]);
            }
        }
        else if (dict.notone) { // 使用没有声调的字典文件
            if (withtone) { console.warn('pinyin_dict_notone 字典文件不支持声调！'); }
            if (polyphone) { console.warn('pinyin_dict_notone 字典文件不支持多音字！'); }
            for (let i = 0, len = chinese.length; i < len; i++) {
                const temp = chinese.charAt(i);
                result.push(dict.notone[temp] || temp);
            }
        } else {
            throw '抱歉，未找到合适的拼音字典文件！';
        }
        if (!polyphone) { return result.join(splitter); }
        else {
            if (this.pinyin_dict_polyphone) { return parsePolyphone(chinese, result, splitter, withtone); }
            else { return handlePolyphone(result, ' ', splitter); }
        }
    }

    /**
     * 获取汉字的拼音首字母
     * @param str 汉字字符串，如果遇到非汉字则原样返回
     * @param polyphone 是否支持多音字，默认false，如果为true，会返回所有可能的组合数组
     */
    getFirstLetter (str, polyphone) {
        polyphone = polyphone == undefined ? false : polyphone;
        if (!str || /^ +$/g.test(str)) { return ''; }
        if (dict.firstletter) { // 使用首字母字典文件
            const result = [];
            for (let i = 0; i < str.length; i++) {
                const unicode = str.charCodeAt(i);
                let ch = str.charAt(i);
                if (unicode >= 19968 && unicode <= 40869) {
                    ch = dict.firstletter.all.charAt(unicode - 19968);
                    if (polyphone) { ch = dict.firstletter.polyphone[unicode] || ch; }
                }
                result.push(ch);
            }
            if (!polyphone) { return result.join(''); } // 如果不用管多音字，直接将数组拼接成字符串
            else { return handlePolyphone(result, '', ''); } // 处理多音字，此时的result类似于：['D', 'ZC', 'F']
        } else {
            let py = this.getPinyin(str, ' ', false, polyphone);
            py = py instanceof Array ? py : [py];
            const result = [];
            for (let i = 0; i < py.length; i++) {
                result.push(py[i].replace(/(^| )(\w)\w*/g, (m, $1, $2) => { return $2.toUpperCase(); }));
            }
            if (!polyphone) { return result[0]; }
            else { return this.simpleUnique(result); }
        }
    }

    /**
     * 拼音转汉字，只支持单个汉字，返回所有匹配的汉字组合
     * @param pinyin 单个汉字的拼音，可以包含声调
     */
    getHanzi (pinyin) {
        if (!dict.py2hz) {
            throw '抱歉，未找到合适的拼音字典文件！';
        }
        return dict.py2hz[PinYin.removeTone(pinyin)] || '';
    }

    /**
     * 获取某个汉字的同音字，本方法暂时有问题，待完善
     * @param hz 单个汉字
     * @param sameTone 是否获取同音同声调的汉字，必须传进来的拼音带声调才支持，默认false
     */
    getSameVoiceWord (hz, sameTone) {
        sameTone = sameTone || false;
        return this.getHanzi(this.getPinyin(hz, ' ', false));
    }

    /**
     * 去除拼音中的声调，比如将 xiǎo míng tóng xué 转换成 xiao ming tong xue
     * @param pinyin 需要转换的拼音
     */
    static removeTone (pinyin) {
        const toneMap = {
            'ā': 'a1',
            'á': 'a2',
            'ǎ': 'a3',
            'à': 'a4',
            'ō': 'o1',
            'ó': 'o2',
            'ǒ': 'o3',
            'ò': 'o4',
            'ē': 'e1',
            'é': 'e2',
            'ě': 'e3',
            'è': 'e4',
            'ī': 'i1',
            'í': 'i2',
            'ǐ': 'i3',
            'ì': 'i4',
            'ū': 'u1',
            'ú': 'u2',
            'ǔ': 'u3',
            'ù': 'u4',
            'ü': 'v0',
            'ǖ': 'v1',
            'ǘ': 'v2',
            'ǚ': 'v3',
            'ǜ': 'v4',
            'ń': 'n2',
            'ň': 'n3',
            '': 'm2'
        };
        return pinyin.replace(/[āáǎàōóǒòēéěèīíǐìūúǔùüǖǘǚǜńň]/g, (m) => { return toneMap[m][0]; });
    }
}


/**
 * 处理多音字，将类似['D', 'ZC', 'F']转换成['DZF', 'DCF']
 * 或者将 ['chang zhang', 'cheng'] 转换成 ['chang cheng', 'zhang cheng']
 */
function handlePolyphone (array, splitter, joinChar) {
    splitter = splitter || '';
    let result = [''], temp = [];
    for (let i = 0; i < array.length; i++) {
        temp = [];
        const t = array[i].split(splitter);
        for (let j = 0; j < t.length; j++) {
            for (let k = 0; k < result.length; k++)
            { temp.push(result[k] + (result[k] ? joinChar : '') + t[j]); }
        }
        result = temp;
    }
    return simpleUnique(result);
}

/**
 * 根据词库找出多音字正确的读音
 * 这里只是非常简单的实现，效率和效果都有一些问题
 * 推荐使用第三方分词工具先对句子进行分词，然后再匹配多音字
 * @param chinese 需要转换的汉字
 * @param result 初步匹配出来的包含多个发音的拼音结果
 * @param splitter 返回结果拼接字符
 */
function parsePolyphone (chinese, result, splitter, withtone) {
    const poly = window.pinyin_dict_polyphone;
    const max = 7; // 最多只考虑7个汉字的多音字词，虽然词库里面有10个字的，但是数量非常少，为了整体效率暂时忽略之
    let temp = poly[chinese];
    if (temp) // 如果直接找到了结果
    {
        temp = temp.split(' ');
        for (let i = 0; i < temp.length; i++) {
            result[i] = temp[i] || result[i];
            if (!withtone) { result[i] = PinYin.removeTone(result[i]); }
        }
        return result.join(splitter);
    }
    for (let i = 0; i < chinese.length; i++) {
        temp = '';
        for (let j = 0; j < max && (i + j) < chinese.length; j++) {
            if (!/^[\u2E80-\u9FFF]+$/.test(chinese[i + j])) { break; } // 如果碰到非汉字直接停止本次查找
            temp += chinese[i + j];
            let res = poly[temp];
            if (res) // 如果找到了多音字词语
            {
                res = res.split(' ');
                for (let k = 0; k <= j; k++) {
                    if (res[k]) { result[i + k] = withtone ? res[k] : PinYin.removeTone(res[k]); }
                }
                break;
            }
        }
    }
    // 最后这一步是为了防止出现词库里面也没有包含的多音字词语
    for (let i = 0; i < result.length; i++) {
        result[i] = result[i].replace(/ .*$/g, '');
    }
    return result.join(splitter);
}

// 简单数组去重
function simpleUnique (array) {
    const result = [];
    const hash = {};
    for (let i = 0; i < array.length; i++) {
        const key = (typeof array[i]) + array[i];
        if (!hash[key]) {
            result.push(array[i]);
            hash[key] = true;
        }
    }
    return result;
}

const py = new PinYin();
py.dict = dict;

export default py;
