var env = require("rekuire")("env");
var request = require('request');
var when = require("when");
var xml2js = require('xml2js');

var Trailer = env.require("/server/model/Trailer");

var TrailerAddictDataProvider = function(){

    this.getTrailers = function(imdbId) {
        
        var deferred = when.defer();
        
        request.get({url : "http://api.traileraddict.com/?imdb=" + imdbId + "&count=6&width=520"}, function (error, response, body) {           
            error ? deferred.reject(error) : parseXml(body).then(deferred.resolve, deferred.reject);    
        });
        
        return deferred.promise;
    }
    
    function parseXml(body) {
        
        var deferred = when.defer();

        xml2js.parseString(body, function (error, result) {
            if (!error) {
                var trailers = result.trailers.trailer || [];
                deferred.resolve(trailers.map(function(trailer) {
                    return new Trailer(trailer.pubDate, trailer.embed);
                }));
            } else {
                deferred.reject(error);
            }
        });
        
        return deferred.promise;
    }
    
};

module.exports = new TrailerAddictDataProvider();