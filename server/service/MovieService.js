var env = require("rekuire")("env");
var when = require("when");
var cache = require('memory-cache');
var winston = require('winston');

var movieDataProvider = env.require("/server/service/RottenTomatoesDataProvider");
var UserRepository = env.require("/server/service/repository/UserRepository");

var Movie = env.require("/server/model/Movie");

var MovieService = function(dataProvider){

    this.dataProvider = dataProvider;

    this.search = function(query, userId) {
       
        var deferred = when.defer();
        
        when.join(this.dataProvider.search(query), UserRepository.findById(userId))
            .then(function(joinedData) {return markSelectedMovies(joinedData[0], joinedData[1].selectedMovies);})
            .then(sortByReleaseDate)
            .then(deferred.resolve, deferred.reject);
            
        return deferred.promise;
        
    };
    
    this.listMarkedMoviesForUser = function(userId) {
        
        var deferred = when.defer();
        
        UserRepository.findById(userId).then(function(user) {
            return when.all(user.selectedMovies.map(dataProvider.getMovieDetails));
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
        
        if(cache.get('listUpcoming')) {
            return when.resolve(cache.get('listUpcoming')); 
        }

        var deferred = when.defer();
        
        var putIntoCache = function(cacheableData) {
            winston.info("put value into cache");
            cache.put('listUpcoming', cacheableData, 1000 * 60 * 60 * 1); // 1h
            return cacheableData;
        };
        
        this.dataProvider.getUpcomingMovies()
            .then(sortByReleaseDate)
            .then(putIntoCache)
            .then(deferred.resolve, deferred.reject);
        
        
        return deferred.promise;
        
    };
    
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
    
};

module.exports = new MovieService(movieDataProvider);