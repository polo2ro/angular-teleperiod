(function() {
    'use strict';

    angular.module('prTeleperiodDirective', []).
    directive('prTeleperiod', function () {

        return {
            restrict: 'AE',
            scope: {

            },
            template: '<svg></svg>',
            replace: true,
            controller: ['$scope', '$http', function($scope, $http) {


            }]
        };
    });
}());
