var context = require("rekuire")("webconfiguration");
var movieService = context.require("/server/service/RottenTomatoesMovieService");


var Controller = function(req, res){
    
    movieService.listUpcoming(req.query.q, function(movies) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movies));
    }, function(error) {
        res.writeHead(500);
        res.end(JSON.stringify(error));
    })

}

module.exports = Controller;