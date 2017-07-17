/**
 * @author cqb 2016-04-20.
 * @module Ajax
 */
import JQueryAjax from './JQueryAjax';
import Emitter from './Emitter';
const request = JQueryAjax.UnJQ;

request.event = {
    trigger: function(){
        this.emit.apply(this, arguments);
    }
};

Emitter.extend(request.event);

/**
 * Ajax 类
 * @class Ajax
 */
class Ajax {
    /**
     * get请求
     * @method get
     * @param url {String} 请求地址
     * @param params {Object} 请求参数
     * @param callback {Function} 请求回调
     */
    static get(url, params, callback){
        let options = {
            url: url,
            type: 'GET',
            data: params,
            dataType: 'json',
            success: callback
        };
        return request.ajax(options);
        // return Ajax.request(options);
    }

    /**
     * post请求
     * @method post
     * @param url {String} 请求地址
     * @param params {Object} 请求参数
     * @param callback {Function} 请求回调
     */
    static post(url, params, callback){
        let options = {
            url: url,
            type: 'POST',
            data: params,
            dataType: 'json',
            success: callback
        };
        return request.ajax(options);
        // return Ajax.request(options);
    }

    static ajax(options){
        return request.ajax(options);
    }

    // /**
    // * request请求
    // * @method request
    // * @param props
    // * @returns {*}
    // */
    // static request(props) {
    //    var url = props.url;
    //    var method = props.method.toLowerCase() || 'get';
    //    var params = props.params;
    //    var body = props.body;
    //    var headers = props.headers;
    //    var type = props.type;
    //    var accept = props.accept;
    //    var withCredentials = props.withCredentials;
    //    var timeout = props.timeout;
    //    var handler = props.onResponse || function(){};
    //
    //    var req = request(method, url);
    //    if(withCredentials){
    //        req.withCredentials();
    //        type = 'urlencoded';
    //    }
    //    if(type){
    //        req.type(type);
    //    }
    //    if(headers){
    //        req.set(headers);
    //    }
    //    if(accept){
    //        req.accept(accept);
    //    }
    //    if(params){
    //        req.query(params)
    //    }
    //    if(body){
    //        req.send(body)
    //    }
    //    if(timeout){
    //        req.timeout(timeout)
    //    }
    //    return req.end(handler);
    // }
};

export default Ajax;
