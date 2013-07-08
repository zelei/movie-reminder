var responseToJson = function(response, callback) {
        
        var body = [];
        response.setEncoding('utf8');
        
        response.on('data', function (chunk) {
            body.push(chunk);
        });
        
        response.on('end', function () {
            callback(JSON.parse(body.join('')));
        });
    
}

module.exports = {'responseToJson' : responseToJson};