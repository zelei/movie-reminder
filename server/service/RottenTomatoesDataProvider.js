var env = require("rekuire")("env");
var WhenUtil = env.require("/server/util/WhenUtil");
var request = require('request');
var when = require("when");
var cache = require('memory-cache');
var winston = require('winston');

var Movie = env.require("/server/model/Movie");
var Link = env.require("/server/model/Link");

var MovieDataProvider = function(apiKey){

    this.apiKey = apiKey;
    
    this.search = function(query) {
        return callApi('/api/public/v1.0/movies.json?apikey=' + apiKey + '&q=' + encodeURIComponent(query))
                .then(convertRawDataToMovies);
    };
    
    this.getUpcomingMovies = function() {
        return callApi('/api/public/v1.0/lists/movies/upcoming.json?apikey=' + apiKey + '&page_limit=50&page=1&country=us')
                .then(convertRawDataToMovies);    
    };
    
    this.getMovieDetails = function(movieId) {
        
        if(cache.get("movie#" + movieId)) {
            winston.info("From cache: movie#%s", movieId);
            return when.resolve(cache.get("movie#" + movieId));
        }
        
        var putIntoCache = function(cacheableMovie) {
            winston.info("Put into cache:", "movie#%s", cacheableMovie.id);
            cache.put("movie#" + cacheableMovie.id, cacheableMovie, 1000 * 60 * 60 * 1); // 1h
            return cacheableMovie;
        };
        
        return callApi('/api/public/v1.0/movies/' + movieId + '.json?apikey=' + apiKey)
                .then(convertRawDataToMovie)
                .then(putIntoCache);    
    };
    
    function convertRawDataToMovies(moviesData) {                  

        if(moviesData.total === 0) {
            return [];
        }
        
        return moviesData.movies.map(convertRawDataToMovie);
    }
    
    
    function convertRawDataToMovie(movieData) { 
                               
        var links = [];            
        if(movieData.links && movieData.links.alternate) {
            links.push(new Link("rottentomatoes", movieData.links.alternate));
        }
    
        if(movieData.alternate_ids && movieData.alternate_ids.imdb) {
            links.push(new Link("imdb", 'http://www.imdb.com/title/tt' + movieData.alternate_ids.imdb));
        }
        try {
            var movie = new Movie( 
                      String(movieData.id)
                    , movieData.title
                    , movieData.posters.thumbnail
                    , movieData.synopsis
                    , movieData.release_dates.theater
                    , links);
                    
            return movie;        
        } catch(e) {    
            throw "LimitException"; 
        }        
    }
        
    function callApi(url) {
        
        var deferred = when.defer();
                
        request.get({url : "http://api.rottentomatoes.com" + url, json: true}, function (error, response, body) {
            WhenUtil.call(deferred, error, body);
        });  
        
        return deferred.promise;
    }
    
};

module.exports = new MovieDataProvider("g2s78atyq2725dc65zau9cyv");