var Util = {
    
    writeJsonToResponse : function(res, object){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        object ? res.end(JSON.stringify(object)) : res.end()
    },
    
    writeErrorToResponse : function(res, error){
        res.writeHead(500);
        error ? res.end(JSON.stringify(error)) : res.end()
    }
    
}

module.exports = Util;