var app = angular.module('teleperiodExample', ['mgcrea.ngStrap', 'prTeleperiod']);


app.controller('MainCtrl', function($scope) {
    'use strict';

});


app.controller('SelectionCtrl', function($scope) {
    'use strict';
    $scope.time = new Date(1970, 0, 1, 10, 30);
});

