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
            controller: function controller($scope) {

                /**
                 * @param {string} method name in scope, get from the directive attribute
                 * @return {Promise}
                 */
                this.getPromisedData = function getPromisedData(method, interval) {
                    var deferred = Q.defer();

                    var fn = $scope[method];
                    if (fn === undefined) {
                        deferred.reject();
                    } else {
                        deferred.resolve(fn(interval));
                    }

                    return deferred.promise;
                };

            }
        };
    })

    .directive('tpPeriodPicker', function($parse) {

        return {
            restrict: 'E',
            replace: true,
            require: '^tpTeleperiod',
            template: '<svg tp-scope-element="svg"></svg>',
            compile: function compile() {

                return function compile(scope, iElement, attrs, teleperiodScope) {


                    teleperiodScope.d3Svg = d3.select(scope.svg[0]);
                    scope.focusDate = attrs.focusDate || new Date();


                    function updateScope(selection) {
                        $parse(attrs.dtstart).assign(scope, selection.dtstart);
                        $parse(attrs.dtend).assign(scope, selection.dtend);
                    }


                    teleperiodScope.teleperiod = new Teleperiod({
                        object: teleperiodScope.d3Svg,
                        focusDate: scope.focusDate,

                        workingtimes: function(interval) {
                            return teleperiodScope.getPromisedData(attrs.workingtimes, interval);
                        },

                        events: function(interval) {
                            return teleperiodScope.getPromisedData(attrs.events, interval);
                        },

                        onUpdated: function(selection) {
                            scope.$apply(function() {
                                updateScope(selection);
                            });
                        }
                    });


                    teleperiodScope.teleperiod.draw();


                    scope.$watch(attrs.dtstart, function(newValue) {

                        var selection = teleperiodScope.teleperiod.selection;

                        if (newValue) {
                            selection.dtstart = newValue;
                            selection.removeOverlay();
                            selection.highlightPeriods();
                        }
                    }, true);

                    scope.$watch(attrs.dtend, function(newValue) {

                        var selection = teleperiodScope.teleperiod.selection;

                        if (newValue) {
                            selection.dtend = newValue;
                            selection.removeOverlay();
                            selection.highlightPeriods();
                        }
                    }, true);

                };

            }
        };
    })

    .directive('tpTimeline', function() {

        return {
            restrict: 'E',
            require: '^tpTeleperiod',
            link: function(scope, element, attrs, teleperiodScope) {

                var timeline = new Timeline(attrs.name, function(interval) {
                    return teleperiodScope.getPromisedData(attrs.events, interval);
                });

                teleperiodScope.teleperiod.addTimeLine(timeline);
            }
        };
    });
}());
