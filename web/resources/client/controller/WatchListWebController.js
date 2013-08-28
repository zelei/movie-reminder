'use strict';

/* Controllers */

function WatchListWebController($rootScope, $scope, movieService, _) {
   
    $scope.openedDescription = [];
   
    $scope.loading = false;
    
    ['upcoming:selection-changed', 'searchlist:selection-changed', 'top:selection-changed'].forEach(function(name) {
        $rootScope.$on(name, function() {
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
        .then(setMovies)
        .then(markSetLastOutgoing)
        .then(removeUnusedIds)
        .then(stopLoading);
        
    };

    function setMovies(data) {
        $scope.movies = data;
        return $scope.movies;
    }

    function markSetLastOutgoing(data) {
        var lastMovie = _.last(_.filter(data, function(movie) {
            return new Date(movie.releaseDate) <= new Date(); 
        }));
        
        if(lastMovie) {
            lastMovie.lastOutgoing = true;
        }
        
        return data;
    }

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