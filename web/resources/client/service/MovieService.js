var app = app || {};

var movieService = function($http, $q) {

    this.search = function(query) {
        var deferred = $q.defer();      
        $http.get('/movie/search?q=' + query).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    this.listMyMovies = function() {
        var deferred = $q.defer();
        $http.get('/movie/mymovies').success(deferred.resolve).error(deferred.reject);
        return deferred.promise;  
    };

    this.listUpcomingMovies = function() {
        var deferred = $q.defer();
        $http.get('/movie/upcoming').success(deferred.resolve).error(deferred.reject);  
        return deferred.promise;  
    };

	this.mark = function(movieId) {
        var deferred = $q.defer();
        $http.post('/movie/mark', {id : movieId}).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
	};
    
    this.unmark = function(movieId) {
        var deferred = $q.defer();
        $http.post('/movie/unmark', {id : movieId}).success(deferred.resolve).error(deferred.reject); 
        return deferred.promise;
	};
    
};

// returns the actual function
app.service( 'movieService', movieService );