'use strict';

/* Controllers */

function SearchListWebController($rootScope, $scope, movieService, _) {

    $scope.movies = [];

    $scope.openedDescription = [];
    
    $scope.searching = false;

    $scope.noResult = false;

    ['watchlist:selection-changed', 'upcoming:selection-changed', 'top:selection-changed'].forEach(function(name) {
        $rootScope.$on(name, function(event, movieId) {
            $scope.movies.forEach(function(movie) {
                if(movie.id == movieId) {
                    movie.selected = !movie.selected;
                }            
            });
        }); 
    });

    $rootScope.$on("searchform:cleared", function(event, movies) {
        $scope.movies = [];
        $scope.openedDescription = [];
        $scope.noResult = false;
    });
    
    $rootScope.$on("searchform:result-returned", function(event, movies) {
        removeUnusedIds(movies);
        $scope.movies = movies;
        $scope.noResult = movies.length === 0;
    }); 

    $rootScope.$on("searchform:search-started", function(event, movies) {
        $scope.searching = true;
    }); 

    $rootScope.$on("searchform:search-stopped", function(event, movies) {
        $scope.searching = false;
    }); 

    $scope.select = function(movie) {
        movie.saving = true;
        
        var service = movie.selected ? movieService.unmark(movie) : movieService.mark(movie);
        
        service
        .then(function() {
            movie.selected = !movie.selected;
            $rootScope.$broadcast('searchlist:selection-changed', movie.id);})
        .then(function() { movie.saving = false; });
              
    };
   
    function removeUnusedIds(movies) {
        var movieIds = _.map(movies, function(movie){ return movie.id; });
        $scope.openedDescription = _.intersection($scope.openedDescription, movieIds);   
    }
    
}