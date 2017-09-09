var glob = require('glob');
var path = require('path');

exports.pickFiles = function(options) {
  var files = glob.sync(options.pattern);
  return files.reduce(function(data, filename) {
      if(filename.endsWith(".js")){
        var matched = filename.match(options.id);
        var name = matched[1];
        name = name.replace(".min", "");
        data[name] = path.resolve(__dirname, filename);
        return data;
    }else{
        return data;
    }
  }, {});
};


exports.fullPath = function(dir) {
  return path.resolve(__dirname, dir);
};
