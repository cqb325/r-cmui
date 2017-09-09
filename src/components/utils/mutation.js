function mkfragment(elements) {
    var frag = document.createDocumentFragment();

    for (var i = 0; i < elements.length; ++i) {
        frag.appendChild(elements[i]);
    }

    return frag;
}
let ret = {};
ret.remove = function(el) {
    if (!el.parentNode) {
        return;
    }
    return el.parentNode.removeChild(el);
};

ret.replace = function(el, what) {
    if (!el.parentNode) {
        return;
    }
    return el.parentNode.replaceChild(mkfragment(what), el);
};

ret.prepend = function(el, what) {
    return el.insertBefore(mkfragment(what), el.firstChild);
};

ret.append = function(el, what) {
    return el.appendChild(mkfragment(what));
};

// returns newly inserted element
ret.after = function (el, what) {
    if (!el.parentNode) {
        return;
    }

    // ie9 doesn't like null for insertBefore
    if (!el.nextSilbling) {
        return el.parentNode.appendChild(mkfragment(what));
    }

    return el.parentNode.insertBefore(mkfragment(what), el.nextSilbling);
};

ret.before = function(el, what) {
    if (!el.parentNode) {
        return;
    }
    return el.parentNode.insertBefore(mkfragment(what), el);
};

ret.empty = function(parent) {
    // cheap way to remove all children
    parent.innerHTML = '';
};

export default ret;
