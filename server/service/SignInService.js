var env = require('rekuire')("env");
var logger = require('winston');
var when = require("when");
var UserRepository = env.require("/server/service/repository/UserRepository");
var CalendarService = env.require("/server/service/GoogleCalendarService");

var SignInService = function(){

    this.signIn = function(accessToken, refreshToken, profile, done) {
      
        UserRepository.findOneAndUpdate(profile.id, profile.name.givenName, accessToken)
            .then(function(user) {              
                return user.calendarId ? user : createNewCalendar(user);  
            }).then(function(user) {
                logger.info("User(%s-%s) signed in.", user.name, user.id);
                done(undefined, user);
            }, function(err) {
                done(err);
            });
            
   };
  
    function createNewCalendar(user) {
        var deferred = when.defer();
                
        CalendarService.createNewCalendar(user.accessToken, "Movie Reminder")
            .then(function(calendar) {
                
                logger.info("Create new calendar(%s) for user(%s).", calendar.id, user.id);
                UserRepository.setCalendarId(user.id, calendar.id).then(function() {
                    deferred.resolve(user);       
                });
                
            });
        
        return deferred.promise;
   }
   
};

module.exports = new SignInService();