var env = require("rekuire")("env");
var when = require("when");
var userRepository = env.require("/server/service/repository/UserRepository");
var CalendarService = env.require("/server/service/GoogleCalendarService");

var UserService = function() {

    this.markMovie = function(user, movie){
        
        console.log(user);
        
        var deferred = when.defer();
         
        CalendarService.createEvent(user.accessToken, user.calendarId, movie).then(function(event) {
            return userRepository.markMovie(user.id, movie.id, event.id);
        }).then(deferred.resolve, deferred.reject);
           
        return deferred.promise; 
    };
    
    this.unmarkMovie = function(user, movieId){
        
        var deferred = when.defer();
                
        userRepository.getEventId(user.id, movieId).then(function(eventId) {
            return CalendarService.removeEvent(user.accessToken, user.calendarId, eventId);
        }).then(function() {
            return userRepository.unmarkMovie(user.id, movieId);
        }).then(deferred.resolve, deferred.reject);
        
        return deferred.promise;     
    };

};

module.exports = new UserService();
