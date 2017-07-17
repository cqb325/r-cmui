/**
 * @author cqb 2016-04-17.
 * @module shallowEqual
 */

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 判断两个对象是否相等
 * @method shallowEqual
 * @static
 * @param objA
 * @param objB
 * @returns {boolean} true: 相等 false:不相等
 */
function shallowEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
    }

    if (objA instanceof Array && objB instanceof Array) {
        if (objA.length !== objB.length) {
            return false;
        }
        let equal = true;
        objA.forEach(function(objAItem){
            objB.forEach(function(objBItem){
                if (!shallowEqual(objAItem, objBItem)){
                    equal = false;
                }
            });
        });

        return equal;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    const bHasOwnProperty = hasOwnProperty.bind(objB);
    for (let i = 0; i < keysA.length; i++) {
        if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }

    return true;
};

export default shallowEqual;
