const GRIDS = {};
const OFFSETS = {};
const RESPONSIVE = {
    'sm': '35.5',
    'md': '48',
    'lg': '64',
    'xl': '80'
};
let gridPre = 'cm-grid';
let offsetPre = 'cm-offset';
let defaultResponsive = 'md';

let ret = {};

ret.setOptions = function(options) {
    if (!options) {
        return;
    }
    if (options.gridPre) {
        gridPre = options.gridPre;
    }
    if (options.offsetPre) {
        offsetPre = options.offsetPre;
    }
    if (options.responsive) {
        defaultResponsive = options.responsive;
    }
};

function createStyle(text) {
    if (document.createStyleSheet) {
        let s = document.createStyleSheet();
        let rules = text.replace(/\/\*[^\*]*\*\//g, '').replace(/@[^{]*\{/g, '').match(/[^\{\}]+\{[^\}]+\}/g);
        for (let i = 0; i < rules.length; i++) {
            let m = rules[i].match(/(.*)\s*\{\s*(.*)\}/);
            if (m) {
                try {
                    s.addRule(m[1], m[2]);
                } catch (e) {
                }
            }
        }
    } else {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = text;
        document.head.appendChild(style);
    }
}

function generateGrid(width, key, responsive) {
    GRIDS[key] = true;
    let minWidth = RESPONSIVE[responsive];
    let text = `@media screen and (min-width: ${minWidth}em) { .${gridPre}-${key}{width: ${width}%} }`;

    createStyle(text);
}

function generateOffset(width, key, responsive) {
    OFFSETS[key] = true;
    let minWidth = RESPONSIVE[responsive];
    let text = `@media screen and (min-width: ${minWidth}em) { .${offsetPre}-${key}{margin-left: ${width}%} }`;

    createStyle(text);
}

function generate(width, type, responsive) {
    if (!width || width <= 0) {
        return '';
    }

    width = (width * 100).toFixed(4);
    width = width.substr(0, width.length - 1);

    responsive = responsive || defaultResponsive;
    let key = responsive + '-' + width.replace('.', '-');
    if (type === 'grid') {
        if (!GRIDS[key]) {
            generateGrid(width, key, responsive);
        }
        return `${gridPre}-${key}`;
    } else {
        if (!OFFSETS[key]) {
            generateOffset(width, key, responsive);
        }
        return `${offsetPre}-${key}`;
    }
}

ret.getGrid = function(options) {
    if (!options) {
        return '';
    }

    if (typeof options === 'number') {
        options = { width: options };
    }

    let { width, offset, responsive } = options;
    let gridClass = generate(width, 'grid', responsive);
    let offsetClass = generate(offset, 'offset', responsive);

    return `${gridPre} ${gridPre}-1 ${gridClass} ${offsetClass}`;
};

(function () {
    let text = [];

    text.push(`.${gridPre}{display: inline-block;zoom: 1;letter-spacing: normal;
        word-spacing: normal;text-rendering: auto;box-sizing: border-box;}`);

    text.push(`.${gridPre}-1{width:100%}`);
    createStyle(text.join(''));
})();

export default ret;
