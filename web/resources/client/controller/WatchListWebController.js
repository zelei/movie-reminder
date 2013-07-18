'use strict';

/* Controllers */

function WatchListWebController($rootScope, $scope, movieService) {
    
    ['upcoming-selection-change', 'searchlist-selection-change'].forEach(function(name) {
        $rootScope.$on(name, function(event) {
            loadData();
        }); 
    });

    $scope.select = function(movie) {
        
        movieService.unmark(movie.id).then(function(data) {
            $rootScope.$broadcast('watchlist-selection-change', movie.id);
        }).then(loadData);  
    
    }

    function loadData() {
        movieService.listMyMovies().then(function(data) {
            $scope.movies = data;
        });    
    }
    
    //init
    loadData();
}