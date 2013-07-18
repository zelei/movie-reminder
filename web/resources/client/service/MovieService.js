var angular = angular || {};
var app = angular.module('app', []);

app.factory('_', function() {
  return window._; 
});

app.directive('zippy', function($compile, _){
    
    var expandableTemplate = 
                '<div>' +
                  '<span ng-show="!open">{{shortDescription}}</span>&nbsp;<span ng-show="!open" ng-click="readMore($event, key)" class="badge badge-info">read more</span>'+
                  '<span ng-show="open">{{synopsis}}</span>&nbsp;<span ng-show="open" ng-click="readLess($event, key)" class="badge badge-info">read less</span>' +
                '</div>';
                           
    var simpleTemplate = '<div>{{shortDescription}}</div>';
                
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: { synopsis : '@synopsis', key : '@key', keyStore : "=keyStore" },
        link: function(scope, element, attrs) {
            
            scope.readMore = function(event, key) {
                event && event.stopPropagation();
                scope.open = true;
                scope.keyStore.push(key);
            };
            
            scope.readLess = function(event, key) {
                event && event.stopPropagation();
                scope.open = false;
                scope.keyStore.splice(scope.keyStore.indexOf(key), 1);
            };
            
            scope.$watch('key', function(key) {
                scope.open = _.contains(scope.keyStore, key);
            });
            
            scope.$watch('synopsis', function(val) {
                var words = val.split(" ");
                var shortDescriptionWordCount = 6;  
                
                if(words.length > shortDescriptionWordCount && words.length - shortDescriptionWordCount > 6) {
                    element.html($compile( expandableTemplate )( scope ));
                    var values = [];    
                    for(var i = 0, l = shortDescriptionWordCount; i < l; i++) {values.push(words[i]);}                
                    scope.shortDescription = values.join(" ") + "...";
                } else {
                    element.html($compile( simpleTemplate )( scope ));
                    scope.shortDescription = val;
                }
                
            });
               
        }
    }
  });
        
var movieService = function($http, $q) {

    this.search = function(query) {
        var deferred = $q.defer();      
        $http.get('/movie/search?q=' + query).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    }

    this.listMyMovies = function() {
        var deferred = $q.defer();
        $http.get('/movie/mymovies').success(deferred.resolve).error(deferred.reject);
        return deferred.promise;  
    }

    this.listUpcomingMovies = function() {
        var deferred = $q.defer();
        $http.get('/movie/upcoming').success(deferred.resolve).error(deferred.reject);  
        return deferred.promise;  
    }

	this.mark = function(movieId) {
        var deferred = $q.defer();
        $http.post('/movie/mark', {id : movieId}).success(deferred.resolve).error(deferred.reject);  
        return deferred.promise;
	};
    
    this.unmark = function(movieId) {
        var deferred = $q.defer();
        $http.post('/movie/unmark', {id : movieId}).success(deferred.resolve).error(deferred.reject);  
        return deferred.promise;
	};
    
};

// returns the actual function
app.service( 'movieService', movieService );