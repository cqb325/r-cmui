
const pickFiles = require('./utils').pickFiles;
const paths = require('./paths');

let alias = {};

alias = Object.assign(alias, {
    'cmui': paths.appSrc + '/index.js'
});

module.exports = alias;
