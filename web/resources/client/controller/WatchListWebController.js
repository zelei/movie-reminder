'use strict';

/* Controllers */

function WatchListWebController($rootScope, $scope, movieService, _) {
   
    $scope.openedDescription = [];
   
    $scope.loading = false;
    
    ['upcoming-selection-change', 'searchlist-selection-change'].forEach(function(name) {
        $rootScope.$on(name, function(event) {
            $scope.loadData();
        }); 
    });

    $scope.select = function(movie) {
        
        movieService.unmark(movie).then(function(data) {
            $rootScope.$broadcast('watchlist-selection-change', movie.id);
        }).then($scope.loadData);  
    
    };

    $scope.loadData = function() {
        startLoading();
        movieService.listMyMovies().then(function(data) {
            return ($scope.movies = data);
        }).then(removeUnusedIds)
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