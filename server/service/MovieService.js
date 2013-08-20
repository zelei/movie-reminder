var env = require("rekuire")("env");
var when = require("when");
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

    this.getTopSelectedMovies = function(userId) {
        
        var deferred = when.defer();
        
        var selectedMovies = UserRepository.getTopSelectedMovies().then(function(movies) {
            return when.all(movies.map(dataProvider.getMovieDetails));
        });
        
        if(!userId) {
            selectedMovies.then(deferred.resolve, deferred.reject);
        } else {   
            when.join(selectedMovies, UserRepository.findById(userId))
                .then(function(joinedData) {return markSelectedMovies(joinedData[0], joinedData[1].selectedMovies);})
                .then(deferred.resolve, function(err) {console.log(err); deferred.reject(err);});
        }        
                
        return deferred.promise;        
    };
    
    this.listMarkedMoviesForUser = function(userId) {
        
        var deferred = when.defer();
        
        UserRepository.findById(userId).then(function(user) {
            var movieIds = user.selectedMovies.map(function(selectedMovie) {return selectedMovie.movieId}); 
            return when.all(movieIds.map(dataProvider.getMovieDetails));
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
        return this.dataProvider.getUpcomingMovies().then(sortByReleaseDate);        
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