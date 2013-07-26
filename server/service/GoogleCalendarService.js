var when = require("when");
var request = require('request');

var GoogleCalendarService = function(sheetKey){

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
    
    }
    
    
};

module.exports = new GoogleCalendarService("g2s78atyq2725dc65zau9cyv");