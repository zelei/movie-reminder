var when = require("when");
var logger = require('winston');
var request = require('request');

var GoogleCalendarService = function(){

    this.createNewCalendar = function(accessToken, name) {
        
        var deferred = when.defer();
        
        var callback = function (error, response, body) {
            if(error) return deferred.reject(error);
            return deferred.resolve(body);
        };
    
        var uri = "https://www.googleapis.com/calendar/v3/calendars?access_token=" + accessToken;
        var body = {"summary" : name};
    
        request({ method: 'POST', uri: uri, json:true, body: body }, callback);
    
        return deferred.promise;
    
    };
    
    this.createEvent = function(accessToken, calendarId, movie) {
        var deferred = when.defer();
        
        var callback = function (error, response, event) {
            if(response.statusCode == 200) {
                logger.info("Event(%s) was created.", event.id);
                deferred.resolve(event);
            } else {
                logger.info(event.error);
                deferred.reject(event.error);     
            }
        };
    
        var uri = "https://www.googleapis.com/calendar/v3/calendars/"+calendarId+"/events?access_token=" + accessToken;
        
        var releaseDate = fomatDate(new Date(movie.releaseDate));
        var body = {"summary": movie.title
                  , "description": movie.synopsis 
                  , "start": {"date": releaseDate}
                  , "end": {"date": releaseDate}
                  , "transparency": "transparent"
                  , "reminders": { 
                          "useDefault": false
                        , "overrides": [ { "method": "email", "minutes": 0 } ] }
                  };
    
        logger.info("Create a new event for '%s' movie", movie.title);
        request({ method: 'POST', uri: uri, json:true, body: body }, callback);
        
        return deferred.promise; 
    };
    
    this.removeEvent = function(accessToken, calendarId, eventId) {
        var deferred = when.defer();
        
        var callback = function (error, response, event) {
            if(response.statusCode == 204) {
                logger.info("Event was removed.");
                deferred.resolve();
            } else {         
                deferred.reject(error);     
            }
        };
    
        var uri = "https://www.googleapis.com/calendar/v3/calendars/"+calendarId+"/events/"+eventId+"?access_token=" + accessToken;
        
        logger.info("Delete event(%s) form calendar(%s)", eventId, calendarId);        
        request({ method: 'DELETE', uri: uri, json:true}, callback);
        
        return deferred.promise; 
    };
    
    function fomatDate(date) {
        return date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
    }
    
};

module.exports = new GoogleCalendarService();