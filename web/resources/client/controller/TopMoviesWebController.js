'use strict';

/* Controllers */

function TopMoviesWebController($rootScope, $scope, movieService, _) {

    $scope.topMovies = [];

    $scope.openedDescription = [];

    $scope.loading = false;
    
    ['watchlist:selection-changed', 'searchlist:selection-changed', 'upcoming:selection-changed'].forEach(function(name) {
        $rootScope.$on(name, function(event, movieId) {            
            $scope.loadData();
        }); 
    });
    
    $scope.select = function(movie) {
        movie.saving = true;
        var service = movie.selected ? movieService.unmark(movie) : movieService.mark(movie);
        
        service
        .then(function() { $rootScope.$broadcast('top:selection-changed', movie.id); })
        .then(function() { movie.saving = false; })
        .then($scope.loadData);  
    };

    $scope.loadData = function() {
        startLoading();
        movieService.listTopMovies().then(function(data) {
            return ($scope.topMovies = data);
        }).then(removeUnusedIds) 
          .then(stopLoading);    
    };
    
    function startLoading() {
      $scope.loading = true;  
    }
    
    function stopLoading() {
      $scope.loading = false;  
    }
    
    function removeUnusedIds(topMovies) {
        var movieIds = _.map(topMovies, function(movie){ return movie.id; });
        $scope.openedDescription = _.intersection($scope.openedDescription, movieIds);   
    }
    
    //init
   $scope.loadData();    
}