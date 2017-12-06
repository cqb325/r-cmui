const xhrs = [
    function () { return new XMLHttpRequest(); },
    function () { return new ActiveXObject('Microsoft.XMLHTTP'); },
    function () { return new ActiveXObject('MSXML2.XMLHTTP.3.0'); },
    function () { return new ActiveXObject('MSXML2.XMLHTTP'); }
];

let _xhr = null;
const makeXhr = function () {
    if (_xhr != null) {
        return _xhr();
    }
    for (let i = 0, l = xhrs.length; i < l; i++) {
        try {
            let f = xhrs[i], req = f();
            if (req != null) {
                _xhr = f;
                return req;
            }
        } catch (e) {
            continue;
        }
    }
    return function () { };
};

function get (url) {
    const xhr = makeXhr();

    xhr.open('GET', url, false);
    let response;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseText = xhr.responseText;
            response = JSON.parse(responseText);
        } else if (xhr.status === 403 || xhr.status === 404) {
            
        }
    };
    xhr.send();
    return response;
}

export default {
    get
};
