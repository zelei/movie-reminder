var context = require("rekuire")("webconfiguration");
var movieService = context.require("/server/service/RottenTomatoesMovieService");

var Controller = function(req, res){
    
    movieService.listUpcoming(function(movies) {
        res.render('pages/index.ect', {movies : movies});
    }, function(error) {
        res.writeHead(500);
        res.end();
    })
    
}

module.exports = Controller;