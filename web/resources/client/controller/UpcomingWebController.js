'use strict';

/* Controllers */

function UpcomingWebController($rootScope, $scope, movieService, _) {

    $scope.upcomingMovies = [];

    $scope.openedDescription = [];

    $scope.loading = false;
    
    ['watchlist-selection-change', 'searchlist-selection-change', 'upcoming-selection-change'].forEach(function(name) {
        $rootScope.$on(name, function(event, movieId) {
            $scope.upcomingMovies.forEach(function(movie) {
                if(movie.id == movieId) {
                    movie.selected = !movie.selected;
                }            
            });
        }); 
    });
    
    $scope.select = function(movie) {
        movie.saving = true;
        var service = movie.selected ? movieService.unmark(movie) : movieService.mark(movie);
        
        service
        .then(function() { $rootScope.$broadcast('upcoming-selection-change', movie.id); })
        .then(function() { movie.saving = false; });  
    };

    $scope.loadData = function() {
        startLoading();
        movieService.listUpcomingMovies().then(function(data) {
            return ($scope.upcomingMovies = data);
        }).then(removeUnusedIds)
          .then(stopLoading);    
    };
    
    function startLoading() {
      $scope.loading = true;  
    }
    
    function stopLoading() {
      $scope.loading = false;  
    }
    
    function removeUnusedIds(upcomingMovies) {
        var movieIds = _.map(upcomingMovies, function(movie){ return movie.id; });
        $scope.openedDescription = _.intersection($scope.openedDescription, movieIds);   
    }
    
    //init
   $scope.loadData();    
}