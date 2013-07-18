var env = require("rekuire")("env");
var ResponseUtil = env.require("/server/util/ResponseUtil");
var movieService = env.require("/server/service/RottenTomatoesMovieService");
var userRepository = env.require("/server/service/repository/UserRepository");

var Controller = function() {

    this.myMovies = function(req, res){
    
        if(!req.user) {
            ResponseUtil.writeJsonToResponse(res, []);
            return;
        }
        
        movieService.listMarkedMoviesForUser(req.user.id).then(
              function(movies) {ResponseUtil.writeJsonToResponse(res, movies);}
            , function(err) {ResponseUtil.writeErrorToResponse(res, err);}
            );
    
    };
    
    this.upcoming = function(req, res){
    
        var listFunction = null;
    
        if(req.user) {
            listFunction = movieService.listUpcomingForUser(req.user.id);
        } else {
            listFunction = movieService.listUpcoming();
        }
        
        listFunction.then(
              function(movies) {ResponseUtil.writeJsonToResponse(res, movies);}
            , function(err) {ResponseUtil.writeErrorToResponse(res, err);}
            );
    
    };
    
    this.mark = function(req, res){
        
        if(!req.user) {
            res.writeHead(401);
            res.end();
            return;
        }
        
        if(!req.body && !req.body.id) {
            res.writeHead(400);
            res.end();
            return;
        }
        
        userRepository.markMovie(req.user.id, req.body.id)
            .then(function() {ResponseUtil.writeJsonToResponse(res);}
                , function(err) {ResponseUtil.writeErrorToResponse(res, err);}
            );
        
    };
    
    this.unmark = function(req, res){
        
        if(!req.user) {
            res.writeHead(401);
            res.end();
            return;
        }
        
        if(!req.body && !req.body.id) {
            res.writeHead(400);
            res.end();
            return;
        }
        
        userRepository.unmarkMovie(req.user.id, req.body.id)
            .then(function() {ResponseUtil.writeJsonToResponse(res);}
                , function(err) {ResponseUtil.writeErrorToResponse(res, err);}
            );
            
    };

};

module.exports = { getInstance : function() {return new Controller()}};
