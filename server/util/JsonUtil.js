var when = require("when");

var responseToJson = function(response) {
        
        var deferred = when.defer()
        
        var body = [];
        response.setEncoding('utf8');
        
        response.on('data', function (chunk) {
            body.push(chunk);
        });
        
        response.on('end', function () {
           deferred.resolve(JSON.parse(body.join('')));
        });
        
        return deferred.promise;
    
}

module.exports = {'responseToJson' : responseToJson};