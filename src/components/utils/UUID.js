/**
 * @author cqb 2016-03-24
 * @module UUID模块
 */


/**
 *
 * @returns {string}
 * @private
 */
let _s4 = function(){
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

/**
 * UUID
 */
class UUID {
    /**
     *
     * @returns {string}
     */
    static v4(){
        return (_s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4());
    }
}

export default UUID;
