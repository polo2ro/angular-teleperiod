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
                    var directive = this;

                    var fn = $scope[method];
                    if (fn === undefined) {
                        // wait for scope availability ???
                        setTimeout(function() {
                            deferred.resolve(directive.getPromisedData(method, interval));
                        },200);
                        //deferred.reject('method '+method+' not found in scope');
                    } else {
                        deferred.resolve(fn(interval));
                    }

                    return deferred.promise;
                };


                this.timelines = [];

            }
        };
    })

    .directive('tpPeriodPicker', function($parse, $q) {

        return {
            restrict: 'E',
            replace: true,
            require: '^tpTeleperiod',
            template: '<svg tp-scope-element="svg"></svg>',
            compile: function compile() {

                return function compile(scope, iElement, attrs, teleperiodScope) {



                    var deferredSelectedEventsAttribute = $q.defer();
                    var selectedEventsPromise = deferredSelectedEventsAttribute.promise;

                    /**
                     * @param {Array} editList optional list of event uid
                     */
                    function initTeleperiod(editList)
                    {

                        teleperiodScope.d3Svg = d3.select(scope.svg[0]);

                        var focusDate;

                        if (undefined !== attrs.focusdate) {
                            var getter = $parse(attrs.focusdate);
                            focusDate = getter(scope);
                        } else {
                            focusDate = new Date();
                        }


                        function updateScope(selection) {
                            $parse(attrs.dtstart).assign(scope, selection.dtstart);
                            $parse(attrs.dtend).assign(scope, selection.dtend);

                            if (undefined !== attrs.periods) {
                                $parse(attrs.periods).assign(scope, selection.getValidPeriods());
                            }
                        }



                        var options = {
                            object: teleperiodScope.d3Svg,
                            focusDate: focusDate,
                            selectedEvents: editList,
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
                        };


                        if (undefined !== attrs.dayfirstminute) {
                            options.dayFirstMinute = $parse(attrs.dayfirstminute)(scope);
                        }


                        if (undefined !== attrs.daylastminute) {
                            options.dayLastMinute = $parse(attrs.daylastminute)(scope);
                        }


                        teleperiodScope.teleperiod = new Teleperiod(options);


                        teleperiodScope.timelines.forEach(function(timeline) {
                            teleperiodScope.teleperiod.addTimeLine(timeline);
                        });
                    }


                    // once ready is true, wait for the resolution of the selectedevents attribute before starting
                    scope.$watch(attrs.ready, function(newValue) {
                        if (true === newValue || undefined === newValue) {
                            selectedEventsPromise.then(function(editList) {
                                initTeleperiod(editList);
                                teleperiodScope.teleperiod.draw();
                            });
                        }
                    }, true);

                    
                    
                    scope.$watch(attrs.refreshevents, function(newValue) {

                        if (newValue && undefined !== teleperiodScope.teleperiod) {
                            teleperiodScope.teleperiod.refreshEvents();
                        }
                        
                        scope[attrs.refreshevents] = false;
                    }, true);


                    scope.$watch(attrs.dtstart, function(newValue) {

                        if ( undefined === teleperiodScope.teleperiod) {
                            return;
                        }

                        var selection = teleperiodScope.teleperiod.selection;

                        if (newValue) {
                            selection.dtstart = newValue;
                            selection.removeOverlay();
                            selection.highlightPeriods();
                        }
                    }, true);

                    scope.$watch(attrs.dtend, function(newValue) {

                        if ( undefined === teleperiodScope.teleperiod) {
                            return;
                        }

                        var selection = teleperiodScope.teleperiod.selection;

                        if (newValue) {
                            selection.dtend = newValue;
                            selection.removeOverlay();
                            selection.highlightPeriods();
                        }
                    }, true);


                    scope.$watch(attrs.selectedevents, function(newValue) {

                        if (undefined === newValue) {
                            deferredSelectedEventsAttribute.resolve();
                            return;
                        }

                        var editList = [];
                        newValue.forEach(function(evt) {
                            var eventId = null;
                            if (typeof evt === 'string') {
                                eventId = evt;
                            } else if(undefined === evt.uid) {
                                // No UID, the event can be set in selection before saving
                                // we do not edit events if this is the case
                                return;
                                //throw new Error('Selected events need a uid property');
                            } else {
                                eventId = evt.uid;
                            }

                            editList.push(eventId);
                        });

                        if (editList.length === 0) {
                            deferredSelectedEventsAttribute.resolve();
                            return;
                        }


                        if (undefined === teleperiodScope.teleperiod) {
                            deferredSelectedEventsAttribute.resolve(editList);
                            return;
                        }


                        teleperiodScope.teleperiod.editEvents(editList);

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

                if (undefined === teleperiodScope.teleperiod) {
                    teleperiodScope.timelines.push(timeline);
                } else {
                    teleperiodScope.teleperiod.addTimeLine(timeline);
                }

            }
        };
    });
}());
