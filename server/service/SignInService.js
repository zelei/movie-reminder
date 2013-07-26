var env = require('rekuire')("env");
var when = require("when");
var UserRepository = env.require("/server/service/repository/UserRepository");
var CalendarService = env.require("/server/service/GoogleCalendarService");

var SignInService = function(){

    this.signIn = function(accessToken, refreshToken, profile, done) {
      
        UserRepository.findOneAndUpdate(profile.id, profile.name.givenName, accessToken)
            .then(function(user) {
                 
                if(user.calendarId) {
                    return user;    
                } else {
                    return createNewCalendar(user);
                } 
    
            }).then(function(user) {
                done(undefined, user);
            }, function(err) {
                done(err);
            });
            
   };
  
    function createNewCalendar(user) {
        var deferred = when.defer();
                
        CalendarService.createNewCalendar(user.accessToken, "Movie Reminder")
            .then(function(calendar) {
                
                UserRepository.setCalendarId(user.id, calendar.id).then(function() {
                    deferred.resolve(user);       
                });
                
            });
        
        return deferred.promise;
   }
   
};

module.exports = new SignInService();