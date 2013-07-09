var context = require("rekuire")("webconfiguration");
var movieService = context.require("/server/service/RottenTomatoesMovieService");

var Controller = function(req, res){
    
    movieService.listUpcoming().then(function(movies) {
        res.render('pages/index.ect', {movies : movies});
    });
    
}

module.exports = Controller;