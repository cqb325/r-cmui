/**
 * @author cqb 2016-04-17.
 * @module Button
 */
import classes from './classes';
import mutation from './mutation';

let List;

function tryParseInt(p) {
    if (!p) {
        return 0;
    }
    const pi = parseInt(p, 10);
    return pi || 0;
}

const map = {
    option: [1, '<select multiple="multiple">', '</select>'],
    optgroup: [1, '<select multiple="multiple">', '</select>'],
    legend: [1, '<fieldset>', '</fieldset>'],
    thead: [1, '<table>', '</table>'],
    tbody: [1, '<table>', '</table>'],
    tfoot: [1, '<table>', '</table>'],
    colgroup: [1, '<table>', '</table>'],
    caption: [1, '<table>', '</table>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    _default: [0, '', '']
};

/**
 * Dom 类
 * @class Dom
 */
class Dom {
    /**
     * 选取
     * @method query
     * @param selector {String} css选择器
     * @param el {Element} 可选 页面元素
     * @returns {Element}
     */
    static query(selector, el){
        if (arguments.length === 1 && typeof arguments[0] === 'string') {
            if (document.querySelector) {
                return document.querySelector(arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (el.querySelector) {
                return el.querySelector(selector);
            }
        }
    }

    /**
     * 选取所有
     * @method queryAll
     * @param el {Element} 可选 页面元素
     * @param selector {String} css选择器
     * @returns {NodeList}
     */
    static queryAll(selector, el) {
        if (arguments.length === 1 && typeof arguments[0] === 'string') {
            if (document.querySelectorAll) {
                return document.querySelectorAll(arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (el.querySelectorAll) {
                return el.querySelectorAll(selector);
            }
        }
    }

    /**
     * 根据id获取元素
     * @method get
     * @param id
     * @returns {Element}
     */
    static get(id) {
        return document.getElementById(id);
    }

    /**
     * 获取第一个元素
     * @method first
     * @param selector
     * @param el
     * @returns {*}
     */
    static first(el, selector) {
        if (arguments.length === 1) {
            return el.children[0];
        }
        if (arguments.length === 2) {
            return Dom.query(selector + ':first-child', el);
        }
    }

    /**
     * 获取第index个元素
     * @method eq
     * @param el
     * @param index
     * @returns {Element}
     */
    static eq(el, index) {
        return Dom.query(':nth-child(' + index + ')', el);
    }

    /**
     * 根据选择器取非值
     * @method not
     * @param el
     * @param selector
     * @returns {*}
     */
    static not(el, selector) {
        return Dom.queryAll(':not(' + selector + ')', el);
    }

    /**
     * 前一个元素
     * @method prev
     * @param el
     * @returns {*|Node}
     */
    static prev(el){
        var node = el.previousSibling;
        if (node.nodeType) {
            if (node.nodeType === 1) {
                return node;
            }
            if (node.nodeType === 3) {
                node = node.previousSibling;
                return node;
            }
        }
    }

    /**
     * 下一个元素
     * @method next
     * @param el
     * @returns {*|Node}
     */
    static next(el) {
        var node = el.nextSibling;
        if (node.nodeType) {
            if (node.nodeType === 1) {
                return node;
            }
            if (node.nodeType === 3) {
                node = node.nextSibling;
                return node;
            }
        }
    }

    /**
     * 最后一个元素
     * @method last
     * @param selector
     * @param el
     * @returns {*}
     */
    static last(el, selector) {
        if (arguments.length === 1) {
            var children = el.children;
            return children[children.length - 1];
        }
        if (arguments.length === 2) {
            return Dom.query(selector + ':last-child', el);
        }
    }

    /**
     * 父节点
     * @method closest
     * @param el
     * @param selector
     */
    static closest(el, selector){
        let doms;
        let targetDom;
        var isSame = function(doms, el){
            let i = 0;
            let len = doms.length;
            for (i; i < len; i++) {
                if (doms[i].isEqualNode) {
                    if (doms[i].isEqualNode(el)) {
                        return doms[i];
                    }
                } else {
                    if (doms[i] == el) {
                        return doms[i];
                    }
                }
            }
            return false;
        };
        var traversal = function(el, selector){
            doms = Dom.queryAll(selector, el.parentNode);
            targetDom = isSame(doms, el);
            while (!targetDom) {
                el = el.parentNode;
                if (el != null && el.nodeType === el.DOCUMENT_NODE) {
                    return false;
                }
                traversal(el, selector);
            }

            return targetDom;
        };

        return traversal(el, selector);
    }

    /**
     * 删除节点
     * @method remove
     * @param el
     */
    static remove(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }

    /**
     * 添加获取属性
     * @method attr
     * @param el
     * @param name
     * @param value
     * @returns {*}
     */
    static attr(el, name, value){
        if (arguments.length === 2) {
            return el.getAttribute(name);
        } else if (arguments.length === 3) {
            el.setAttribute(name, value);
            return el;
        }
    }

    /**
     * 删除属性
     * @method removeAttr
     * @param el
     * @param name
     */
    static removeAttr(el, name) {
        if (arguments.length === 2) {
            el.removeAttribute(name);
        }
    }

    /**
     * 判断是否存在某个class
     * @method hasClass
     * @param el
     * @param clazz
     * @returns {boolean}
     */
    static hasClass(el, clazz) {
        if (el.className.indexOf(clazz) > -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 添加class
     * @method addClass
     * @param el
     * @param clazz
     * @returns {*}
     */
    static addClass(el, clazz) {
        if ('classList' in el) {
            el.classList.add(clazz);
        } else {
            var preCls = el.className;
            el.className = preCls + ' ' + clazz;
        }
        return el;
    }

    /**
     * 删除class
     * @method removeClass
     * @param el
     * @param clazz
     * @returns {*}
     */
    static removeClass(el, clazz) {
        if ('classList' in el) {
            el.classList.remove(clazz);
        } else {
            var preCls = el.className;

            el.className = preCls.replace(clazz, '');
        }
        return el;
    }

    /**
     * 判断两个元素是否是父子节点关系
     * @method isDescendant
     * @param parent {Element} 父节点
     * @param child {Element} 子节点
     * @returns {boolean} true： 是父子关系， false：不是父子关系
     */
    static isDescendant (parent, child) {
        let node = child.parentNode;

        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }

        return false;
    }

    /**
     * 获取文字区域的位置
     * @method offset
     * @param el {Element} 界面元素
     * @returns {{top: number, left: number}}
     */
    static offset(el) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
    }

    /**
     * 获取文字区域范围
     * @method bounding
     * @param el {Element} 界面元素
     * @returns {ClientRect} 文字区域范围
     */
    static bounding(el) {
        return el.getBoundingClientRect();
    }

    /**
     * 计算高度
     * @param el
     * @returns {number}
     */
    static forceRedraw (el) {
        let originalDisplay = Dom.css(el, 'display');

        el.style.display = 'none';
        let oh = el.offsetHeight;
        el.style.display = originalDisplay;
        return oh;
    }

    /**
     * 取消过度效果
     * @method withoutTransition
     * @param el
     * @param callback
     */
    static withoutTransition (el, callback) {
        // turn off transition
        el.style.transition = 'none';

        callback();

        // force a redraw
        Dom.forceRedraw(el);

        // put the transition back
        el.style.transition = '';
    }

    /**
     * 获取元素的高度
     * @method getOuterHeight
     * @param el
     * @returns {*}
     */
    static getOuterHeight (el) {
        let height = el.clientHeight +
            tryParseInt(el.style.borderTopWidth) +
            tryParseInt(el.style.borderBottomWidth) +
            tryParseInt(el.style.marginTop) +
            tryParseInt(el.style.marginBottom);
        return height;
    }

    /**
     * 获取元素的宽度
     * @method getOuterWidth
     * @param el
     * @returns {*}
     */
    static getOuterWidth (el) {
        return el.offsetWidth +
            tryParseInt(el.style.borderLeftWidth) +
            tryParseInt(el.style.borderRightWidth) +
            tryParseInt(el.style.marginLeft) +
            tryParseInt(el.style.marginRight);
    }

    /**
     * 监测是否超出页面底部
     * method overView
     * @param el
     * @param pad
     * @returns {boolean}
     */
    static overView (el, pad = 0) {
        let height = window.innerHeight || document.documentElement.clientHeight;
        let bottom = el.getBoundingClientRect().bottom + pad;
        return bottom > height;
    }

    /**
     * 获取元素的最终样式
     * @param el {DOM} 元素对象
     * @param style {String} 样式属性
     * @param fake {String} 伪类
     * @returns {*}
     */
    static css (el, style, fake){
        if (typeof el === 'string') {
            el = Dom.query(el);
        }
        if (window.getComputedStyle) {
            return window.getComputedStyle(el, fake)[style];
        }
        if (el.currentStyle) {
            return el.currentStyle[style];
        }
        return null;
    }

    /**
     * 解析dom
     * @param str
     * @returns {List}
     */
    static dom(str){
        return new List(Dom.parseHTML(str));
    }

    static parseHTML(html){
        if (typeof html !== 'string') {
            if (html.nodeType && html.nodeType === 1) {
                return [html];
            }
            if (typeof html === 'object' && html.length) {
                return html;
            }
            throw new TypeError('String expected');
        }

        // tag name
        var m = /<([\w:]+)/.exec(html);
        if (!m) {
            throw new Error('No elements were generated.');
        }
        var tag = m[1];

        // body support
        if (tag === 'body') {
            var ele = document.createElement('html');
            ele.innerHTML = html;
            return [ele.removeChild(ele.lastChild)];
        }

        // wrap map
        var wrap = map[tag] || map._default;
        var depth = wrap[0];
        var prefix = wrap[1];
        var suffix = wrap[2];
        var el = document.createElement('div');
        el.innerHTML = prefix + html + suffix;

        // trim away wrapper elements
        while (depth--) {
            el = el.lastChild;
        };

        var els = [];

        var child = el.firstChild;
        do {
            els.push(child);
        } while (child = child.nextElementSibling);

        for (var i = 0; i < els.length; ++i) {
            el.removeChild(els[i]);
        }

        return els;
    }
}

/**
 * Initialize a new `List` with the
 * given array-ish of `els` and `selector`
 * string.
 *
 * @param {Mixed} els
 * @param {String} selector
 * @api private
 */

List = function (els, selector) {
    Array.prototype.push.apply(this, els);
    this.selector = selector;
};

// for minifying
var proto = List.prototype;

/**
 * Set attribute `name` to `val`, or get attr `name`.
 *
 * @param {String} name
 * @param {String} [val]
 * @return {String|List} self
 * @api public
 */

proto.attr = function(name, val) {
    if (val === undefined) {
        return this[0].getAttribute(name);
    }

    this[0].setAttribute(name, val);
    return this;
};

proto.removeAttr = function(name) {
    this[0].removeAttribute(name);
    return this;
};

// set or get the data attribute for the first element in the list
proto.data = function(key, value) {
    return this.attr('data-' + key, value);
};

/**
 * Return a cloned `List` with all elements cloned.
 *
 * @return {List}
 * @api public
 */
proto.clone = function(){
    var arr = [];
    for (var i = 0, len = this.length; i < len; ++i) {
        arr.push(this[i].cloneNode(true));
    }
    return new List(arr);
};

/**
 * Return a `List` containing the element at `i`.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

proto.at = function(i){
    return new List([this[i]], this.selector);
};

/**
 * Return a `List` containing the first element.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

proto.first = function(){
    return new List([this[0]], this.selector);
};

/**
 * Return a `List` containing the last element.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

proto.last = function(){
    return new List([this[this.length - 1]], this.selector);
};

/**
 * Return list length.
 *
 * @return {Number}
 * @api public
 */

proto.length = function() {
    return this.length;
};

/**
 * Return element text.
 *
 * @return {String}
 * @api public
 */

proto.text = function(val) {
    if (val !== undefined) {
        this[0].textContent = val;
        return this;
    }

    var str = '';
    for (var i = 0; i < this.length; ++i) {
        str += this[i].textContent;
    }
    return str;
};

/**
 * Return element html.
 *
 * @return {String}
 * @api public
 */

proto.html = function(val){
    var el = this[0];

    if (val) {
        if (typeof (val) !== 'string') {
            throw new Error('.html() requires a string');
        }

        el.innerHTML = val;
        return this;
    }

    return el.innerHTML;
};

/**
 * Iterate elements and invoke `fn(list, i)`.
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

proto.each = function(fn) {
    for (var i = 0; i < this.length; ++i) {
        fn(new List([this[i]], this.selector), i);
    }
    return this;
};

/**
 * Iterate elements and invoke `fn(el, i)`.
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

proto.forEach = function(fn) {
    Array.prototype.forEach.call(this, fn);
    return this;
};

/**
 * Map elements invoking `fn(list, i)`.
 *
 * @param {Function} fn
 * @return {Array}
 * @api public
 */

proto.map = function(fn){
    return Array.prototype.map.call(this, fn);
};

proto.select = function() {
    for (var i = 0; i < this.length; ++i) {
        var el = this[i];
        el.select();
    };

    return this;
};

/**
 * Filter elements invoking `fn(list, i)`, returning
 * a new `List` of elements when a truthy value is returned.
 *
 * @param {Function} fn
 * @return {List}
 * @api public
 */

proto.filter = function(fn) {
    var els = Array.prototype.filter.call(this, function(el) {
        return fn(new List([el], this.selector));
    });
    return new List(els, this.selector);
};

proto.value = function(val) {
    var el = this[0];
    if (val) {
        el.value = val;
        return this;
    }

    return el.value;
};

proto.next = function() {
    var els = [];
    for (var i = 0; i < this.length; ++i) {
        var next = this[i].nextElementSibling;
        // if no more siblings then don't push
        if (next) {
            els.push(next);
        }
    }

    return new List(els);
};

proto.prev = function() {
    var els = [];
    for (var i = 0; i < this.length; ++i) {
        var next = this[i].previousElementSibling;
        // if no more siblings then don't push
        if (next) {
            els.push(next);
        }
    }
    return new List(els);
};
/**
 * Add the given class `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

proto.addClass = function(name){
    var el;
    for (var i = 0; i < this.length; ++i) {
        el = this[i];
        el._classes = el._classes || classes(el);
        el._classes.add(name);
    }
    return this;
};

/**
 * Remove the given class `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

proto.removeClass = function(name){
    var el;
    for (var i = 0; i < this.length; ++i) {
        el = this[i];
        el._classes = el._classes || classes(el);
        el._classes.remove(name);
    }
    return this;
};

/**
 * Toggle the given class `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

proto.toggleClass = function(name){
    var el;
    for (var i = 0; i < this.length; ++i) {
        el = this[i];
        el._classes = el._classes || classes(el);
        el._classes.toggle(name);
    }
    return this;
};

/**
 * Check if the given class `name` is present.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

proto.hasClass = function(name){
    var el;
    for (var i = 0; i < this.length; ++i) {
        el = this[i];
        el._classes = el._classes || classes(el);
        if (el._classes.has(name)) {
            return true;
        }
    }
    return false;
};

/**
 * Set CSS `prop` to `val` or get `prop` value.
 *
 * @param {String} prop
 * @param {Mixed} val
 * @return {List|String}
 * @api public
 */

proto.css = function(prop, val){
    if (prop instanceof Object) {
        for (var p in prop) {
            if ({}.hasOwnProperty.call(prop, p)) {
                this.setStyle(p, prop[p]);
            }
        }
        return;
    }

    if (arguments.length === 2) {
        return this.setStyle(prop, val);
    }

    return this.getStyle(prop);
};

/**
 * Set CSS `prop` to `val`.
 *
 * @param {String} prop
 * @param {Mixed} val
 * @return {List} self
 * @api private
 */

proto.setStyle = function(prop, val){
    for (var i = 0; i < this.length; ++i) {
        this[i].style[prop] = val;
    }
    return this;
};

/**
 * Get CSS `prop` value.
 *
 * @param {String} prop
 * @return {String}
 * @api private
 */

proto.getStyle = function(prop) {
    var el = this[0];
    if (el) {
        return Dom.css(el, prop);
    }
};
proto.parent = function() {
    var els = [];
    for (var i = 0; i < this.length; ++i) {
        els.push(this[i].parentNode);
    }

    return new List(els);
};

/// mutation

proto.prepend = function(what) {
    for (var i = 0; i < this.length; ++i) {
        mutation.prepend(this[i], Dom.dom(what));
    }
    return this;
};

proto.append = function(what) {
    for (var i = 0; i < this.length; ++i) {
        mutation.append(this[i], Dom.dom(what));
    }
    return this;
};

proto.before = function(what) {
    for (var i = 0; i < this.length; ++i) {
        mutation.before(this[i], Dom.dom(what));
    }
    return this;
};

proto.after = function(what) {
    for (var i = 0; i < this.length; ++i) {
        mutation.after(this[i], Dom.dom(what));
    }
    return this;
};

proto.remove = function() {
    for (var i = 0; i < this.length; ++i) {
        mutation.remove(this[i]);
    }
};

proto.replace = function(what) {
    for (var i = 0; i < this.length; ++i) {
        mutation.replace(this[i], Dom.dom(what));
    }
    return this;
};

// note, we don't do .find('*').remove() here for efficiency
proto.empty = function() {
    for (var i = 0; i < this.length; ++i) {
        mutation.empty(this[i]);
    }
    return this;
};

proto.show = function() {
    for (var i = 0; i < this.length; ++i) {
        this[i].style.display = this[i].org_display ? this[i].org_display : 'block';
    }
    return this;
};

proto.hide = function() {
    for (var i = 0; i < this.length; ++i) {
        this[i].org_display = this[i].style.display;
        this[i].style.display = 'none';
    }
    return this;
};

proto.width = function (isouter) {
    if (isouter) {
        return Dom.getOuterWidth(this[0]);
    } else {
        return this[0].offsetWidth;
    }
};
proto.height = function (isouter) {
    if (isouter) {
        return Dom.getOuterHeight(this[0]);
    } else {
        return this[0].offsetHeight;
    }
};

proto.offset = function () {
    if (this.length) {
        var ele = this[0];
        var actualLeft = ele.offsetLeft;
        var actualTop = ele.offsetTop;
        var current = ele.offsetParent;
        while (current !== null && current.tagName !== 'BODY'){
            actualLeft += current.offsetLeft;
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }

        return {
            top: actualTop,
            left: actualLeft
        };
    }
    return null;
};

export default Dom;
