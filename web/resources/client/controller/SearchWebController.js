'use strict';

/* Controllers */

function SearchWebController($rootScope, $scope, movieService, _) {

    $scope.movies = [];

    $scope.openedDescription = [];
    
    $scope.searching = false;
    
    $scope.query = '';

    ['watchlist-selection-change', 'upcoming-selection-change'].forEach(function(name) {
        $rootScope.$on(name, function(event, movieId) {
            $scope.movies.forEach(function(movie) {
                if(movie.id == movieId) {
                    movie.selected = !movie.selected;
                }            
            });
        }); 
    });

    ['searchlist-movie-search'].forEach(function(name) {
        $rootScope.$on(name, function(event, movieTitle) {
            $scope.query = movieTitle;
            $scope.search();
        }); 
    });

    $scope.select = function(movie) {
        movie.saving = true;
        
        var service = movie.selected ? movieService.unmark(movie) : movieService.mark(movie);
        
        service
        .then(function() {
            movie.selected = !movie.selected;
            $rootScope.$broadcast('searchlist-selection-change', movie.id);})
        .then(function() { movie.saving = false; });
              
    };
   
    $scope.clear = function() {
        $scope.query = ''
        $scope.movies = [];   
    };
    
    $scope.search = function() {
        if(!$scope.query) {
            $scope.movies = [];
            $scope.openedDescription = [];
            return;
        }
        
        startSearching();     
        movieService.search($scope.query).then(function(data) {
            return ($scope.movies = data);
        }).then(removeUnusedIds)
          .then(stopSearching);

    };

    function startSearching() {
      $scope.searching = true;  
    }
    
    function stopSearching() {
      $scope.searching = false;  
    }

    function removeUnusedIds(upcomingMovies) {
        var movieIds = _.map(upcomingMovies, function(movie){ return movie.id; });
        $scope.openedDescription = _.intersection($scope.openedDescription, movieIds);   
    }
    
}