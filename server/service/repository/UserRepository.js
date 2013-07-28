var env = require("rekuire")("env");
var when = require("when");
var WhenUtil = env.require("/server/util/WhenUtil");

var User = env.require("/server/model/User");

var UserRepository = function() {

    this.findOne = function(userId) {
        var deferred = when.defer();
                        
        var query = {"id": userId};
              
        User.findOne(query, function(err, user) {
            WhenUtil.call(deferred, err, user);
        });
        
        return deferred.promise; 
    };
    
    this.findOneAndUpdate = function(userId, userName, accessToken) {
        var deferred = when.defer();
                        
        var query = {"id": userId};
        var options = {upsert: true};
        var user = {"id": userId, "name": userName, "accessToken": accessToken};
              
        User.findOneAndUpdate(query, user, options, function(err, user) {
            WhenUtil.call(deferred, err, {'id' : user.id, 'name' : user.name, 'accessToken': accessToken, 'calendarId' : user.calendarId});
        });
        
        return deferred.promise; 
    };

    this.setCalendarId = function(userId, calendarId) {
        var deferred = when.defer();
        
        User.update({'id': userId}, {'calendarId': calendarId}, function(err) {
           WhenUtil.call(deferred, err, userId);
        });
        
        return deferred.promise;   
    };
    
    this.findById = function(userId) {
        var deferred = when.defer();
                
        User.findOne( {'id': userId}, function(err, user) {
           WhenUtil.call(deferred, err, user);
        });
        
        return deferred.promise; 
    };
    
    this.markMovie = function(userId, movieId, eventId) {
        
        var deferred = when.defer();
        
        User.update({'id': userId}, {'$addToSet': {'selectedMovies': {'movieId' : movieId, 'eventId' : eventId}}}, function(err) {
           WhenUtil.call(deferred, err, userId);
        });
        
        return deferred.promise;    
    };
    
    this.unmarkMovie = function(userId, movieId) {
        
        var deferred = when.defer();
        
        User.update({'id': userId}, {'$pull': {'selectedMovies': {'movieId' : movieId}}}, function(err) {
            WhenUtil.call(deferred, err, userId);
        });
        
        return deferred.promise;    
    };
    
};

module.exports = new UserRepository();