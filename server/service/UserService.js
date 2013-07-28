var env = require("rekuire")("env");
var when = require("when");
var userRepository = env.require("/server/service/repository/UserRepository");
var CalendarService = env.require("/server/service/GoogleCalendarService");

var UserService = function() {

    this.markMovie = function(accessToken, calendarId, userId,  movie){
        
        var deferred = when.defer();
         
        CalendarService.createEvent(accessToken, calendarId, movie)
        .then(function(event) {
            return userRepository.markMovie(userId, movie.id, event.id);
        }).then(deferred.resolve, deferred.reject);
           
        return deferred.promise; 
    };
    
    this.unmarkMovie = function(accessToken, calendarId, userId, movieId){
        
        var deferred = when.defer();
        
        userRepository.findOne(userId).then(function(user) {
        
            var eventId;
            user.selectedMovies.forEach(function(selectedMovie) {
                if(selectedMovie.movieId == movieId) {
                    eventId = selectedMovie.eventId;
                    return false;
                }
            });
    
            CalendarService.removeEvent(accessToken, calendarId, eventId)
            .then(function() {
                return userRepository.unmarkMovie(userId, movieId);
            }).then(deferred.resolve, deferred.reject);
        
        });
        

        return deferred.promise;     
    };

};

module.exports = new UserService();
