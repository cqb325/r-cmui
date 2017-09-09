/**
 * @author cqb 2016-03-24
 * @module 组件核心模块
 */

/**
 * 核心类
 * @class Core
 * @static
 * @constructor
 */
class Core {
    /**
     * 判断一个变量是否为某个类型的数据
     * @param obj
     * @param type
     * @returns {boolean}
     */
    static isType(obj, type) {
        return Object.prototype.toString.apply(obj) === '[object ' + type + ']';
    }

    /**
     * 判断对象是否为数组
     * @param obj
     * @returns {boolean} 是否为数组
     */
    static isArray(obj){
        return Core.isType(obj, 'Array');
    }

    /**
     * 判断对象是否为字符串
     * @param obj
     * @returns {boolean} 是否为字符串
     */
    static isString(obj){
        return Core.isType(obj, 'String');
    }

    /**
     * 判断对象是否为数字
     * @param obj
     * @returns {boolean} 是否为数字
     */
    static isNumber(obj){
        return Core.isType(obj, 'Number');
    }

    /**
     * 判断对象是否为对象
     * @param obj
     * @returns {boolean} 是否为对象
     */
    static isObject(obj){
        return Core.isType(obj, 'Object');
    }

    /**
     * 判断对象是否为空
     * @param obj
     * @returns {boolean} 是否为空
     */
    static isNull(obj){
        return Core.isType(obj, 'Null');
    }

    /**
     * 判断对象是否为未定义
     * @param obj
     * @returns {boolean} 是否为未定义
     */
    static isUndefined(obj){
        return obj === undefined || Core.isType(obj, 'Undefined');
    }

    /**
     * 判断对象是否为函数
     * @param fun
     * @returns {boolean} 是否为函数
     */
    static isFunction(fun){
        return Core.isType(fun, 'Function');
    }

    /**
     * 判断对象是否定义
     * @param obj
     * @returns {boolean}
     */
    static isDefined(obj){
        return !Core.isUndefined(obj);
    }

    /**
     * 克隆数据
     * @param obj {Object} 要克隆的对象
     * @returns {*}
     */
    static clone(obj){
        let o;
        if (typeof obj == 'object') {
            if (obj === null) {
                o = null;
            } else {
                if (Core.isArray(obj)) {
                    o = [];
                    for (let i = 0, len = obj.length; i < len; i++) {
                        o.push(Core.clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (let j in obj) {
                        o[j] = Core.clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    }
}

export default Core;
