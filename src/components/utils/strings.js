export default function substitute(str, obj) {
    if (typeof str === 'string') {
        return str.replace((/\\?\{([^{}]+)\}/g), function(match, name){
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return (obj[name] === null || obj[name] === undefined) ? '' : obj[name];
        });
    } else if (typeof str === 'function') {
        return str(obj);
    }
}
