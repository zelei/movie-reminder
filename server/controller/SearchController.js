var env = require("rekuire")("env");
var ResponseUtil = env.require("/server/util/ResponseUtil");
var movieService = env.require("/server/service/RottenTomatoesMovieService");

var Controller = function() {
    
    this.search = function(req, res){
    
        if(!req.user) {
            res.writeHead(401);
            res.end();
            return;
        }
        
        if(!req.query.q) {
            res.send(500);
            return;
        }
        
        movieService.search(req.query.q, req.user.id)
            .then(function(movies) {ResponseUtil.writeJsonToResponse(res, movies);}
                , function(err) {ResponseUtil.writeErrorToResponse(res, err);});
            
    }

}

module.exports = { getInstance : function() {return new Controller()}};
