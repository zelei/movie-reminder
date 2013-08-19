'use strict';

/* Controllers */

function TrailerWebController($scope) {

    $scope.selected = 0;

    $scope.isDisabled = function(index) {
        return $scope.selected == index;    
    }

    $scope.select = function(index) {
        $scope.selected = index;    
    }

}