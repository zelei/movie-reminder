var when = require("when");

var responseToJson = function(response) {
        
        var deferred = when.defer()
        
        var body = [];
        response.setEncoding('utf8');
        
        response.on('data', function (chunk) {
            body.push(chunk);
        });
        
        response.on('end', function () {
            try {
                deferred.resolve(JSON.parse(body.join('')));
            } catch(e) {
                deferred.reject(e);
            }    
        });
        
        return deferred.promise;
    
}

module.exports = {'responseToJson' : responseToJson};