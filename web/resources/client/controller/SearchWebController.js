'use strict';

/* Controllers */

function SearchWebController($rootScope, $scope, movieService) {

    $scope.movies = [];

    $scope.searching = false;
    
    $scope.query = '';

    ['watchlist-selection-change'].forEach(function(name) {
        $rootScope.$on(name, function(event, movieId) {
            $scope.movies.forEach(function(movie) {
                if(movie.id == movieId) {
                    movie.selected = !movie.selected;
                }            
            });
        }); 
    });

    $scope.select = function(movie) {
        var service = movie.selected ? movieService.unmark(movie.id) : movieService.mark(movie.id);
        service.then(function() {
            movie.selected = !movie.selected;
            $rootScope.$broadcast('searchlist-selection-change', movie.id);
        });  
    };
    
    $scope.search = function() {
        if(!$scope.query) {
            console.log("return empty array");
            $scope.movies = [];
            return;
        }
        
        startSearching();     
        movieService.search($scope.query).then(function(data) {
            $scope.movies = data;
        }).then(stopSearching);

    };

    function startSearching() {
      $scope.searching = true;  
    }
    
    function stopSearching() {
      $scope.searching = false;  
    }

}