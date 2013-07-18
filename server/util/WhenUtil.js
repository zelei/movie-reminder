var Util = {
    
    call : function(deferred, error, object){
        error ? deferred.reject(error) : deferred.resolve(object);
    },
    
}

module.exports = Util;