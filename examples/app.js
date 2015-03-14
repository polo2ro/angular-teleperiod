var app = angular.module('teleperiodExample', ['mgcrea.ngStrap', 'prTeleperiod']);


app.controller('MainCtrl', function($scope) {
    'use strict';

    $scope.loadWorkingTimes = function(interval) {

        var workingtimes = [];
        var loop = new Date(interval.from);
        while (loop.getTime() < interval.to.getTime()) {

            if (loop.getDay() !== 0 && loop.getDay() !== 6) {

                var am = {};
                var pm = {};

                am.dtstart = new Date(loop);
                am.dtstart.setHours(9, 0, 0);

                am.dtend = new Date(loop);
                am.dtend.setHours(12, 0, 0);

                pm.dtstart = new Date(loop);
                pm.dtstart.setHours(13, 0, 0);

                pm.dtend = new Date(loop);
                pm.dtend.setHours(18, 0, 0);

                workingtimes.push(am);
                workingtimes.push(pm);
            }

            loop.setDate(loop.getDate() + 1);
        }

        return workingtimes;
    };



    $scope.loadEvents = function(interval) {
        return [];
    };
});


app.controller('SelectionCtrl', function($scope) {
    'use strict';
    $scope.time = new Date(1970, 0, 1, 10, 30);

});
