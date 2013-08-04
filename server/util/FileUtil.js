// settings
var FILE_ENCODING = 'utf-8',
    EOL = '\n';
 
// setup
var _fs = require('fs');
var env = require('rekuire')("env");
var logger = require('winston');

var Util = {
    
    concat : function(opts) {
        var fileList = opts.src;
        var distPath = opts.dest;
        var out = fileList.map(function(filePath){
                return _fs.readFileSync(env.root + filePath, FILE_ENCODING);
            });
        _fs.writeFileSync(env.root + distPath, out.join(EOL), FILE_ENCODING);
        logger.info(' '+ env.root +  distPath +' built.');
    }
    
};

module.exports = Util;