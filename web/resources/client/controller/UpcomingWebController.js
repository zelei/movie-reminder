'use strict';

/* Controllers */

function UpcomingWebController($rootScope, $scope, movieService) {

    $scope.upcomingMovies = [];

    $scope.openedDescription = [];

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
        var service = movie.selected ? movieService.unmark(movie.id) : movieService.mark(movie.id);
        service.then(function() {
            $rootScope.$broadcast('upcoming-selection-change', movie.id);
        }).then(loadData);  
    };

    function loadData() {
        movieService.listUpcomingMovies().then(function(data) {
            $scope.upcomingMovies = data;
        });    
    }
    
    //init
    loadData();    
}