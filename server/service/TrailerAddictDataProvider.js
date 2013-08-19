var env = require("rekuire")("env");
var request = require('request');
var when = require("when");
var xml2js = require('xml2js-expat');

var Trailer = env.require("/server/model/Trailer");

var TrailerAddictDataProvider = function(){

    this.getTrailers = function(imdbId) {
        
        var deferred = when.defer();
        
        request.get({url : "http://api.traileraddict.com/?imdb=" + imdbId + "&count=4&width=520"}, function (error, response, body) {
            error ? deferred.reject(error) : createParser(deferred).parseString(body);    
        });
        
        return deferred.promise;
    }
    
    function createParser(deferred) {
        return new xml2js.Parser(function(result, error) {
            if (!error) {

                var trailers = result.trailer || [];
                if (!(trailers instanceof Array)) {
                    trailers = [trailers];
                }
               
                deferred.resolve(trailers.map(function(trailer) {
                    return new Trailer(trailer.pubDate, trailer.embed);
                }));
            } else {
                deferred.reject(error);
            }
        });
    }
    
};

module.exports = new TrailerAddictDataProvider();