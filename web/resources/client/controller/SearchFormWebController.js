'use strict';

/* Controllers */

function SearchFormWebController($rootScope, $scope, movieService, _) {
    
    $scope.query = '';

    ['searchlist-movie-search'].forEach(function(name) {
        $rootScope.$on(name, function(event, movieTitle) {
            $scope.query = movieTitle;
            $scope.search();
        }); 
    });
   
    $scope.clear = function() {
        $scope.query = '';
        $rootScope.$broadcast('searchform-cleared');   
    };
    
    $scope.search = function() {
        
        if(!$scope.query) {
            $rootScope.$broadcast('searchform-cleared');
            return;
        }
        
        startSearching();     
        movieService.search($scope.query).then(function(movies) {
           $rootScope.$broadcast('searchform-result-returned', movies);
        }).then(stopSearching);

    };

    function startSearching() {
        $scope.searching = true;
        $rootScope.$broadcast('searchform-search-started');
    }
    
    function stopSearching() {
        $scope.searching = false;
        $rootScope.$broadcast('searchform-search-stopped');
    }

}