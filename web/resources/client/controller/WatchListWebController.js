'use strict';

/* Controllers */

function WatchListWebController($rootScope, $scope, movieService, _) {
   
    $scope.openedDescription = [];
   
    $scope.loading = false;
    
    ['upcoming:selection-changed', 'searchlist:selection-changed', 'top:selection-changed'].forEach(function(name) {
        $rootScope.$on(name, function(event) {
            $scope.loadData();
        }); 
    });

    $scope.select = function(movie) {    
        movie.saving = true;
        
        movieService.unmark(movie)
        .then(function() { $rootScope.$broadcast('watchlist:selection-changed', movie.id);})
        .then($scope.loadData);  
        
    };

    $scope.loadData = function() {
        startLoading();
        
        movieService.listMyMovies()
        .then(function(data) { return ($scope.movies = data);})
        .then(removeUnusedIds)
        .then(stopLoading);
        
    };

    function startLoading() {
      $scope.loading = true;  
    }
    
    function stopLoading() {
      $scope.loading = false;  
    }
    
    function removeUnusedIds(movies) {
        var movieIds = _.map(movies, function(movie){ return movie.id; }); 
        $scope.openedDescription = _.intersection($scope.openedDescription, movieIds);
    }
    
    //init
    $scope.loadData();
}