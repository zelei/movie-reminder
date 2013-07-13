'use strict';

/* Controllers */

function SearchWebController($scope, $http) {

    $scope.query = '';

    $scope.search = function() {
        if(!$scope.query) {
            console.log("return empty array");
            $scope.movies = [];
            return;
        }
        
       console.log('/movie/search?q=' + $scope.query);
        $http.get('/movie/search?q=' + $scope.query).success(function(data) {
            $scope.movies = data;
        });    
        
    }

}

//SearchController.$inject = ['$scope', '$http'];