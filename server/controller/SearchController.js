var env = require("rekuire")("env");
var movieService = env.require("/server/service/MovieService");

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
            .then(function(movies) {res.json(movies)}
                , function(err) {res.json(500, err)});
            
    };

};

module.exports = { getInstance : function() {return new Controller()}};
