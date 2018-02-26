// #rgb
const rgbMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
// #rrggbb
const rrggbbMatcher = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
// rgb(), rgba(), or rgb%()
const rgbParenthesesMatcher = /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)$/i;
// hsl(), hsla(), or hsl%()
const hslParenthesesMatcher = /^hsla?\(\s*([0-9.]+)\s*,\s*([0-9.]+%)\s*,\s*([0-9.]+%)(?:\s*,\s*([0-9.]+))?\s*\)$/i;

class Color {
    constructor (red, green, blue, alpha) {
    /**
     * The red component.
     * @type {Number}
     * @default 1.0
     */
        this.red = red || 1.0;
        /**
     * The green component.
     * @type {Number}
     * @default 1.0
     */
        this.green = green || 1.0;
        /**
     * The blue component.
     * @type {Number}
     * @default 1.0
     */
        this.blue = blue || 1.0;
        /**
     * The alpha component.
     * @type {Number}
     * @default 1.0
     */
        this.alpha = alpha || 1.0;
    }

    floatToByte (number) {
        return number === 1.0 ? 255.0 : (number * 256.0) | 0;
    }

    toCssColorString () {
        const red = this.floatToByte(this.red);
        const green = this.floatToByte(this.green);
        const blue = this.floatToByte(this.blue);
        if (this.alpha === 1) {
            return `rgb(${red},${green},${blue})`;
        }
        return `rgba(${red},${green},${blue},${this.alpha})`;
    }

    static fromCssColorString (color) {
        // >>includeStart('debug', pragmas.debug);
        if (!color) {
            throw new Error('color is required');
        }
        // >>includeEnd('debug');

        // const namedColor = Color[color.toUpperCase()];
        // if (defined(namedColor)) {
        //     return Color.clone(namedColor);
        // }

        let matches = rgbMatcher.exec(color);
        if (matches !== null) {
            return new Color(parseInt(matches[1], 16) / 15.0,
                parseInt(matches[2], 16) / 15.0,
                parseInt(matches[3], 16) / 15.0);
        }

        matches = rrggbbMatcher.exec(color);
        if (matches !== null) {
            return new Color(parseInt(matches[1], 16) / 255.0,
                parseInt(matches[2], 16) / 255.0,
                parseInt(matches[3], 16) / 255.0);
        }

        matches = rgbParenthesesMatcher.exec(color);
        if (matches !== null) {
            return new Color(parseFloat(matches[1]) / ('%' === matches[1].substr(-1) ? 100.0 : 255.0),
                parseFloat(matches[2]) / ('%' === matches[2].substr(-1) ? 100.0 : 255.0),
                parseFloat(matches[3]) / ('%' === matches[3].substr(-1) ? 100.0 : 255.0),
                parseFloat(matches[4] || '1.0'));
        }

        matches = hslParenthesesMatcher.exec(color);
        if (matches !== null) {
            return Color.fromHsl(parseFloat(matches[1]) / 360.0,
                parseFloat(matches[2]) / 100.0,
                parseFloat(matches[3]) / 100.0,
                parseFloat(matches[4] || '1.0'));
        }

        return undefined;
    }
}


export default Color;
