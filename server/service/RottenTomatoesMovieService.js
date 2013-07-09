var context = require("rekuire")("webconfiguration");
var http = require("http");
var when = require("when");
var cache = require('memory-cache');
var winston = require('winston');
var jsonUtil = context.require("/server/util/JsonUtil");

var MovieService = function(apiKey){

    this.apiKey = apiKey;

    this.search = function(query) {
        var url = '/api/public/v1.0/movies.json?apikey=' + this.apiKey + '&q=' + encodeURIComponent(query);
        
        var deferred = when.defer();
        
        callApi(url)
            .then(convertMovieToShortDescription)
            .then(deferred.resolve, deferred.reject);
        
        return deferred.promise;
        
    }
    
    this.listUpcoming = function() {
        var url = '/api/public/v1.0/lists/movies/upcoming.json?apikey=' + this.apiKey + '&page_limit=50&page=1&country=us';
        
        var deferred = when.defer();
        
        if(cache.get('listUpcoming')) {
            winston.info("return cached value");
            deferred.resolve(cache.get('listUpcoming'));
        } else {
            
            var callbackWrapper = function(cacheableData) {
                winston.info("put value into cache");
                cache.put('listUpcoming', cacheableData, 1000 * 60 * 60 * 12);
                return cacheableData;
            }
            
            callApi(url)
                .then(convertMovieToBriefDescription)
                .then(callbackWrapper)
                .then(deferred.resolve, deferred.reject);
        }
        
        return deferred.promise;
        
    }
    
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
    
    function convertMovieToBriefDescription(moviesData) {                  
        var movies = [];

        if(moviesData.total > 0) {           
            for (var i = 0; i < moviesData.movies.length; i++) {
                var movie = moviesData.movies[i];
                movies.push({ 'id' : movie.id
                            , 'title' : movie.title
                            , 'thumbnail' : movie.posters.thumbnail
                            , 'synopsis' : movie.synopsis
                            , 'release_dates' : movie.release_dates.theater
                            , 'links' : {'rottentomatoes' : movie.links.alternate,
                                         'imdb' : 'http://www.imdb.com/title/tt' + movie.alternate_ids.imdb}});
            }
        }
        
        return movies;
    }
    
    function convertMovieToShortDescription(moviesData) {                  
        var movies = [];

        if(moviesData.total > 0) {           
            for (var i = 0; i < moviesData.movies.length; i++) {
                var movie = moviesData.movies[i];
                movies.push({'id' : movie.id,
                             'title' : movie.title, 
                             'thumbnail' : movie.posters.thumbnail});
            }
        }
        
        return movies;
    }
    
}

module.exports = new MovieService("g2s78atyq2725dc65zau9cyv");