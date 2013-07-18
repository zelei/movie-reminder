var env = require("rekuire")("env");
var when = require("when");
var WhenUtil = env.require("/server/util/WhenUtil");

var User = env.require("/server/model/User");

var UserRepository = function() {
    
    this.findById = function(userId) {
        var deferred = when.defer();
                
        User.findOne( {'id': userId}, function(err, user) {
           WhenUtil.call(deferred, err, user);
        });
        
        return deferred.promise; 
    };
    
    this.markMovie = function(userId, movieId) {
        
        var deferred = when.defer();
        
        User.update({'id': userId}, {'$addToSet': {'selectedMovies': movieId}}, function(err) {
           WhenUtil.call(deferred, err, userId);
        });
        
        return deferred.promise;    
    };
    
    this.unmarkMovie = function(userId, movieId) {
        
        var deferred = when.defer();
        
        User.update({'id': userId}, {'$pull': {'selectedMovies': movieId}}, function(err) {
            WhenUtil.call(deferred, err, userId);
        });
        
        return deferred.promise;    
    };
    
}

module.exports = new UserRepository();