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

    .directive('prTeleperiod', function () {

        return {
            restrict: 'E',
            template: '<svg pr-scope-element="svg"></svg>',
            replace: true,

            link: function(scope, element, attrs) {

                scope.teleperiod = new Teleperiod({
                    object: d3.select(scope.svg[0]),

                    focusDate: new Date(2014, 11, 25),

                    workingtimes: function(interval) {

                        return Q.fcall(function () {
                            // return working times (selectable periods)

                            var workingtimes = [];
                            return workingtimes;
                        });
                    },

                    events: function(interval) {

                        return Q.fcall(function () {
                            // return other events displayed on the graph

                            var events = [];
                            return events;
                        });
                    },

                    onUpdated: function(selection) {

                        var dtstart = selection.dtstart ? selection.dtstart.toLocaleString() : null;
                        var dtend = selection.dtend ? selection.dtend.toLocaleString() : null;

                        d3.select('#dtstart').attr('value', dtstart);
                        d3.select('#dtend').attr('value', dtend);

                        d3.select('.duration').text(selection.getDuration()+' ms');
                        var details = d3.select('.details');
                        details.selectAll('p').remove();

                        var arr = selection.getValidPeriods();
                        for(var i=0; i< arr.length; i++) {
                            details.append('p').text('From '+arr[i].dtstart.toLocaleString()+ ' to '+arr[i].dtend.toLocaleString());
                        }
                    }
                });


                scope.teleperiod.draw();
            }
        };
    });
}());
