export default async (url = '', data = {}, type = 'GET')=>{
    type = type.toUpperCase();
    if (type === 'GET') {
        let dataStr = ''; //数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        });

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    let requestConfig = {
        method: type,
        headers: {
            'Accept': 'application/json'
        },
        mode: "cors",
        cache: "force-cache"
    }

    if (type == 'POST') {
        Object.defineProperty(requestConfig, 'body', {
            value: JSON.stringify(data)
        })
    }
    try {
        const response = await fetch(url, requestConfig);
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}
