var env = require("rekuire")("env");
var http = require("http");
var when = require("when");
var cache = require('memory-cache');
var winston = require('winston');
var jsonUtil = env.require("/server/util/JsonUtil");

var UserRepository = env.require("/server/service/repository/UserRepository");

var Movie = env.require("/server/model/Movie");
var Link = env.require("/server/model/Link");

var MovieService = function(apiKey){

    this.apiKey = apiKey;

    this.search = function(query) {
        var url = '/api/public/v1.0/movies.json?apikey=' + this.apiKey + '&q=' + encodeURIComponent(query);
        
        var deferred = when.defer();
        
        callApi(url)
            .then(convertMovieToShortDescription)
            .then(deferred.resolve, deferred.reject);
        
        return deferred.promise;
        
    };
        
    this.listUpcomingForUser = function(userId) {
        
        var deferred = when.defer();
        
        when.join(this.listUpcoming(), UserRepository.findById(userId))
            .then(function(joinedData) {return markSelectedMovies(joinedData[0], joinedData[1].selectedMovies);})
            .then(deferred.resolve, deferred.reject);
            
        return deferred.promise;        
    };
    
    this.listUpcoming = function() {
        var url = '/api/public/v1.0/lists/movies/upcoming.json?apikey=' + this.apiKey + '&page_limit=50&page=1&country=us';
        
        var deferred = when.defer();
        
        if(cache.get('listUpcoming')) {
            winston.info("return cached value");
            deferred.resolve(cache.get('listUpcoming'));
        } else {
            
            var putInotCache = function(cacheableData) {
                winston.info("put value into cache");
                cache.put('listUpcoming', cacheableData, 1000 * 60 * 60 * 12);
                return cacheableData;
            };
            
            callApi(url)
                .then(convertMovieToBriefDescription)
                .then(putInotCache)
                .then(deferred.resolve, deferred.reject);
        }
        
        return deferred.promise;
        
    };
    
    function callApi(url) {
        
        var options = {
            host: 'api.rottentomatoes.com',
            port: 80,
            path: url  
        };
        
        var deferred = when.defer();
        
        http.get(options, function(response) {
            jsonUtil.responseToJson(response).then(deferred.resolve);     
        }).on('error', deferred.reject);  
        
        return deferred.promise;
    }
    
    function markSelectedMovies(movies, selectedMovies) {      
        return movies.map(function(movie) {
            var clone = movie.clone();
            
            if(selectedMovies.indexOf(clone.id) != -1) {
                clone.selected = true;
            }
            
            return clone;
        });
    }
    
    function convertMovieToBriefDescription(moviesData) {                  

        if(moviesData.total > 0) {
            return moviesData.movies.map(function(movie) {
                    return new Movie( 
                              movie.id
                            , movie.title
                            , movie.posters.thumbnail
                            , movie.synopsis
                            , movie.release_dates.theater
                            , [ new Link("rottentomatoes", movie.links.alternate)
                              , new Link("imdb", 'http://www.imdb.com/title/tt' + movie.alternate_ids.imdb)])});
        }
    
    }
    
    function convertMovieToShortDescription(moviesData) {                  
        if(moviesData.total > 0) {
            return moviesData.movies.map(function(movie) {
                    return new Movie( 
                              movie.id
                            , movie.title
                            , movie.posters.thumbnail)});
        }
    }
    
};

module.exports = new MovieService("g2s78atyq2725dc65zau9cyv");