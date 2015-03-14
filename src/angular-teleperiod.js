(function() {
    'use strict';

    angular.module('tpTeleperiod', [])

    .directive('tpScopeElement', function () {
      return {
        restrict: 'A',
        compile: function compile() {
            return {
                pre: function preLink(scope, iElement, iAttrs) {
                    scope[iAttrs.tpScopeElement] = iElement;
                }
            };
        }
      };
    })

    .directive('tpTeleperiod', function() {

        return {
            restrict: 'AE',
            controller: function controller() {
                return function(scope, element) {

                }
            }
        };
    })

    .directive('tpPeriodPicker', function() {

        return {
            restrict: 'E',
            replace: true,
            require: '^tpTeleperiod',
            template: '<svg tp-scope-element="svg"></svg>',
            compile: function compile() {

                return function compile(scope, iElement, attrs, teleperiodScope) {


                    teleperiodScope.d3Svg = d3.select(scope.svg[0]);
                    scope.focusDate = attrs.focusDate || new Date();


                    teleperiodScope.teleperiod = new Teleperiod({
                        object: teleperiodScope.d3Svg,
                        focusDate: scope.focusDate,

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


                    teleperiodScope.teleperiod.draw();
                };

            }
        };
    })

    .directive('tpTimeline', function() {

        return {
            restrict: 'E',
            require: '^tpTeleperiod',
            link: function(scope, element, attrs, teleperiodScope) {

                console.log(attrs.name);

                var timeline = new Timeline(attrs.name, function(interval) {

                    var deferred = Q.defer();

                    var fn = scope[attrs.events];
                    if (fn === undefined) {
                        deferred.reject();
                    } else {
                        deferred.resolve(fn(interval));
                    }

                    return deferred.promise;
                });

                teleperiodScope.teleperiod.addTimeLine(timeline);
            }
        };
    });
}());
