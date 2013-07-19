var angular = angular || {};
var app = angular.module('app', []);

app.factory('_', function() {
  return window._; 
});

app.directive('read', function($compile, _){
    

    var bindSimpleTemplate = function (scope, element, val) {                     
        
        var simpleTemplate = '<div>{{shortDescription}}</div>';
        element.html($compile( simpleTemplate )( scope ));
        
        scope.shortDescription = val;
        
    };
    
    var bindExpandableTemplate = function(scope, element, val) {
            
        scope.readMore = function(event, key) {
            event && event.stopPropagation();
            scope.keyStore && scope.keyStore.push(key);
            scope.open = true;
        };
        
        scope.readLess = function(event, key) {
            event && event.stopPropagation();
            scope.keyStore && scope.keyStore.splice(scope.keyStore.indexOf(key), 1);
            scope.open = false;
        };
        
        scope.$watch('key', function(key) {
            scope.open = _.contains(scope.keyStore, key);
        });

        var expandableTemplate = 
                '<div>' +
                  '<span ng-show="!open">{{shortDescription}}</span>&nbsp;<span ng-show="!open" ng-click="readMore($event, key)" class="pointer label label-inverse">read more</span>'+
                  '<span ng-show="open">{{synopsis}}</span>&nbsp;<span ng-show="open" ng-click="readLess($event, key)" class="pointer label label-inverse">read less</span>' +
                '</div>';
                
        element.html($compile( expandableTemplate )( scope ));
        
        scope.shortDescription = val;
        
    };
    
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: { synopsis : '@synopsis', key : '@key', keyStore : "=keyStore" },
        link: function(scope, element, attrs) {
            
            scope.$watch('synopsis', function(val) {   
                var words = val.split(" ");
                var shortDescriptionWordCount = 6;  
                
                if(words.length > shortDescriptionWordCount && words.length - shortDescriptionWordCount > 6) {
                    var values = [];    
                    for(var i = 0, l = shortDescriptionWordCount; i < l; i++) {values.push(words[i]);}                
                    bindExpandableTemplate(scope, element, values.join(" ") + "...");
                } else {
                    bindSimpleTemplate(scope, element, val);
                }
                
            });
               
        }
    }
});