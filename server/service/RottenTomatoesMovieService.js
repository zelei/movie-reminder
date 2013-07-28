var env = require("rekuire")("env");
var WhenUtil = env.require("/server/util/WhenUtil");
var request = require('request');
var when = require("when");
var cache = require('memory-cache');
var winston = require('winston');

var UserRepository = env.require("/server/service/repository/UserRepository");

var Movie = env.require("/server/model/Movie");
var Link = env.require("/server/model/Link");

var MovieService = function(apiKey){

    this.apiKey = apiKey;

    this.search = function(query, userId) {
        var url = '/api/public/v1.0/movies.json?apikey=' + this.apiKey + '&q=' + encodeURIComponent(query);
        
        var deferred = when.defer();
        
        when.join(callApi(url).then(convertMovieToBriefDescription), UserRepository.findById(userId))
            .then(function(joinedData) {return markSelectedMovies(joinedData[0], joinedData[1].selectedMovies);})
            .then(sortByReleaseDate)
            .then(deferred.resolve, deferred.reject);
            
        return deferred.promise;
        
    };
    
    this.listMarkedMoviesForUser = function(userId) {
        
        var deferred = when.defer();
        
        UserRepository.findById(userId).then(function(user) {
            return when.all(user.selectedMovies.map(function(selectedMovie) {
                return callApi('/api/public/v1.0/movies/'+selectedMovie.movieId+'.json?apikey=' + apiKey);
            }));
        }).then(function(movies){
            return convertMovieToBriefDescription({'total' : movies.length, 'movies' : movies});
        }).then(sortByReleaseDate).then(deferred.resolve, deferred.reject);
            
        return deferred.promise;        
    };
    
    this.listUpcomingForUser = function(userId) {
        
        var deferred = when.defer();
        
        when.join(this.listUpcoming(), UserRepository.findById(userId))
            .then(function(joinedData) {return markSelectedMovies(joinedData[0], joinedData[1].selectedMovies);})
            .then(sortByReleaseDate)
            .then(deferred.resolve, deferred.reject);
            
        return deferred.promise;        
    };
    
    this.listUpcoming = function() {
        var url = '/api/public/v1.0/lists/movies/upcoming.json?apikey=' + this.apiKey + '&page_limit=50&page=1&country=us';
        
        var deferred = when.defer();
        
        if(cache.get('listUpcoming')) {
            deferred.resolve(cache.get('listUpcoming'));
        } else {
            
            var putIntoCache = function(cacheableData) {
                winston.info("put value into cache");
                cache.put('listUpcoming', cacheableData, 1000 * 60 * 60 * 1); // 1h
                return cacheableData;
            };
            
            callApi(url)
                .then(convertMovieToBriefDescription)
                .then(sortByReleaseDate)
                .then(putIntoCache)
                .then(deferred.resolve, deferred.reject);
        }
        
        return deferred.promise;
        
    };
    
    function callApi(url) {
        
        var deferred = when.defer();
                
        request.get({url : "http://api.rottentomatoes.com" + url, json: true}, function (error, response, body) {
            WhenUtil.call(deferred, error, body);
        });  
        
        return deferred.promise;
    }
    
    function markSelectedMovies(movies, selectedMovies) {
        
        var selectedMovieIds = selectedMovies.map(function(selectedMovie) {
           return selectedMovie.movieId; 
        });
        
        return movies.map(function(movie) {
            var clone = movie.clone();
            
            if(selectedMovieIds.indexOf(clone.id) != -1) {
                clone.selected = true;
            }
            
            return clone;
        });
    }
    
    function sortByReleaseDate(movies) {
        movies.sort(Movie.compare);
        return movies;
    }
    
    function convertMovieToBriefDescription(moviesData) {                  

        if(moviesData.total === 0) {
            return [];
        }
        
        return moviesData.movies.map(function(movie) {
                var links = [];            
                if(movie.links && movie.links.alternate) {
                    links.push(new Link("rottentomatoes", movie.links.alternate));
                }
            
                if(movie.alternate_ids && movie.alternate_ids.imdb) {
                    links.push(new Link("imdb", 'http://www.imdb.com/title/tt' + movie.alternate_ids.imdb));
                }
            
                return new Movie( 
                          String(movie.id)
                        , movie.title
                        , movie.posters.thumbnail
                        , movie.synopsis
                        , movie.release_dates.theater
                        , links)});

    }
    
};

module.exports = new MovieService("g2s78atyq2725dc65zau9cyv");