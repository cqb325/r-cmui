async function myFetch (url = '', data = {}, type = 'GET', options) {
    type = type.toUpperCase();
    let dataStr = ''; // 数据拼接字符串
    Object.keys(data).forEach(key => {
        dataStr += `${key}=${data[key]}&`;
    });
    dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
    if (type === 'GET') {
        if (dataStr !== '') {
            if (url.indexOf('?') > -1) {
                url = `${url}&${dataStr}`;
            } else {
                url = `${url}?${dataStr}`;
            }
        }
        if (url.indexOf('?') > -1) {
            url += `&_=${new Date().getTime()}`;
        } else {
            url += `?_=${new Date().getTime()}`;
        }
    }

    options = options || {};
    const headers = options.headers || {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };

    const requestConfig = {
        method: type,
        headers,
        mode: 'cors',
        cache: 'force-cache',
        credentials: 'include'
    };

    if (type == 'POST') {
        if (headers['Content-Type'].indexOf('application/json') > -1) {
            requestConfig.body = JSON.stringify(data);
        } else {
            requestConfig.body = dataStr;
        }
    }
    try {
        const response = await fetch(url, requestConfig);
        let responseJson;
        if (response) {
            if (headers['Accept'] === 'application/json') {
                responseJson = await response.json();
            }
            if (headers['Accept'] === 'text/xml') {
                responseJson = await response.xml();
            }
            if (headers['Accept'] === 'text/plain') {
                responseJson = await response.text();
            }
        }
        return responseJson;
    } catch (error) {
        console.error(error);
        if (options.fail) {
            options.fail(error);
        }
    }
}

export default myFetch;

export async function fetchJSON (url = '', data = {}, type = 'GET', options) {
    options = options || {};
    options.headers = options.headers || {};
    Object.assign(options.headers, {
        'Accept': 'text/json',
        'Content-Type': 'application/json; charset=UTF-8'
    });
    return await myFetch(url, data, type, options);
}

export async function fetchText (url = '', data = {}, type = 'GET', options) {
    options = options || {};
    options.headers = options.headers || {};
    Object.assign(options.headers, {
        'Accept': 'text/plain',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });
    return await myFetch(url, data, type, options);
}

export async function fetchXML (url = '', data = {}, type = 'GET', options) {
    options = options || {};
    options.headers = options.headers || {};
    Object.assign(options.headers, {
        'Accept': 'text/xml',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });
    return await myFetch(url, data, type, options);
}
