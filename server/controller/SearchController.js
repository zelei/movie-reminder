var context = require("rekuire")("webconfiguration");
var movieService = context.require("/server/service/RottenTomatoesMovieService");

var Controller = function(req, res){
    
    if(!req.query.q) {
        res.send(500, {status:500, message: 'internal error', type:'internal'});
        return;
    }
    
    movieService.search(req.query.q).then(function(shortDesciptinos) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(shortDesciptinos));
    }, function() {
        res.writeHead(500);
        res.end();
    });

}

module.exports = Controller;
