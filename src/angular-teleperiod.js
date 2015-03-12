(function() {
    'use strict';

    angular.module('prTeleperiod', []).
    directive('prTeleperiod', function () {

        console.log('directive loaded');

        return {
            restrict: 'AE',
            scope: {

            },
            template: '<svg></svg>',
            replace: true,
            controller: ['$scope', function($scope) {


            }]
        };
    });
}());
