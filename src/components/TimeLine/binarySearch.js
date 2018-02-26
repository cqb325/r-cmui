export default function (array, itemToFind, comparator) {
    // >>includeStart('debug', pragmas.debug);
    if (!array) {
        throw new Error('array is required.');
    }
    if (!itemToFind) {
        throw new Error('itemToFind is required.');
    }
    if (!comparator) {
        throw new Error('comparator is required.');
    }
    // >>includeEnd('debug');

    let low = 0;
    let high = array.length - 1;
    let i;
    let comparison;

    while (low <= high) {
        i = ~~((low + high) / 2);
        comparison = comparator(array[i], itemToFind);
        if (comparison < 0) {
            low = i + 1;
            continue;
        }
        if (comparison > 0) {
            high = i - 1;
            continue;
        }
        return i;
    }
    return ~(high + 1);
}
