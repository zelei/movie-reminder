var env = require("rekuire")("env");
var WhenUtil = env.require("/server/util/WhenUtil");
var request = require('request');
var when = require("when");
var cache = require('memory-cache');
var winston = require('winston');

var TrailerDataProvider = env.require("/server/service/TrailerAddictDataProvider");

var Movie = env.require("/server/model/Movie");
var Link = env.require("/server/model/Link");

var MovieDataProvider = function(apiKey){

    this.apiKey = apiKey;
    
    this.search = function(query) {
        return callApi('/api/public/v1.0/movies.json?apikey=' + apiKey + '&q=' + encodeURIComponent(query))
                .then(convertRawDataToMovies)
                .then(putMoviesIntoCache);
    };
    
    this.getUpcomingMovies = function() {
        
        if(cache.get('listUpcoming')) {
            return when.resolve(cache.get('listUpcoming')); 
        }
  
        var putListIntoCache = function(cacheableData) {
            winston.info("Put list into cache");
            cache.put('listUpcoming', cacheableData, 1000 * 60 * 60 * 1); // 1h
            return cacheableData;
        };
        
        winston.info("Load upcoming movies from rottentomatoes")
        return callApi('/api/public/v1.0/lists/movies/upcoming.json?apikey=' + apiKey + '&page_limit=50&page=1&country=us')
                .then(convertRawDataToMovies)
                .then(putMoviesIntoCache)
                .then(putListIntoCache);    
    };
    
    this.getMovieDetails = function(movieId) {
        
        if(cache.get("movie#" + movieId)) {
            winston.info("From cache: movie#", movieId);
            return when.resolve(cache.get("movie#" + movieId));
        }
        
        return callApi('/api/public/v1.0/movies/' + movieId + '.json?apikey=' + apiKey)
                .then(convertRawDataToMovie)
                .then(putMovieIntoCache);    
    };

    function putMoviesIntoCache(cacheableMovies) {
        cacheableMovies.forEach(putMovieIntoCache);
        return cacheableMovies;
    };

    function putMovieIntoCache(cacheableMovie) {
        var expTime = 1000 * 60 * 60 * 1 + getRandomNumber(5, 20) * 60;
        winston.info("Put movie into cache: movie#%s - expTime:%d", cacheableMovie.id, expTime);
        cache.put("movie#" + cacheableMovie.id, cacheableMovie, expTime); // 1h + 5-20m
        return cacheableMovie;
    };

    function convertRawDataToMovies(moviesData) {                  
                
        if(moviesData.error) {
            return when.reject(moviesData.error);    
        }
        
        if(moviesData.total === 0) {
            return when.resolve([]);
        }
        
        winston.info("Data length:", moviesData.total);
        
        var deferred = when.defer();

        when.all(moviesData.movies.map(convertRawDataToMovie)).then(deferred.resolve, deferred.reject);
        
        return deferred.promise;
    }
    
    
    function convertRawDataToMovie(movieData) { 
        
        try {
            
            var links = [];            
            if(movieData.links && movieData.links.alternate) {
                links.push(new Link("rottentomatoes", movieData.links.alternate));
            }
        
            if(movieData.alternate_ids && movieData.alternate_ids.imdb) {
                links.push(new Link("imdb", 'http://www.imdb.com/title/tt' + movieData.alternate_ids.imdb));
                
                winston.info("Create movie with trailers", movieData.alternate_ids.imdb);
                
                var deferred = when.defer();
                TrailerDataProvider.getTrailers(movieData.alternate_ids.imdb).then(function(trailers) {    
                    return createMovie( 
                              String(movieData.id)
                            , movieData.title
                            , movieData.posters.thumbnail
                            , movieData.synopsis
                            , movieData.release_dates.theater
                            , links
                            , trailers);    
                }, deferred.reject).then(deferred.resolve);
                
                return deferred.promise;
                
            } else {
                winston.info("Create movie without trailers")          
                return when.resolve(createMovie( 
                      String(movieData.id)
                    , movieData.title
                    , movieData.posters.thumbnail
                    , movieData.synopsis
                    , movieData.release_dates.theater
                    , links));
                    
            }       
            
        } catch(e) {
            winston.info(e);
            return when.reject({type: "LimitException", exception: e}); 
        }   
        
    }
        
    function callApi(url) {
        
        var deferred = when.defer();
                
        request.get({url : "http://api.rottentomatoes.com" + url, json: true}, function (error, response, body) {
            WhenUtil.call(deferred, error, body);
        });  
        
        return deferred.promise;
    }
    
    function createMovie(id, title, thumbnail, synopsis, release_dates, links, trailers) {
         return new Movie( 
                      String(id)
                    , title
                    , thumbnail
                    , synopsis
                    , release_dates
                    , links
                    , trailers)    
    }
     
    function getRandomNumber(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    } 
     
};

module.exports = new MovieDataProvider("g2s78atyq2725dc65zau9cyv");