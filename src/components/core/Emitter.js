/**
 * @author cqb 2016-03-28.
 * @module event emitter
 */

import PropTypes from 'prop-types';
import Core from '../Core';

const defaultMaxListeners = 10;

/**
 *
 * @param target
 * @param objs
 * @returns {*}
 * @private
 */
function inherits(target, ...objs) {
    for (var i = 0, l = objs.length; i < l; i++) {
        var keys = Object.getOwnPropertyNames(objs[i] || {});

        for (var j in keys) {
            if ({}.hasOwnProperty.call(keys, j)) {
                var key = keys[j];
                target[key] = objs[i][key];
            }
        }
    }

    return target;
}

/**
 * 事件分发类
 * @class Emitter
 * @constructor
 */
class Emitter{
    /**
     *
     * @type {Object}
     * @private
     */
    _events = {};
    /**
     * 最大事件监听数
     * @property _maxListeners
     * @type {Number}
     * @private
     */
    _maxListeners = defaultMaxListeners;

    /**
     * 设置最大监听数
     * @method setMaxListeners
     * @param n 可以监听的事件数
     */
    setMaxListeners(n) {
        if (!Core.isNumber(n) || n < 0) {
            throw TypeError('n must be a positive number');
        }

        this._maxListeners = n;
    }

    /**
     * 触发事件
     * @method emit
     * @param type {String} 事件类型
     */
    emit(type) {
        if (Core.isUndefined(this._events)) {
            this._events = {};
        }

        if (type === 'error') {
            if (!this._events.error ||
                (typeof this._events.error === 'object' &&
                !this._events.error.length)) {
                let er = arguments[1];
                if (er instanceof Error) {
                    throw er;
                } else {
                    throw TypeError('Uncaught, unspecified "error" event.');
                }
            }
        }

        let handler = this._events[type];

        if (Core.isUndefined(handler)) {
            return undefined;
        }

        if (Core.isFunction(handler)) {
            let args = arguments;
            Array.prototype.splice.apply(args, [0, 1]);

            return handler.apply(this, args);
        } else if (Core.isArray(handler)) {
            let args = arguments;
            Array.prototype.splice.apply(args, [0, 1]);
            let len = handler.length;
            let ret;
            for (let i = 0; i < len; i++) {
                ret = ret && handler[i].apply(this, args);
            }
            return ret;
        }
    }

    /**
     * 事件监听
     * @param args {...}
     * @returns {*}
     */
    on(...args) {
        return this._addListener.apply(this, args);
    }

    un(...args) {
        return this._removeListener.apply(this, args);
    }

    /**
     * 事件监听
     * @method _addListener
     * @param type
     * @param listener
     * @returns {Emitter}
     * @private
     */
    _addListener(type, listener) {
        var m;

        if (!Core.isFunction(listener)) {
            throw TypeError('listener must be a function');
        }

        if (!this._events) {
            this._events = {};
        }

        if (!this._events[type]) {
            this._events[type] = listener;
        } else if (Core.isArray(this._events[type])) {
            this._events[type].push(listener);
        } else {
            this._events[type] = [this._events[type], listener];

            // Check for listener leak
            if (typeof this._events[type] === 'object' && !this._events[type].warned) {
                m = this._maxListeners;
                if (m && m > 0 && this._events[type].length > m) {
                    this._events[type].warned = true;
                    console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
                    console.trace();
                }
            }
        }

        return this;
    }

    /**
     * 注册一次
     * @method once
     * @param type
     * @param listener
     * @returns {Emitter}
     */
    once(type, listener) {
        if (!Core.isFunction(listener)) {
            throw TypeError('listener must be a function');
        }

        function g() {
            this._removeListener(type, g);
            listener.apply(this, arguments);
        }

        g.listener = listener;
        this.on(type, g);

        return this;
    }

    /**
     *
     * @param type
     * @param listener
     * @returns {Emitter}
     * @private
     */
    _removeListener(type, listener) {
        var list, position, length, i;

        if (!Core.isFunction(listener)) {
            throw TypeError('listener must be a function');
        }

        if (!this._events || !this._events[type]) {
            return this;
        }

        list = this._events[type];
        length = list.length;
        position = -1;

        if (list === listener ||
            (Core.isFunction(list.listener) && list.listener === listener)) {
            delete this._events[type];
        } else if (Core.isArray(list)) {
            for (i = length; i-- > 0;) {
                if (list[i] === listener ||
                    (list[i].listener && list[i].listener === listener)) {
                    position = i;
                    break;
                }
            }

            if (position < 0) {
                return this;
            }

            if (list.length === 1) {
                list.length = 0;
                delete this._events[type];
            } else {
                list.splice(position, 1);
            }
        }

        return this;
    }

    /**
     *
     * @param type
     * @returns {Emitter}
     */
    removeAllListeners(type) {
        var listeners;

        if (!this._events) {
            return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
            var keys = Object.keys(this._events);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                this.removeAllListeners(key);
            }
            this._events = {};
            return this;
        }

        listeners = this._events[type];

        if (Core.isFunction(listeners)) {
            this._removeListener(type, listeners);
        } else {
            // LIFO order
            while (listeners.length) {
                this._removeListener(type, listeners[listeners.length - 1]);
            }
        }
        delete this._events[type];

        return this;
    }

    /**
     * 根据事件类型获取该事件的所有监听
     * @param type
     * @returns {*}
     */
    listeners(type) {
        let ret;
        if (!this._events || !this._events[type]){
            ret = [];
        } else if (Core.isFunction(this._events[type])) {
            ret = [this._events[type]];
        } else {
            ret = this._events[type].slice();
        }
        return ret;
    }

    /**
     * 扩展对象
     * @method extend
     * @static
     * @param target {Object} 继承Emitter的对象
     * @returns {Object}
     */
    static extend(target) {
        return inherits(target, new Emitter(), Emitter.prototype);
    }

    /**
     * 继承
     * @method inherits
     * @static
     * @param subClass {Class} 继承Emitter的类
     */
    static inherits(subClass) {
        inherits(subClass.prototype, Emitter.prototype);
        subClass.prototype.constructor = subClass;
    }
}

Emitter.propTypes = {
    _events: PropTypes.object,
    _maxListeners: PropTypes.number
};

export default Emitter;
