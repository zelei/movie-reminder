var angular = angular || {};
var app = angular.module('app', []);

app.factory('_', function() {
  return window._; 
});

app.run(function($templateCache) {
  $templateCache.put('share-movies-template.html');
});

'use strict';
app.directive('shareMovie', ['$parse', '$compile', '$templateCache', function ($parse, $compile, $templateCache) {
        
    $('html').on('click.popover.data-api',function(event) {
        console.log("aaaa", event);
       //$('.popover').popover('hide');
    });
    
    return {
        restrict: 'A',
        scope: true,
        link: function postLink(scope, element, attr, ctrl) {
            var options = {placement : 'bottom'};
            
            scope.shareMovie = attr.shareMovie;
            
            var template = $templateCache.get(attr.shareMovieTemplate);
            
            element.on('show', function (ev) {
              $('.popover.in').each(function () {
                var $this = $(this), popover = $this.data('popover');
                    if (popover && !popover.$element.is(element)) {
                        $this.popover('hide');
                    }
                });
            });
             
            element.popover(angular.extend({}, options, {
                content: template,
                html: true
            }));
              
            var popover = element.data('popover');
              
            popover.hasContent = function () {
                return this.getTitle() || template;
            };
              
            popover.getPosition = function () {
                var r = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);
                $compile(this.$tip)(scope);
                scope.$digest();
                this.$tip.data('popover', this);
                return r;
            };
              
            scope.$popover = function (name) {
                popover(name);
            };
              
            angular.forEach([
                'show',
                'hide'
              ], function (name) {
                scope[name] = function () {
                  //popover[name]();
                };
            });
              
            scope.dismiss = scope.hide;
            angular.forEach([
                'show',
                'shown',
                'hide',
                'hidden'
            ], function (name) {
                element.on(name, function (ev) {
                  //scope.$emit('popover-' + name, ev);
                });
            });
        }
    
    };
  }
]);

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