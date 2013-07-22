var env = require("rekuire")("env");
var movieService = env.require("/server/service/RottenTomatoesMovieService");
var quoteService = env.require("/server/service/QuoteService");
var userRepository = env.require("/server/service/repository/UserRepository");

var Controller = function() {

    this.randomQuote = function(req, res){
            
        quoteService.getRandomQuote().then(
              function(quote) {res.json(quote)}
            , function(err) {res.json(500, err)}
            );
    
    };
    
    this.myMovies = function(req, res){
    
        if(!req.user) {
            res.json([]);
            return;
        }
        
        movieService.listMarkedMoviesForUser(req.user.id).then(
              function(movies) {res.json(movies)}
            , function(err) {res.json(500, err)}
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
              function(movies) {res.json(movies)}
            , function(err) {res.json(500, err)}
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
            .then(function() {res.json(200)}
                , function(err) {res.json(500, err)}
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
            .then(function() {res.json(200)}
                , function(err) {res.json(500, err)}
            );
            
    };

};

module.exports = { getInstance : function() {return new Controller()}};
