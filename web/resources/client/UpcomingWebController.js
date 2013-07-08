'use strict';

/* Controllers */

function UpcomingWebController($scope, $http) {

        $scope.movies = [];

        $http.get('upcoming').success(function(data) {
            $scope.movies = data;
        });
}

//UpcomingWebController.$inject = ['$scope', '$http'];