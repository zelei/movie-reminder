var env = require("rekuire")("env");
var when = require("when");
var logger = require('winston');
var WhenUtil = env.require("/server/util/WhenUtil");

var User = env.require("/server/model/User");
var SelectedMovie = env.require("/server/model/SelectedMovie");

var UserRepository = function() {

    this.getEventId = function(userId, movieId) {
        var deferred = when.defer();
                        
        var query = {"id": userId};
              
        User.findOne(query, function(err, user) {
            WhenUtil.call(deferred, err, findEventId(user.selectedMovies, movieId));
        });
        
        return deferred.promise; 
    };
    
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
                
        User.update({'id': userId}, {'$addToSet': {'selectedMovies': new SelectedMovie({'movieId' : movieId, 'eventId' : eventId})}}, function(err) {
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
    
    function findEventId(selectedMovies, movieId) {
        
        if(!selectedMovies || !movieId) {
            return undefined;
        }
        
        var eventId;
        selectedMovies.forEach(function(selectedMovie) {
            if(selectedMovie.movieId == movieId) {
                eventId = selectedMovie.eventId;
                return false;
            }
        });
        
        logger.info("Found event(%s)", eventId);
        
        return eventId;
    }
    
};

module.exports = new UserRepository();