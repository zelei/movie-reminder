var logger = require('winston');

var Util = {
    
    call : function(deferred, error, object){
        if(error) {
            logger.info("Error:", error);
            deferred.reject(error);
        } else {
            deferred.resolve(object);
        }
    }
    
};

module.exports = Util;