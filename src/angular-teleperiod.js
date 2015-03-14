(function() {
    'use strict';

    angular.module('prTeleperiod', [])

    .directive('prScopeElement', function () {
      return {

        restrict: 'A',

        compile: function compile() {
            return {
                pre: function preLink(scope, iElement, iAttrs) {
                    scope[iAttrs.prScopeElement] = iElement;
                }
            };
        }
      };
    })

    .directive('prTeleperiod', function() {

        return {
            restrict: 'E',
            template: '<svg pr-scope-element="svg"></svg>',
            replace: true,

            link: function(scope, element, attrs) {

                scope.teleperiod = new Teleperiod({
                    object: d3.select(scope.svg[0]),

                    focusDate: attrs.focusDate || new Date(),

                    workingtimes: function(interval) {

                        var deferred = Q.defer();

                        var fn = scope[attrs.workingtimes];
                        if (fn === undefined) {
                            deferred.reject();
                        } else {
                            deferred.resolve(fn(interval));
                        }

                        return deferred.promise;
                    },

                    events: function(interval) {
                        var deferred = Q.defer();

                        var fn = scope[attrs.events];
                        if (fn === undefined) {
                            deferred.reject();
                        } else {
                            deferred.resolve(fn(interval));
                        }

                        return deferred.promise;
                    },

                    onUpdated: function(selection) {

                    }
                });


                scope.teleperiod.draw();
            }
        };
    });
}());
