'use strict';

/* Controllers */

function QuoteWebController($rootScope, $scope, movieService) {

    $scope.select = function(quote) {
        $rootScope.$broadcast('searchlist-movie-search', quote.movie);
    };

    $scope.loadData = function() {
        movieService.getRandomQuote().then(function(data) {
            return $scope.quote = data;
        });    
    };
    
    //init
    $scope.loadData();
}