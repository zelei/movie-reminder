var app = app || {};

var movieService = function($http, $q) {

    this.getRandomQuote = function() {
        var deferred = $q.defer();      
        $http.get('/movie/quote').success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };
    
    this.listTopMovies = function() {
        var deferred = $q.defer();      
        $http.get('/movie/top').success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };
    
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

	this.mark = function(movie) {
        var deferred = $q.defer();
        $http.post('/movie/mark', {movie : JSON.stringify(movie)}).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
	};
    
    this.unmark = function(movie) {
        var deferred = $q.defer();
        $http.post('/movie/unmark', {id : movie.id}).success(deferred.resolve).error(deferred.reject); 
        return deferred.promise;
	};
    
};

// returns the actual function
app.service( 'movieService', movieService);